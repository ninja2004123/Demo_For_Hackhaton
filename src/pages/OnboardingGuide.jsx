import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTenant } from '../contexts/TenantContext.jsx';
import { getItem } from '../utils/storage.js';
import { filterByAccess } from '../utils/clearance.js';
import { generateOnboardingGuide, getModel, getProvider } from '../utils/anthropic.js';
import { ClearanceBadge } from '../components/ClearanceBadge.jsx';
import { OllamaError } from '../components/OllamaError.jsx';
import { BookOpen, Sparkles, Loader, RefreshCw, User, Building2, FileText, Terminal, Cloud } from 'lucide-react';

const MarkdownBlock = ({ text }) => {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => {
        if (line.startsWith('## '))  return <h2 key={i} className="text-base font-semibold text-slate-100 mt-6 mb-2 border-b border-slate-700 pb-1">{line.slice(3)}</h2>;
        if (line.startsWith('# '))   return <h1 key={i} className="text-lg font-bold text-slate-100 mt-4 mb-3">{line.slice(2)}</h1>;
        if (line.startsWith('### ')) return <h3 key={i} className="text-sm font-semibold text-slate-200 mt-4 mb-1">{line.slice(4)}</h3>;
        if (line.startsWith('**') && line.endsWith('**'))
          return <p key={i} className="text-sm font-semibold text-slate-200 mt-3">{line.slice(2, -2)}</p>;
        if (line.startsWith('- ') || line.startsWith('• '))
          return <li key={i} className="text-sm text-slate-300 ml-5 list-disc">{formatInline(line.slice(2))}</li>;
        if (/^\d+\. /.test(line))
          return <li key={i} className="text-sm text-slate-300 ml-5 list-decimal">{formatInline(line.replace(/^\d+\.\s/, ''))}</li>;
        if (line === '' || line === '---') return <div key={i} className="h-1" />;
        return <p key={i} className="text-sm text-slate-300 leading-relaxed">{formatInline(line)}</p>;
      })}
    </div>
  );
};

const formatInline = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i} className="text-slate-100">{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*'))
      return <em key={i} className="text-slate-200 italic">{part.slice(1, -1)}</em>;
    if (part.startsWith('`') && part.endsWith('`'))
      return <code key={i} className="bg-slate-700 text-blue-300 px-1 py-0.5 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
    return part;
  });
};

export const OnboardingGuide = () => {
  const { tenantId } = useParams();
  const { user } = useAuth();
  const { currentTenant } = useTenant();
  const [guide, setGuide] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generated, setGenerated] = useState(false);

  const docs = getItem(tenantId, 'documents', []);
  const accessibleDocs = filterByAccess(docs, user.clearance);
  const model = getModel();
  const provider = getProvider();

  const generate = async () => {
    setLoading(true);
    setGuide('');
    setError('');
    setGenerated(false);
    try {
      await generateOnboardingGuide({
        user,
        documents: accessibleDocs,
        companyName: currentTenant?.name || 'Enterprise',
        onChunk: (t) => setGuide(p => p + t),
      });
      setGenerated(true);
    } catch (err) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 sm:p-6 max-w-3xl mx-auto space-y-4 sm:space-y-5">
      {/* User profile card */}
      <div className="card p-4 sm:p-5">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-700 flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-semibold text-slate-100">{user.name}</h2>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400 flex-wrap">
                <User className="w-3 h-3" />{user.role}
                <span>·</span>
                <Building2 className="w-3 h-3" />{user.department}
              </div>
              <div className="mt-1.5">
                <ClearanceBadge level={user.clearance} />
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Accessible documents</p>
            <div className="flex items-center gap-1 mt-1">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-lg font-bold text-slate-100">{accessibleDocs.length}</span>
              <span className="text-xs text-slate-500">/ {docs.length}</span>
            </div>
          </div>
        </div>
      </div>

      {error && <OllamaError error={error} />}

      {!loading && !guide && !error && (
        <div className="card p-6 sm:p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7 text-blue-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-100 mb-2">Generate Your Personalised Onboarding Plan</h3>
          <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
            <code className="text-blue-300">{model}</code> will create a tailored 30-day guide based on your role ({user.role}),
            department ({user.department}), and {user.clearance} clearance — referencing documents you can access.
          </p>
          <button onClick={generate} className="btn-primary inline-flex items-center gap-2 px-6 py-2.5">
            <Sparkles className="w-4 h-4" />
            Generate My Onboarding Guide
          </button>
          <p className="text-xs text-slate-600 mt-3 flex items-center justify-center gap-1">
            {provider === 'openai'
              ? <><Cloud className="w-3 h-3 inline" /> Powered by <code>{model}</code></>
              : <><Terminal className="w-3 h-3 inline" /> Runs locally on <code>{model}</code></>
            }
          </p>
        </div>
      )}

      {loading && !guide && (
        <div className="card p-8 text-center">
          <Loader className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400">Generating your personalised plan…</p>
        </div>
      )}

      {guide && (
        <div className="card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-700 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-slate-300">AI-Generated Onboarding Plan</span>
              <code className="text-xs text-slate-600">{model}</code>
              {loading && <span className="text-xs text-slate-500 animate-pulse">generating…</span>}
            </div>
            {generated && (
              <button onClick={generate} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
                <RefreshCw className="w-3 h-3" />Regenerate
              </button>
            )}
          </div>
          <div className={loading ? 'typing-cursor' : ''}>
            <MarkdownBlock text={guide} />
          </div>
        </div>
      )}
    </div>
  );
};
