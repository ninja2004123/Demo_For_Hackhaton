const GH_API = 'https://api.github.com';

const headers = (token) => ({
  Accept: 'application/vnd.github.v3+json',
  ...(token ? { Authorization: `token ${token}` } : {}),
});

const parseRepoUrl = (url) => {
  const match = url.match(/github\.com\/([^/]+)\/([^/\s]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
};

export const fetchRepo = async (url, token) => {
  const parsed = parseRepoUrl(url);
  if (!parsed) throw new Error('Invalid GitHub URL');
  const { owner, repo } = parsed;

  const res = await fetch(`${GH_API}/repos/${owner}/${repo}`, { headers: headers(token) });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  return res.json();
};

export const fetchTree = async (url, token, branch = 'HEAD') => {
  const parsed = parseRepoUrl(url);
  if (!parsed) throw new Error('Invalid GitHub URL');
  const { owner, repo } = parsed;

  const res = await fetch(`${GH_API}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, { headers: headers(token) });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const data = await res.json();
  return data.tree || [];
};

export const fetchFileContent = async (url, path, token, branch = 'HEAD') => {
  const parsed = parseRepoUrl(url);
  if (!parsed) throw new Error('Invalid GitHub URL');
  const { owner, repo } = parsed;

  const res = await fetch(`${GH_API}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`, { headers: headers(token) });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const data = await res.json();
  if (data.encoding === 'base64') {
    return atob(data.content.replace(/\n/g, ''));
  }
  return data.content || '';
};

export const fetchCommits = async (url, token) => {
  const parsed = parseRepoUrl(url);
  if (!parsed) throw new Error('Invalid GitHub URL');
  const { owner, repo } = parsed;

  const res = await fetch(`${GH_API}/repos/${owner}/${repo}/commits?per_page=10`, { headers: headers(token) });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
};

export const buildFileTree = (treeItems) => {
  const root = {};
  treeItems.forEach(item => {
    const parts = item.path.split('/');
    let current = root;
    parts.forEach((part, i) => {
      if (i === parts.length - 1) {
        current[part] = { ...item, name: part, isFile: item.type === 'blob' };
      } else {
        current[part] = current[part] || { name: part, isFile: false, children: {} };
        current = current[part].children || (current[part].children = {});
      }
    });
  });
  return root;
};
