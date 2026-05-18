/**
 * LLM utility — supports Ollama (local) and OpenAI
 * All public functions keep identical signatures regardless of provider.
 */

const PROVIDER_STORAGE_KEY = 'ai_provider';
const OLLAMA_BASE = '';

export const OLLAMA_MODEL = 'llama3.1:8b';
export const OPENAI_MODEL = 'gpt-4o-mini';

export const getProvider = () =>
  localStorage.getItem(PROVIDER_STORAGE_KEY) ||
  import.meta.env.VITE_DEFAULT_AI_PROVIDER ||
  (import.meta.env.VITE_OPENAI_API_KEY ? 'openai' : 'ollama');

export const setProvider = (p) => localStorage.setItem(PROVIDER_STORAGE_KEY, p);

export const getModel = () =>
  getProvider() === 'openai' ? OPENAI_MODEL : OLLAMA_MODEL;

// ── Health checks ─────────────────────────────────────────────────────────────

export const checkOllama = async () => {
  try {
    const res = await fetch(`${OLLAMA_BASE}/api/tags`, {
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) return { ok: false, error: `Server returned ${res.status}` };
    const data = await res.json();
    const hasModel = data.models?.some(m => m.name.startsWith('llama3.1'));
    return { ok: true, hasModel, models: data.models ?? [] };
  } catch (err) {
    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      return { ok: false, error: 'Connection timed out' };
    }
    return { ok: false, error: 'Ollama not running' };
  }
};

export const hasOpenAIKey = () => Boolean(import.meta.env.VITE_OPENAI_API_KEY);

// ── Streaming backends ────────────────────────────────────────────────────────

const streamChatOllama = async ({ system, user: userMsg, onChunk }) => {
  const messages = [];
  if (system) messages.push({ role: 'system', content: system });
  messages.push({ role: 'user', content: userMsg });

  let res;
  try {
    res = await fetch(`${OLLAMA_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: OLLAMA_MODEL, messages, stream: true }),
    });
  } catch {
    throw new Error('NO_OLLAMA');
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    if (res.status === 404 || body.includes('model') || body.includes('not found')) {
      throw new Error('NO_MODEL');
    }
    throw new Error(`Ollama error ${res.status}: ${body}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const json = JSON.parse(line);
        if (json.message?.content) onChunk(json.message.content);
      } catch { /* partial JSON */ }
    }
  }
};

