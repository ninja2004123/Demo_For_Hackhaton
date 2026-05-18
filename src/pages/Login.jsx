import { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTenant } from '../contexts/TenantContext.jsx';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';

export const Login = () => {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { companies, selectTenant } = useTenant();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const company = companies.find(c => c.id === tenantId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (company) selectTenant(company);
    const result = login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      navigate(`/${tenantId}/dashboard`);
    } else {
      setError(result.error);
    }
  };

  const fill = (email) => setForm({ email, password: 'demo123' });

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold text-white"
              style={{ backgroundColor: company?.color || '#3b82f6' }}
            >
              {company?.logo || <ShieldCheck className="w-6 h-6" />}
            </div>
            <span className="text-xl font-bold text-slate-100">{company?.name || 'Vault'}</span>
          </div>
          <p className="text-sm text-slate-400">Sign in to your workspace</p>
        </div>

        {/* Form */}
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Email address</label>
              <input
                type="email"
                className="input"
                placeholder="you@company.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  onClick={() => setShowPw(v => !v)}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link to={`/${tenantId}/register`} className="text-xs text-blue-400 hover:text-blue-300">
              Don't have an account? Register
            </Link>
          </div>
        </div>

        {/* Quick demo logins */}
        {company?.id === 'acme-corp' && (
          <div className="mt-4 card p-4">
            <p className="text-xs font-medium text-slate-400 mb-2">Quick login (demo)</p>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label: 'L5 CTO', email: 'alex@acme.com' },
                { label: 'L3 Engineer', email: 'sam@acme.com' },
                { label: 'L2 PM', email: 'jordan@acme.com' },
                { label: 'L1 Intern', email: 'morgan@acme.com' },
              ].map(({ label, email }) => (
                <button
                  key={email}
                  onClick={() => fill(email)}
                  className="text-xs px-2 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition-colors text-left"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
        {company?.id === 'fintech-inc' && (
          <div className="mt-4 card p-4">
            <p className="text-xs font-medium text-slate-400 mb-2">Quick login (demo)</p>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label: 'L5 CEO', email: 'riley@fintech.com' },
                { label: 'L1 Analyst', email: 'drew@fintech.com' },
              ].map(({ label, email }) => (
                <button key={email} onClick={() => fill(email)} className="text-xs px-2 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition-colors text-left">
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-4">
          <Link to="/" className="text-xs text-slate-600 hover:text-slate-400">← All workspaces</Link>
        </div>
      </div>
    </div>
  );
};
