import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTenant } from '../contexts/TenantContext.jsx';
import { getItem, setItem } from '../utils/storage.js';
import { filterByAccess } from '../utils/clearance.js';
import { searchDocuments, MODEL } from '../utils/anthropic.js';
import { ClearanceBadge } from '../components/ClearanceBadge.jsx';
import { OllamaError } from '../components/OllamaError.jsx';
import { Search, Send, FileText, Loader, Cloud, Sparkles, Terminal, Trash2 } from 'lucide-react';

const EXAMPLE_QUERIES = [
  'What is the vacation and PTO policy?',
  'Explain our system architecture and tech stack',
  'What does the performance review process look like?',
  'Summarise the engineering onboarding steps',
  'What are the key compliance requirements?',
];

const MarkdownRenderer = ({ text }) => {
  const lines = text.split('\n');
  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => {
        if (line.startsWith('## '))   return <h2 key={i} className="text-base font-semibold text-slate-100 mt-4 mb-1">{line.slice(3)}</h2>;
        if (line.startsWith('# '))    return <h1 key={i} className="text-lg font-bold text-slate-100 mt-4 mb-2">{line.slice(2)}</h1>;
        if (line.startsWith('### '))  return <h3 key={i} className="text-sm font-semibold text-slate-200 mt-3 mb-1">{line.slice(4)}</h3>;
        if (line.startsWith('- ') || line.startsWith('• '))
          return <li key={i} className="text-sm text-slate-300 ml-4 mb-0.5 list-disc">{formatInline(line.slice(2))}</li>;
        if (/^\d+\. /.test(line))
          return <li key={i} className="text-sm text-slate-300 ml-4 mb-0.5 list-decimal">{formatInline(line.replace(/^\d+\. /, ''))}</li>;
        if (line === '' || line === '---') return <div key={i} className="h-1.5" />;
        return <p key={i} className="text-sm text-slate-300 leading-relaxed">{formatInline(line)}</p>;
      })}
    </div>
  );
};

const formatInline = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[Source: "[^"]+"\])/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i} className="text-slate-100 font-semibold">{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*'))
      return <em key={i} className="italic text-slate-200">{part.slice(1, -1)}</em>;
    if (part.startsWith('`') && part.endsWith('`'))
      return <code key={i} className="bg-slate-700 text-blue-300 px-1 py-0.5 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
    if (part.startsWith('[Source:')) {
      const name = part.match(/\[Source: "([^"]+)"\]/)?.[1] || part;
      return (
        <span key={i} className="inline-flex items-center gap-1 text-xs bg-blue-500/15 text-blue-300 px-1.5 py-0.5 rounded font-medium">
          <FileText className="w-3 h-3" />{name}
        </span>
      );
    }
    return part;
  });
};

