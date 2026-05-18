import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '../contexts/TenantContext.jsx';
import { ShieldCheck, Plus, ArrowRight, Building2, Users, X } from 'lucide-react';
import { seedTenant } from '../utils/seedData.js';

const CompanyCard = ({ company, onSelect }) => (
  <button
    onClick={() => onSelect(company)}
    className="card p-5 text-left hover:border-blue-500/50 hover:bg-slate-700/30 transition-all group w-full"
  >
    <div className="flex items-start gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
        style={{ backgroundColor: company.color }}
      >
        {company.logo}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-100 group-hover:text-white">{company.name}</h3>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
        </div>
        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
          <Building2 className="w-3 h-3" />{company.industry}
        </p>
        <p className="text-xs text-slate-500 mt-2">{company.description}</p>
        <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
          <Users className="w-3 h-3" />
          {company.employeeCount?.toLocaleString()} employees
        </div>
      </div>
    </div>
  </button>
);

const NewCompanyModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({ name: '', industry: '', description: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const id = form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const colors = ['#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const company = {
      id,
      name: form.name,
      industry: form.industry || 'Enterprise',
      logo: form.name.slice(0, 2).toUpperCase(),
      color,
      description: form.description || `${form.name} workspace`,
      employeeCount: 0,
    };
    seedTenant(id);
    onAdd(company);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="card w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-slate-100">Create New Company</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1 block">Company Name *</label>
            <input className="input" placeholder="Acme Corp" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1 block">Industry</label>
            <input className="input" placeholder="Technology, Finance, Healthcare…" value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1 block">Description</label>
            <input className="input" placeholder="Brief description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" className="btn-primary flex-1">Create Workspace</button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const CompanySelector = () => {
  const navigate = useNavigate();
  const { companies, selectTenant, addCompany } = useTenant();
  const [showModal, setShowModal] = useState(false);

  const handleSelect = (company) => {
    selectTenant(company);
    navigate(`/${company.id}/login`);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-100 tracking-tight">NexusIQ</span>
          </div>
          <p className="text-slate-400 text-sm">Multi-tenant Enterprise Intelligence Platform</p>
          <div className="flex items-center justify-center gap-6 mt-4 text-xs text-slate-600">
            <span>5-Tier Clearance System</span>
            <span>·</span>
            <span>AI-Powered Search</span>
            <span>·</span>
            <span>GitHub + Azure Integration</span>
          </div>
        </div>

        {/* Company list */}
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Select Your Workspace</h2>
          <div className="space-y-2">
            {companies.map(c => (
              <CompanyCard key={c.id} company={c} onSelect={handleSelect} />
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-slate-700 rounded-xl text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Create new company workspace
        </button>

        {/* Demo hint */}
        <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
          <p className="text-xs text-blue-300 font-medium mb-1">Demo Credentials (Acme Corp)</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-400">
            <span>L5 Admin: alex@acme.com</span>
            <span>L3 Engineer: sam@acme.com</span>
            <span>L2 PM: jordan@acme.com</span>
            <span>L1 Intern: morgan@acme.com</span>
            <span className="col-span-2 text-slate-500 mt-1">Password for all: demo123</span>
          </div>
        </div>
      </div>

      {showModal && <NewCompanyModal onClose={() => setShowModal(false)} onAdd={addCompany} />}
    </div>
  );
};
