import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { fetchRepo, fetchTree, fetchFileContent, fetchCommits } from '../utils/github.js';
import { askAboutRepo } from '../utils/anthropic.js';
import { getGlobal } from '../utils/storage.js';
import { OllamaError } from '../components/OllamaError.jsx';
import {
  Github, Search, File, Folder, ChevronRight, Loader, Send,
  Lock, GitCommit, AlertCircle, Sparkles, X, BookOpen,
} from 'lucide-react';
import { CLEARANCE_LEVELS } from '../utils/clearance.js';

const DEMO_REPOS = [
  'https://github.com/anthropics/anthropic-sdk-python',
  'https://github.com/vitejs/vite',
  'https://github.com/facebook/react',
];

const REPO_QUESTIONS = [
  'What is the overall architecture of this project?',
  'What are the main dependencies and why are they used?',
  'How is the project structured? Walk me through the key directories.',
  'What testing approach does this project use?',
  'What are the most recent changes and what do they tell us about direction?',
];

const FILE_QUESTIONS = [
  'What does this file do and how does it fit into the project?',
  'Are there any potential bugs or issues in this code?',
  'How could this code be improved or refactored?',
  'Explain the most complex part of this file.',
];

// ── File tree ─────────────────────────────────────────────────────────────────

const FileTree = ({ tree, onSelect, selected, prefix = '' }) => {
  const [expanded, setExpanded] = useState({});
  const entries = Object.entries(tree).sort(([, a], [, b]) => {
    if (!a.isFile && b.isFile) return -1;
    if (a.isFile && !b.isFile) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="text-xs">
      {entries.map(([name, node]) => {
        const path = prefix ? `${prefix}/${name}` : name;
        if (node.isFile) {
          return (
            <button
              key={path}
              onClick={() => onSelect(node.path)}
              className={`flex items-center gap-1.5 w-full px-2 py-1 rounded hover:bg-slate-700 transition-colors text-left truncate ${
                selected === node.path ? 'bg-blue-600/20 text-blue-300' : 'text-slate-400'
              }`}
            >
              <File className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{name}</span>
            </button>
          );
        }
        return (
          <div key={path}>
            <button
              onClick={() => setExpanded(e => ({ ...e, [path]: !e[path] }))}
              className="flex items-center gap-1.5 w-full px-2 py-1 rounded hover:bg-slate-700 transition-colors text-slate-300"
            >
              <ChevronRight className={`w-3 h-3 flex-shrink-0 transition-transform ${expanded[path] ? 'rotate-90' : ''}`} />
              <Folder className="w-3 h-3 flex-shrink-0 text-blue-400" />
              <span className="truncate">{name}</span>
            </button>
            {expanded[path] && node.children && (
              <div className="pl-4 border-l border-slate-700 ml-3">
                <FileTree tree={node.children} onSelect={onSelect} selected={selected} prefix={path} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const buildTree = (flat) => {
  const root = {};
  flat.forEach(item => {
    const parts = item.path.split('/');
    let cur = root;
    parts.forEach((part, i) => {
      if (i === parts.length - 1) {
        cur[part] = { ...item, name: part, isFile: item.type === 'blob', children: undefined };
      } else {
        cur[part] = cur[part] || { name: part, isFile: false, children: {} };
        cur = cur[part].children;
      }
    });
  });
  return root;
};

// ── Repo AI panel ─────────────────────────────────────────────────────────────

const RepoAIPanel = ({ repoInfo, flatFiles, commits, selectedFile, fileContent }) => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const hasFile = Boolean(selectedFile && fileContent);
  const examples = hasFile ? FILE_QUESTIONS : REPO_QUESTIONS;

  const ask = async (q = question) => {
    if (!q.trim()) return;
    setLoading(true);
    setResponse('');
    setError('');
    setQuestion(q);
    try {
      await askAboutRepo({
        question: q,
        repoInfo,
        fileList: flatFiles,
        commits,
        selectedFile: hasFile ? selectedFile : null,
        fileContent: hasFile ? fileContent : null,
        onChunk: (t) => setResponse(p => p + t),
      });
    } catch (err) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-blue-400" />
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Ask AI about this repository
        </span>
        {hasFile && (
          <span className="ml-auto text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
            + {selectedFile?.split('/').pop()} in context
          </span>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          className="input flex-1 text-sm"
          placeholder={hasFile
            ? `Ask about ${selectedFile?.split('/').pop()} or the whole repo…`
            : 'What does this project do? How is it structured?'
          }
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !loading && ask()}
        />
        <button
          onClick={() => ask()}
          disabled={loading || !question.trim()}
          className="btn-primary flex items-center gap-2 flex-shrink-0"
        >
          {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Ask
        </button>
      </div>

      {/* Example chips */}
      {!response && !loading && (
        <div className="flex flex-wrap gap-1.5">
          {examples.map(q => (
            <button
              key={q}
              onClick={() => ask(q)}
              className="text-xs px-2.5 py-1 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg text-slate-400 hover:text-slate-200 transition-colors text-left"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      {error && <OllamaError error={error} />}

      {/* Loading state */}
      {loading && !response && (
        <div className="flex items-center gap-2 text-slate-500 text-sm py-2">
          <Loader className="w-4 h-4 animate-spin text-blue-400" />
          Analysing repository…
        </div>
      )}

      {/* Response */}
      {response && (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">
              {repoInfo.full_name}{hasFile ? ` · ${selectedFile}` : ''}
            </span>
            {!loading && (
              <button
                onClick={() => { setResponse(''); setQuestion(''); }}
                className="text-slate-600 hover:text-slate-400 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className={`text-sm text-slate-300 leading-relaxed whitespace-pre-wrap ${loading ? 'typing-cursor' : ''}`}>
            {response}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

export const GitHub = () => {
  const { user } = useAuth();
  const userLevel = CLEARANCE_LEVELS[user?.clearance]?.level ?? 0;

  const [repoUrl, setRepoUrl]       = useState('');
  const [token, setToken]           = useState(() => getGlobal('githubToken') || '');
  const [repoInfo, setRepoInfo]     = useState(null);
  const [tree, setTree]             = useState(null);
  const [flatFiles, setFlatFiles]   = useState([]);
  const [commits, setCommits]       = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent]   = useState('');
  const [loadingRepo, setLoadingRepo]   = useState(false);
  const [loadingFile, setLoadingFile]   = useState(false);
  const [error, setError]               = useState('');

  if (userLevel < 3) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="card p-12 text-center">
          <Lock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-300 mb-2">L3 Clearance Required</h2>
          <p className="text-slate-500 text-sm">GitHub integration is available for Confidential clearance and above.</p>
          <p className="text-slate-600 text-xs mt-2">Your clearance: {user?.clearance} · Required: L3</p>
        </div>
      </div>
    );
  }

  const loadRepo = async () => {
    if (!repoUrl.trim()) return;
    setError('');
    setLoadingRepo(true);
    setTree(null);
    setRepoInfo(null);
    setFlatFiles([]);
    setFileContent('');
    setSelectedFile(null);
    if (token) setGlobal('githubToken', token);
    try {
      const [info, rawTree, commitsData] = await Promise.all([
        fetchRepo(repoUrl, token),
        fetchTree(repoUrl, token),
        fetchCommits(repoUrl, token),
      ]);
      const blobs = rawTree.filter(i => i.type === 'blob' && !i.path.includes('node_modules'));
      setRepoInfo(info);
      setFlatFiles(blobs.map(i => i.path));
      setTree(buildTree(blobs));
      setCommits(commitsData.slice(0, 10));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingRepo(false);
    }
  };

  const loadFile = async (path) => {
    setSelectedFile(path);
    setFileContent('');
    setLoadingFile(true);
    try {
      const content = await fetchFileContent(repoUrl, path, token);
      setFileContent(content);
    } catch (err) {
      setFileContent(`// Error loading file: ${err.message}`);
    } finally {
      setLoadingFile(false);
    }
  };


  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4">

      {/* ── Repo input ── */}
      <div className="card p-4">
        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              className="input pl-9"
              placeholder="https://github.com/owner/repo"
              value={repoUrl}
              onChange={e => setRepoUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && loadRepo()}
            />
          </div>
          <input
            type="password"
            className="input w-48 text-xs"
            placeholder="GitHub token (optional)"
            value={token}
            onChange={e => setToken(e.target.value)}
          />
          <button onClick={loadRepo} disabled={loadingRepo || !repoUrl.trim()} className="btn-primary flex items-center gap-2">
            {loadingRepo ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {loadingRepo ? 'Loading…' : 'Load Repo'}
          </button>
        </div>
        <div className="flex gap-3 mt-2 flex-wrap">
          <span className="text-xs text-slate-600">Try:</span>
          {DEMO_REPOS.map(r => (
            <button key={r} onClick={() => setRepoUrl(r)} className="text-xs text-slate-500 hover:text-blue-400 transition-colors">
              {r.replace('https://github.com/', '')}
            </button>
          ))}
        </div>
        {error && (
          <div className="mt-3 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            GitHub error: {error}
          </div>
        )}
      </div>



      {/* ── Repo header ── */}
      {repoInfo && (
        <div className="card p-4">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <p className="font-semibold text-slate-100">{repoInfo.full_name}</p>
              <p className="text-xs text-slate-400 mt-0.5">{repoInfo.description}</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
              <span>⭐ {repoInfo.stargazers_count?.toLocaleString()}</span>
              <span>🍴 {repoInfo.forks_count?.toLocaleString()}</span>
              {repoInfo.language && <span className="bg-slate-700 px-2 py-0.5 rounded">{repoInfo.language}</span>}
              <span>Branch: <span className="text-slate-300">{repoInfo.default_branch}</span></span>
              <span>{flatFiles.length} files</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Repo AI panel (visible as soon as repo loads) ── */}
      {repoInfo && (
        <RepoAIPanel
          repoInfo={repoInfo}
          flatFiles={flatFiles}
          commits={commits}
          selectedFile={selectedFile}
          fileContent={fileContent}
        />
      )}

      {/* ── Browser + file viewer ── */}
      {tree && (
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4">

          {/* File tree */}
          <div className="card p-3 overflow-y-auto max-h-[520px]">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 mb-2">
              Files
            </p>
            <FileTree tree={tree} onSelect={loadFile} selected={selectedFile} />
          </div>

          {/* Right panel */}
          <div className="space-y-3 min-w-0">

            {/* No file selected: recent commits */}
            {!selectedFile && commits.length > 0 && (
              <div className="card p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Recent Commits
                </p>
                <div className="space-y-2">
                  {commits.map(c => (
                    <div key={c.sha} className="flex items-start gap-2 text-xs">
                      <GitCommit className="w-3 h-3 text-slate-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-300 truncate">{c.commit.message.split('\n')[0]}</p>
                        <p className="text-slate-600 mt-0.5">
                          {c.commit.author.name} · {c.commit.author.date?.split('T')[0]}
                        </p>
                      </div>
                      <code className="text-slate-600 font-mono flex-shrink-0">{c.sha.slice(0, 7)}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No file selected: hint */}
            {!selectedFile && (
              <div className="card p-5 text-center border-dashed">
                <BookOpen className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500">
                  Select a file from the tree to view its contents — the AI panel above will automatically include it in context.
                </p>
              </div>
            )}

            {/* File viewer */}
            {selectedFile && (
              <div className="card overflow-hidden">
                <div className="px-4 py-2 border-b border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <File className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-xs text-slate-300 font-mono">{selectedFile}</span>
                  </div>
                  <button
                    onClick={() => { setSelectedFile(null); setFileContent(''); }}
                    className="text-slate-600 hover:text-slate-400 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                {loadingFile ? (
                  <div className="p-6 flex items-center gap-2 text-slate-500 text-sm">
                    <Loader className="w-4 h-4 animate-spin" /> Loading…
                  </div>
                ) : (
                  <pre className="p-4 text-xs text-slate-300 overflow-x-auto max-h-80 font-mono leading-relaxed">
                    {fileContent || '(empty file)'}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