const streamChatOpenAI = async ({ system, user: userMsg, onChunk }) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_KEY_MISSING');

  const messages = [];
  if (system) messages.push({ role: 'system', content: system });
  messages.push({ role: 'user', content: userMsg });

  let res;
  try {
    res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model: OPENAI_MODEL, messages, stream: true }),
    });
  } catch {
    throw new Error('OPENAI_NETWORK_ERROR');
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    if (res.status === 401) throw new Error('OPENAI_INVALID_KEY');
    if (res.status === 429) throw new Error('OPENAI_RATE_LIMIT');
    throw new Error(`OpenAI error ${res.status}: ${body}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') return;
      try {
        const json = JSON.parse(data);
        const content = json.choices?.[0]?.delta?.content;
        if (content) onChunk(content);
      } catch { /* skip */ }
    }
  }
};

const streamChat = (args) =>
  getProvider() === 'openai'
    ? streamChatOpenAI(args)
    : streamChatOllama(args);

// ── Public API ────────────────────────────────────────────────────────────────

export const searchDocuments = async ({
  query, documents, userClearance, companyName,
  azureContext, onChunk,
}) => {
  const docContext = documents.length > 0
    ? documents.map(d =>
        `[DOC: "${d.title}" | Clearance: ${d.clearance} | Category: ${d.category}]\n${d.content}`
      ).join('\n\n---\n\n')
    : 'No documents available.';

  const azSection = azureContext
    ? `\n\nAZURE DEVOPS CONTEXT:\n${azureContext}`
    : '';

  const system = `You are an enterprise intelligence search assistant for ${companyName}. The user has ${userClearance} clearance. You only see documents they are authorised to access.

Rules:
- Answer clearly and directly
- Cite sources: [Source: "Document Title"]
- Use markdown (headers, bullets, bold)
- If the answer isn't in the provided context, say so — never fabricate`;

  const user = `AVAILABLE DOCUMENTS:\n${docContext}${azSection}\n\nQUESTION: ${query}`;

  return streamChat({ system, user, onChunk });
};

export const generateOnboardingGuide = async ({ user, documents, companyName, onChunk }) => {
  const docList = documents
    .map(d => `- "${d.title}" (${d.clearance} | ${d.category})`)
    .join('\n');

  const prompt = `Generate a personalised 30-day onboarding plan for this employee at ${companyName}.

EMPLOYEE:
- Name: ${user.name}
- Role: ${user.role}
- Department: ${user.department}
- Clearance Level: ${user.clearance}

DOCUMENTS THEY CAN ACCESS:
${docList}

Structure the guide with these sections:
1. **Welcome & Overview** — company culture and what their role means
2. **Week 1 Priorities** — first steps, key contacts, systems to set up
3. **Week 2–3 Focus** — deep dives, first contributions, learning goals
4. **Week 4 Milestones** — what Day 30 success looks like
5. **Recommended Reading** — cite specific documents from the list above, in priority order
6. **Key Connections** — teams and roles to build relationships with
7. **30-Day Success Criteria** — 3–5 measurable outcomes

Be specific to the role (${user.role}) and department (${user.department}). Reference actual document titles.`;

  return streamChat({ user: prompt, onChunk });
};

export const askAboutCode = async ({ question, fileContent, fileName, repoName, onChunk }) => {
  const truncated = fileContent.length > 10000
    ? fileContent.slice(0, 10000) + '\n... (truncated)'
    : fileContent;

  const system = 'You are a senior software engineer and code analyst. Answer questions about code clearly and technically. Use markdown formatting and code examples where helpful.';

  const user = `Repository: ${repoName}
File: ${fileName}

CODE:
\`\`\`
${truncated}
\`\`\`

QUESTION: ${question}`;

  return streamChat({ system, user, onChunk });
};

export const askAboutRepo = async ({
  question, repoInfo, fileList, commits,
  selectedFile, fileContent, onChunk,
}) => {
  const repoContext = [
    `Repository: ${repoInfo.full_name}`,
    `Description: ${repoInfo.description || 'No description'}`,
    `Primary Language: ${repoInfo.language || 'Unknown'}`,
    `Stars: ${repoInfo.stargazers_count?.toLocaleString()} | Forks: ${repoInfo.forks_count?.toLocaleString()}`,
    `Default Branch: ${repoInfo.default_branch}`,
    repoInfo.topics?.length ? `Topics: ${repoInfo.topics.join(', ')}` : '',
    repoInfo.license?.name ? `License: ${repoInfo.license.name}` : '',
    `Open Issues: ${repoInfo.open_issues_count}`,
  ].filter(Boolean).join('\n');

  const fileSection = fileList.length
    ? `\nFILE STRUCTURE (${fileList.length} files):\n${fileList.slice(0, 80).join('\n')}${fileList.length > 80 ? `\n… and ${fileList.length - 80} more` : ''}`
    : '';

  const commitsSection = commits.length
    ? `\nRECENT COMMITS:\n${commits.map(c =>
        `- ${c.sha.slice(0, 7)}: ${c.commit.message.split('\n')[0]} (${c.commit.author.name}, ${c.commit.author.date?.split('T')[0]})`
      ).join('\n')}`
    : '';

  const openFile = selectedFile && fileContent
    ? `\n\nOPEN FILE: ${selectedFile}\n\`\`\`\n${fileContent.slice(0, 8000)}${fileContent.length > 8000 ? '\n… (truncated)' : ''}\n\`\`\``
    : '';

  const system = 'You are an expert software engineer and repository analyst. Answer questions about GitHub repositories accurately. Reference specific files, commits, or patterns from the provided context. Use markdown formatting.';

  const user = `REPOSITORY OVERVIEW:\n${repoContext}${fileSection}${commitsSection}${openFile}\n\nQUESTION: ${question}`;

  return streamChat({ system, user, onChunk });
};

export const askAboutAzure = async ({ question, azureData, companyName, onChunk }) => {
  const context = JSON.stringify(azureData, null, 2);

  const system = `You are a DevOps and engineering intelligence assistant for ${companyName}. Answer questions using the Azure DevOps data provided. Reference specific repos, pipelines, work items, or wiki pages. Use markdown.`;

  const user = `AZURE DEVOPS DATA:\n${context}\n\nQUESTION: ${question}`;

  return streamChat({ system, user, onChunk });
};
