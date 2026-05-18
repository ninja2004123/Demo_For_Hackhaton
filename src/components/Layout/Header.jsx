import { useState, useEffect } from 'react';
import { checkOllama, MODEL } from '../../utils/anthropic.js';
import { useTenant } from '../../contexts/TenantContext.jsx';
import { Terminal, RefreshCw } from 'lucide-react';

const OllamaStatus = () => {
  const [status, setStatus] = useState('checking'); // 'checking' | 'ok' | 'no_model' | 'down'
  const [checking, setChecking] = useState(false);

  const check = async () => {
    setChecking(true);
    setStatus('checking');
    const result = await checkOllama();
    if (!result.ok) setStatus('down');
    else if (!result.hasModel) setStatus('no_model');
    else setStatus('ok');
    setChecking(false);
  };

  useEffect(() => { check(); }, []);

  const configs = {
    checking: { dot: 'bg-slate-500 animate-pulse', text: 'text-slate-400', label: 'Checking Ollama…' },
    ok:       { dot: 'bg-emerald-400',              text: 'text-emerald-400', label: `${MODEL} ready` },
    no_model: { dot: 'bg-amber-400 animate-pulse',  text: 'text-amber-400',  label: 'Model not pulled' },
    down:     { dot: 'bg-red-400 animate-pulse',    text: 'text-red-400',    label: 'Ollama not running' },
  };

  const cfg = configs[status] ?? configs.checking;

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 text-xs font-medium ${cfg.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
        <Terminal className="w-3 h-3" />
        {cfg.label}
      </div>

      {status !== 'ok' && (
        <div className="relative group">
          <button
            onClick={check}
            disabled={checking}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800 text-slate-500 hover:text-slate-300 text-xs transition-colors"
            title="Retry"
          >
            <RefreshCw className={`w-3 h-3 ${checking ? 'animate-spin' : ''}`} />
          </button>
          {/* Tooltip with fix instructions */}
          <div className="absolute right-0 top-full mt-1.5 w-72 hidden group-hover:block z-50">
            <div className="card p-3 text-xs space-y-1.5 shadow-xl border-slate-600">
              {status === 'down' && (
                <>
                  <p className="font-semibold text-slate-200">Start Ollama</p>
                  <code className="block bg-slate-900 px-2 py-1 rounded text-emerald-300 font-mono">
                    ~/.local/bin/ollama serve
                  </code>
                  <p className="text-slate-500">or run in a terminal tab</p>
                </>
              )}
              {status === 'no_model' && (
                <>
                  <p className="font-semibold text-slate-200">Pull the model</p>
                  <code className="block bg-slate-900 px-2 py-1 rounded text-emerald-300 font-mono">
                    ollama pull {MODEL}
                  </code>
                  <p className="text-slate-500">~4.7 GB download</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const Header = ({ title, subtitle }) => {
  const { currentTenant } = useTenant();

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center px-6 gap-4 flex-shrink-0">
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-slate-100">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <OllamaStatus />
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {currentTenant?.name}
        </div>
      </div>
    </header>
  );
};