export const AISearch = () => {
  const { tenantId } = useParams();
  const { user } = useAuth();
  const { currentTenant } = useTenant();

  const storageKey = `chat:${user.id}`;

  const [messages, setMessages] = useState(() => getItem(tenantId, storageKey, []));
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [streamingText, setStreamingText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [includeAzure, setIncludeAzure] = useState(false);

  const bottomRef = useRef(null);

  const docs = getItem(tenantId, 'documents', []);
  const accessibleDocs = filterByAccess(docs, user.clearance);

  // Persist messages whenever they change
  useEffect(() => {
    setItem(tenantId, storageKey, messages);
  }, [messages, tenantId, storageKey]);

  // Scroll to bottom on new content
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  const handleSearch = async (q = query) => {
    if (!q.trim() || loading) return;
    setLoading(true);
    setStreamingText('');
    setError('');
    setActiveQuery(q);
    setQuery('');

    let azureContext = null;
    if (includeAzure) {
      const azData = getItem(tenantId, 'azureData', null);
      if (azData) {
        azureContext = `Organization: ${azData.organization}. Projects: ${azData.projects.map(p => p.name).join(', ')}. Work items: ${azData.projects.flatMap(p => p.workItems || []).slice(0, 5).map(w => w.title).join('; ')}.`;
      }
    }

    let fullText = '';
    try {
      await searchDocuments({
        query: q,
        documents: accessibleDocs,
        userClearance: user.clearance,
        companyName: currentTenant?.name || 'Enterprise',
        azureContext,
        onChunk: (text) => {
          fullText += text;
          setStreamingText(fullText);
        },
      });

      setMessages(prev => [...prev, {
        id: Date.now(),
        query: q,
        response: fullText,
        sourceDocs: accessibleDocs,
        timestamp: new Date().toISOString(),
      }]);
    } catch (err) {
      setError(err.message || 'Unknown error');
    } finally {
      setStreamingText('');
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
    setError('');
  };

  const isEmpty = messages.length === 0 && !loading && !error;

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-6 gap-4">
      {/* Context banner */}
      <div className="card p-3 flex items-center gap-3 text-xs text-slate-400 flex-shrink-0">
        <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0" />
        <span>
          Searching <span className="text-slate-200 font-medium">{accessibleDocs.length}</span> documents at your{' '}
          <ClearanceBadge level={user.clearance} size="xs" /> clearance · Model: <code className="text-blue-300">{MODEL}</code>
        </span>
        <span className="ml-auto flex items-center gap-2 text-slate-600">
          <Terminal className="w-3 h-3" /> local
          {messages.length > 0 && (
            <button
              onClick={handleClear}
              className="ml-2 flex items-center gap-1 text-slate-500 hover:text-red-400 transition-colors"
              title="Clear chat history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </span>
      </div>

      {/* Chat history */}
      <div className="flex-1 overflow-y-auto space-y-4 min-h-0">
        {/* Example queries — only shown when no history */}
        {isEmpty && (
          <div>
            <p className="text-xs text-slate-500 mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_QUERIES.map(q => (
                <button
                  key={q}
                  onClick={() => handleSearch(q)}
                  className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Past messages */}
        {messages.map(msg => (
          <div key={msg.id} className="space-y-2">
            {/* User query bubble */}
            <div className="flex justify-end">
              <div className="max-w-xl bg-blue-600/20 border border-blue-500/30 rounded-2xl rounded-br-sm px-4 py-2.5 text-sm text-slate-200">
                {msg.query}
              </div>
            </div>

            {/* AI response */}
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700">
                <div className="w-5 h-5 rounded-full bg-blue-600/30 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-blue-400" />
                </div>
                <span className="text-xs text-slate-500">
                  {MODEL} · {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <MarkdownRenderer text={msg.response} />
              {msg.sourceDocs?.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-700">
                  <p className="text-xs text-slate-500 mb-1.5">Sources searched ({msg.sourceDocs.length}):</p>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.sourceDocs.map(d => (
                      <span key={d.id} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-slate-700 rounded-full text-slate-400">
                        <FileText className="w-3 h-3" />
                        {d.title}
                        <ClearanceBadge level={d.clearance} size="xs" showIcon={false} />
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Streaming in-progress response */}
        {loading && (
          <div className="space-y-2">
            <div className="flex justify-end">
              <div className="max-w-xl bg-blue-600/20 border border-blue-500/30 rounded-2xl rounded-br-sm px-4 py-2.5 text-sm text-slate-200">
                {activeQuery}
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700">
                <div className="w-5 h-5 rounded-full bg-blue-600/30 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-blue-400" />
                </div>
                <span className="text-xs text-slate-500">{MODEL}</span>
                <Loader className="w-3 h-3 animate-spin text-blue-400 ml-auto" />
              </div>
              {streamingText ? (
                <div className="typing-cursor">
                  <MarkdownRenderer text={streamingText} />
                </div>
              ) : (
                <p className="text-sm text-slate-500">Searching through your accessible documents…</p>
              )}
            </div>
          </div>
        )}

        {/* Error */}
        {error && <OllamaError error={error} />}

        <div ref={bottomRef} />
      </div>

      {/* Input bar — pinned to bottom */}
      <div className="card p-4 flex-shrink-0">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              className="input pl-9"
              placeholder="Ask anything about your company's documents…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !loading && handleSearch()}
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
            className="btn-primary px-5 flex items-center gap-2"
          >
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {loading ? 'Thinking…' : 'Ask'}
          </button>
        </div>
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-700">
          <span className="text-xs text-slate-500">Also include:</span>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={includeAzure} onChange={e => setIncludeAzure(e.target.checked)} className="accent-blue-500" />
            <Cloud className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400">Azure DevOps</span>
          </label>
        </div>
      </div>
    </div>
  );
};
