import { useState, useEffect, useRef } from 'react';
import { Menu, Terminal, Cloud, RefreshCw, ChevronDown, Check } from 'lucide-react';
import { checkOllama, getProvider, setProvider, getModel, hasOpenRouterKey, OLLAMA_MODEL, OPENROUTER_MODEL } from '../../utils/anthropic.js';
import { useTenant } from '../../contexts/TenantContext.jsx';

// ── Ollama status dot (only shown when provider = ollama) ─────────────────────

const OllamaStatus = () => {
  const [status, setStatus] = useState('checking');
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
    checking: { dot: 'bg-slate-500 animate-pulse', text: 'text-slate-400', label: 'Checking…' },
    ok:       { dot: 'bg-emerald-400',              text: 'text-emerald-400', label: `${OLLAMA_MODEL} ready` },
    no_model: { dot: 'bg-amber-400 animate-pulse',  text: 'text-amber-400',  label: 'Model not pulled' },
    down:     { dot: 'bg-red-400 animate-pulse',    text: 'text-red-400',    label: 'Ollama offline' },
  };

  const cfg = configs[status] ?? configs.checking;

  return (
    <div className="relative group hidden sm:flex items-center gap-2">
      <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 text-xs font-medium ${cfg.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
        <Terminal className="w-3 h-3" />
        <span className="hidden md:inline">{cfg.label}</span>
      </div>

      {status !== 'ok' && (
        <div className="relative group">
          <button
            onClick={check}
            disabled={checking}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800 text-slate-500 hover:text-slate-300 text-xs transition-colors"
            title="Retry connection"
          >
            <RefreshCw className={`w-3 h-3 ${checking ? 'animate-spin' : ''}`} />
          </button>
          <div className="absolute right-0 top-full mt-1.5 w-64 hidden group-hover:block z-50">
            <div className="card p-3 text-xs space-y-1.5 shadow-xl border-slate-600">
              {status === 'down' && (
                <>
                  <p className="font-semibold text-slate-200">Start Ollama</p>
                  <code className="block bg-slate-900 px-2 py-1 rounded text-emerald-300 font-mono">
                    ollama serve
                  </code>
                </>
              )}
              {status === 'no_model' && (
                <>
                  <p className="font-semibold text-slate-200">Pull the model</p>
                  <code className="block bg-slate-900 px-2 py-1 rounded text-emerald-300 font-mono">
                    ollama pull {OLLAMA_MODEL}
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

// ── Provider selector dropdown ────────────────────────────────────────────────

const ProviderToggle = () => {
  const [provider, setProviderState] = useState(getProvider);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const keyAvailable = hasOpenRouterKey();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchTo = (p) => {
    setProvider(p);
    setProviderState(p);
    setOpen(false);
    window.location.reload();
  };

  const isOpenRouter = provider === 'openrouter';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
        title="Switch AI provider"
      >
        {isOpenRouter
          ? <Cloud className="w-3 h-3 text-violet-400" />
          : <Terminal className="w-3 h-3 text-blue-400" />
        }
        <span className="hidden sm:inline">{isOpenRouter ? 'deepseek-v3' : OLLAMA_MODEL}</span>
        <ChevronDown className="w-3 h-3 text-slate-500" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-56 z-50 card p-1 shadow-xl border-slate-600">
          <p className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Provider</p>

          <button
            onClick={() => switchTo('ollama')}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg hover:bg-slate-700 transition-colors text-left"
          >
            <Terminal className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-slate-200 font-medium">Ollama (local)</p>
              <p className="text-slate-500">{OLLAMA_MODEL}</p>
            </div>
            {!isOpenRouter && <Check className="w-3.5 h-3.5 text-blue-400" />}
          </button>

          <button
            onClick={() => keyAvailable && switchTo('openrouter')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg transition-colors text-left ${
              keyAvailable ? 'hover:bg-slate-700' : 'opacity-50 cursor-not-allowed'
            }`}
            title={keyAvailable ? undefined : 'Set VITE_OPENROUTER_API_KEY to enable'}
          >
            <Cloud className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-slate-200 font-medium">OpenRouter (free)</p>
              <p className="text-slate-500 truncate">{OPENROUTER_MODEL.split('/')[1]}{!keyAvailable ? ' · no key' : ''}</p>
            </div>
            {isOpenRouter && <Check className="w-3.5 h-3.5 text-violet-400" />}
          </button>
        </div>
      )}
    </div>
  );
};

// ── Header ────────────────────────────────────────────────────────────────────

export const Header = ({ title, subtitle, onMenuClick }) => {
  const { currentTenant } = useTenant();
  const provider = getProvider();

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-3 flex-shrink-0">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="md:hidden text-slate-400 hover:text-slate-200 transition-colors p-1 -ml-1"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-slate-100 truncate">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 truncate hidden sm:block">{subtitle}</p>}
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2">
        {/* Ollama health — only when using ollama */}
        {provider === 'ollama' && <OllamaStatus />}

        {/* Provider toggle */}
        <ProviderToggle />

        {/* Tenant badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden md:inline">{currentTenant?.name}</span>
        </div>
      </div>
    </header>
  );
};
