import { AlertTriangle, Terminal, Cloud } from 'lucide-react';
import { getProvider, getModel, OLLAMA_MODEL } from '../utils/anthropic.js';

export const OllamaError = ({ error }) => {
  const provider = getProvider();
  const isOllama = provider === 'ollama';

  const isDown     = error === 'NO_OLLAMA' || error?.includes('not running') || error?.includes('fetch') || error === 'OPENAI_NETWORK_ERROR';
  const noModel    = error === 'NO_MODEL'  || error?.includes('not found');
  const noKey      = error === 'OPENAI_KEY_MISSING';
  const invalidKey = error === 'OPENAI_INVALID_KEY';
  const rateLimit  = error === 'OPENAI_RATE_LIMIT';

  return (
    <div className="card p-4 border-red-500/30 bg-red-500/5">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          {isDown && isOllama && (
            <>
              <p className="text-sm font-medium text-red-300">Ollama is not running</p>
              <p className="text-xs text-slate-400 mt-1">Start it in a terminal, then retry:</p>
              <code className="block mt-1.5 bg-slate-900 border border-slate-700 px-3 py-2 rounded text-xs text-emerald-300 font-mono">
                ollama serve
              </code>
            </>
          )}
          {isDown && !isOllama && (
            <>
              <p className="text-sm font-medium text-red-300">Could not reach OpenAI</p>
              <p className="text-xs text-slate-400 mt-1">Check your network connection and try again.</p>
            </>
          )}
          {noModel && (
            <>
              <p className="text-sm font-medium text-red-300">Model not found</p>
              <p className="text-xs text-slate-400 mt-1">Pull it first (~4.7 GB):</p>
              <code className="block mt-1.5 bg-slate-900 border border-slate-700 px-3 py-2 rounded text-xs text-emerald-300 font-mono">
                ollama pull {OLLAMA_MODEL}
              </code>
            </>
          )}
          {noKey && (
            <>
              <p className="text-sm font-medium text-red-300">OpenAI API key not configured</p>
              <p className="text-xs text-slate-400 mt-1">
                Set <code className="bg-slate-800 px-1 rounded">VITE_OPENAI_API_KEY</code> in your{' '}
                <code className="bg-slate-800 px-1 rounded">.env.local</code> file or Vercel dashboard,
                then rebuild. Or switch to Ollama using the provider toggle in the header.
              </p>
            </>
          )}
          {invalidKey && (
            <>
              <p className="text-sm font-medium text-red-300">Invalid OpenAI API key</p>
              <p className="text-xs text-slate-400 mt-1">
                Check your key at <span className="text-blue-400">platform.openai.com</span> and update{' '}
                <code className="bg-slate-800 px-1 rounded">VITE_OPENAI_API_KEY</code>.
              </p>
            </>
          )}
          {rateLimit && (
            <>
              <p className="text-sm font-medium text-red-300">OpenAI rate limit reached</p>
              <p className="text-xs text-slate-400 mt-1">Too many requests. Wait a moment and try again.</p>
            </>
          )}
          {!isDown && !noModel && !noKey && !invalidKey && !rateLimit && (
            <>
              <p className="text-sm font-medium text-red-300">AI error</p>
              <p className="text-xs text-slate-500 mt-1 font-mono break-all">{error}</p>
            </>
          )}
        </div>
        {isOllama
          ? <Terminal className="w-4 h-4 text-slate-600 flex-shrink-0" />
          : <Cloud className="w-4 h-4 text-slate-600 flex-shrink-0" />
        }
      </div>
    </div>
  );
};
