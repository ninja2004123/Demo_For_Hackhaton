import { Terminal, AlertTriangle } from 'lucide-react';
import { MODEL } from '../utils/anthropic.js';

export const OllamaError = ({ error }) => {
  const isDown    = error === 'NO_OLLAMA' || error?.includes('not running') || error?.includes('fetch');
  const noModel   = error === 'NO_MODEL'  || error?.includes('not found');

  return (
    <div className="card p-4 border-red-500/30 bg-red-500/5">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          {isDown && (
            <>
              <p className="text-sm font-medium text-red-300">Ollama is not running</p>
              <p className="text-xs text-slate-400 mt-1">Start it in a terminal, then retry:</p>
              <code className="block mt-1.5 bg-slate-900 border border-slate-700 px-3 py-2 rounded text-xs text-emerald-300 font-mono">
                ~/.local/bin/ollama serve
              </code>
            </>
          )}
          {noModel && (
            <>
              <p className="text-sm font-medium text-red-300">Model not found</p>
              <p className="text-xs text-slate-400 mt-1">Pull it first (~4.7 GB):</p>
              <code className="block mt-1.5 bg-slate-900 border border-slate-700 px-3 py-2 rounded text-xs text-emerald-300 font-mono">
                ollama pull {MODEL}
              </code>
            </>
          )}
          {!isDown && !noModel && (
            <>
              <p className="text-sm font-medium text-red-300">AI error</p>
              <p className="text-xs text-slate-500 mt-1 font-mono">{error}</p>
            </>
          )}
        </div>
        <Terminal className="w-4 h-4 text-slate-600 flex-shrink-0" />
      </div>
    </div>
  );
};
