import { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export const Register = () => {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '', department: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = register(form);
    if (result.success) {
      navigate(`/${tenantId}/dashboard`);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-slate-100">Create Account</h1>
          <p className="text-sm text-slate-400 mt-1">New accounts start at L1 (Public) clearance</p>
        </div>
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1 block">Full Name</label>
              <input className="input" placeholder="Jane Smith" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1 block">Email</label>
              <input type="email" className="input" placeholder="jane@company.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1 block">Password</label>
              <input type="password" className="input" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1 block">Role / Job Title</label>
              <input className="input" placeholder="Software Engineer" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1 block">Department</label>
              <input className="input" placeholder="Engineering" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} />
            </div>
            {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" className="btn-primary w-full mt-2">Create Account</button>
          </form>
          <p className="text-center mt-4">
            <Link to={`/${tenantId}/login`} className="text-xs text-blue-400 hover:text-blue-300">Already have an account? Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
