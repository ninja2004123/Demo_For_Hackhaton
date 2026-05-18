import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTenant } from '../contexts/TenantContext.jsx';
import { getItem } from '../utils/storage.js';
import { askAboutAzure } from '../utils/anthropic.js';
import { OllamaError } from '../components/OllamaError.jsx';
import { Cloud, GitBranch, Play, CheckCircle, XCircle, Clock, BookOpen, Send, Loader, Lock, Sparkles } from 'lucide-react';
import { CLEARANCE_LEVELS } from '../utils/clearance.js';

const STATUS_ICON = {
  succeeded: <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />,
  running:   <Loader className="w-3.5 h-3.5 text-blue-400 animate-spin" />,
  failed:    <XCircle className="w-3.5 h-3.5 text-red-400" />,
  queued:    <Clock className="w-3.5 h-3.5 text-amber-400" />,
};

const PRIORITY_COLOR = {
  Critical: 'text-red-400 bg-red-500/10',
  High:     'text-amber-400 bg-amber-500/10',
  Medium:   'text-blue-400 bg-blue-500/10',
  Low:      'text-slate-400 bg-slate-700',
};

const STATUS_COLOR = {
  'In Progress': 'bg-blue-500/10 text-blue-300',
  'Done':        'bg-emerald-500/10 text-emerald-300',
  'To Do':       'bg-slate-700 text-slate-400',
};

export const AzureDevOps = () => {
  const { tenantId } = useParams();
  const { user } = useAuth();
  const { currentTenant } = useTenant();
  const userLevel = CLEARANCE_LEVELS[user?.clearance]?.level ?? 0;
  const [activeTab, setActiveTab] = useState('repos');
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState('');
  const [selectedProject, setSelectedProject] = useState(0);

  const azureData = getItem(tenantId, 'azureData', null);

  if (userLevel < 3) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="card p-12 text-center">
          <Lock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-300 mb-2">L3 Clearance Required</h2>
          <p className="text-slate-500 text-sm">Azure DevOps integration is available for Confidential clearance and above.</p>
        </div>
      </div>
    );
  }

  if (!azureData) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="card p-12 text-center">
          <Cloud className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-300 mb-2">No Azure Data</h2>
          <p className="text-slate-500 text-sm">No Azure DevOps data is configured for this workspace.</p>
        </div>
      </div>
    );
  }

  const project = azureData.projects?.[selectedProject];

  const askAI = async () => {
    if (!question.trim()) return;
    setLoadingAI(true);
    setAiResponse('');
    setAiError('');
    try {
      await askAboutAzure({
        question,
        azureData,
        companyName: currentTenant?.name || 'Enterprise',
        onChunk: (t) => setAiResponse(p => p + t),
      });
    } catch (err) {
      setAiError(err.message || 'Unknown error');
    } finally {
      setLoadingAI(false);
    }
  };

  const tabs = [
    { id: 'repos', label: 'Repositories', icon: GitBranch },
    { id: 'pipelines', label: 'Pipelines', icon: Play },
    { id: 'workitems', label: 'Work Items', icon: CheckCircle },
    { id: 'wiki', label: 'Wiki', icon: BookOpen },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      {/* Header */}
      <div className="card p-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600/20 flex items-center justify-center">
            <Cloud className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100">{azureData.organization}</p>
            <p className="text-xs text-slate-500">Azure DevOps · Simulated environment</p>
          </div>
        </div>
        {azureData.projects?.length > 1 && (
          <select className="select w-auto text-xs" value={selectedProject} onChange={e => setSelectedProject(Number(e.target.value))}>
            {azureData.projects.map((p, i) => <option key={p.id} value={i}>{p.name}</option>)}
          </select>
        )}
      </div>

      {/* AI Q&A */}
      {aiError && <OllamaError error={aiError} />}

      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ask AI about your DevOps environment</span>
        </div>
        <div className="flex gap-2">
          <input
            className="input flex-1 text-sm"
            placeholder="What's the status of our pipelines? Which work items are in progress?"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !loadingAI && askAI()}
          />
          <button onClick={askAI} disabled={loadingAI || !question.trim()} className="btn-primary flex items-center gap-2">
            {loadingAI ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Ask
          </button>
        </div>
        {aiResponse && (
          <div className="mt-3 bg-slate-900 rounded-lg p-4 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap border border-slate-700">
            {aiResponse}
            {loadingAI && <span className="typing-cursor" />}
          </div>
        )}
      </div>

      {project && (
        <>
          {/* Tabs */}
          <div className="flex gap-1 border-b border-slate-800">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === id ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />{label}
              </button>
            ))}
          </div>

          {/* Repos tab */}
          {activeTab === 'repos' && (
            <div className="space-y-3">
              {project.repos?.map(repo => (
                <div key={repo.id} className="card p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-slate-100">{repo.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{repo.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="bg-slate-700 px-2 py-0.5 rounded">{repo.language}</span>
                      <span>{repo.commits} commits</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs text-slate-500 font-medium mb-1">Recent commits</p>
                    {repo.recentCommits?.map(c => (
                      <div key={c.sha} className="flex items-center gap-2 text-xs">
                        <code className="text-slate-600 font-mono w-14 flex-shrink-0">{c.sha}</code>
                        <span className="text-slate-300 flex-1 truncate">{c.message}</span>
                        <span className="text-slate-600 flex-shrink-0">{c.author} · {c.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pipelines tab */}
          {activeTab === 'pipelines' && (
            <div className="space-y-2">
              {project.pipelines?.map(pipe => (
                <div key={pipe.id} className="card p-4 flex items-center gap-4">
                  {STATUS_ICON[pipe.status] || <AlertCircle className="w-3.5 h-3.5 text-slate-500" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200">{pipe.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Branch: {pipe.branch} · {pipe.lastRun} · {pipe.duration}</p>
                  </div>
                  <p className="text-xs text-slate-500">{pipe.triggeredBy}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    pipe.status === 'succeeded' ? 'bg-emerald-500/10 text-emerald-400' :
                    pipe.status === 'running'   ? 'bg-blue-500/10 text-blue-400' :
                    pipe.status === 'failed'    ? 'bg-red-500/10 text-red-400' :
                    'bg-slate-700 text-slate-400'
                  }`}>{pipe.status}</span>
                </div>
              ))}
            </div>
          )}

          {/* Work items tab */}
          {activeTab === 'workitems' && (
            <div className="space-y-2">
              {project.workItems?.map(item => (
                <div key={item.id} className="card p-4 flex items-start gap-4">
                  <code className="text-xs text-slate-600 font-mono mt-0.5 flex-shrink-0">{item.id}</code>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-600">{item.type}</span>
                      <span className="text-xs text-slate-600">·</span>
                      <span className="text-xs text-slate-500">{item.assignee}</span>
                      <span className="text-xs text-slate-600">·</span>
                      <span className="text-xs text-slate-600">{item.sprint}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${PRIORITY_COLOR[item.priority] || 'bg-slate-700 text-slate-400'}`}>{item.priority}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLOR[item.status] || 'bg-slate-700 text-slate-400'}`}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Wiki tab */}
          {activeTab === 'wiki' && (
            <div className="space-y-3">
              {project.wiki?.map(page => (
                <div key={page.id} className="card p-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-medium text-slate-100">{page.title}</p>
                    <span className="text-xs text-slate-600">Updated {page.lastUpdated} by {page.author}</span>
                  </div>
                  <p className="text-sm text-slate-400">{page.preview}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
