import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getItem, setItem } from '../utils/storage.js';
import { filterByAccess, CLEARANCE_LEVELS, ALL_LEVELS } from '../utils/clearance.js';
import { ClearanceBadge } from '../components/ClearanceBadge.jsx';
import { Plus, Search, FileText, X, Upload, Eye, Filter } from 'lucide-react';

const CATEGORIES = ['HR', 'Engineering', 'Product', 'Finance', 'Legal', 'Executive', 'Compliance', 'General'];

const DocModal = ({ doc, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
    <div className="card w-full max-w-3xl max-h-[85vh] flex flex-col">
      <div className="flex items-start justify-between p-5 border-b border-slate-700">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ClearanceBadge level={doc.clearance} />
            <span className="text-xs text-slate-500">{doc.category} · {doc.type} · {doc.size}</span>
          </div>
          <h2 className="text-lg font-semibold text-slate-100">{doc.title}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{doc.description}</p>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-300 mt-1"><X className="w-4 h-4" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">{doc.content}</pre>
      </div>
      <div className="px-5 py-3 border-t border-slate-700 text-xs text-slate-500">
        Uploaded {doc.uploadedAt}
      </div>
    </div>
  </div>
);

const UploadModal = ({ onClose, onSave, userClearance }) => {
  const userLevel = CLEARANCE_LEVELS[userClearance]?.level ?? 1;
  const availableLevels = ALL_LEVELS.filter(l => l.level <= userLevel);

  const [form, setForm] = useState({
    title: '',
    description: '',
    content: '',
    clearance: availableLevels[0]?.id || 'L1',
    category: 'General',
  });

  const handleSave = () => {
    if (!form.title.trim() || !form.content.trim()) return;
    onSave({
      id: `d${Date.now()}`,
      ...form,
      type: 'TXT',
      size: `${Math.round(form.content.length / 1024 * 10) / 10 || 1} KB`,
      uploadedAt: new Date().toISOString().split('T')[0],
      uploadedBy: 'current',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="card w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-blue-400" />
            <h2 className="text-base font-semibold text-slate-100">Upload Document</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1 block">Document Title *</label>
            <input className="input" placeholder="e.g. Q2 Engineering Roadmap" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1 block">Description</label>
            <input className="input" placeholder="Brief description of this document" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1 block">Clearance Level *</label>
              <select className="select" value={form.clearance} onChange={e => setForm(f => ({ ...f, clearance: e.target.value }))}>
                {availableLevels.map(l => (
                  <option key={l.id} value={l.id}>{l.id} — {l.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1 block">Category</label>
              <select className="select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1 block">Content *</label>
            <textarea
              className="input min-h-[200px] resize-none font-mono text-xs"
              placeholder="Paste or type document content here…"
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            />
          </div>
        </div>
        <div className="p-5 border-t border-slate-700 flex gap-2">
          <button onClick={handleSave} className="btn-primary flex-1" disabled={!form.title.trim() || !form.content.trim()}>
            Upload Document
          </button>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  );
};

const DocCard = ({ doc, onClick }) => (
  <button
    onClick={onClick}
    className="card p-4 text-left hover:border-slate-600 hover:bg-slate-700/20 transition-all group w-full"
  >
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
        <FileText className="w-4 h-4 text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-slate-200 group-hover:text-white leading-snug">{doc.title}</p>
          <ClearanceBadge level={doc.clearance} size="xs" showIcon={false} />
        </div>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{doc.description}</p>
        <div className="flex items-center gap-2 mt-2 text-xs text-slate-600">
          <span className="bg-slate-700 px-1.5 py-0.5 rounded">{doc.category}</span>
          <span>{doc.type}</span>
          <span>{doc.size}</span>
          <span>·</span>
          <span>{doc.uploadedAt}</span>
        </div>
      </div>
    </div>
    <div className="mt-3 flex items-center gap-1 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
      <Eye className="w-3 h-3" /> View document
    </div>
  </button>
);

export const DocumentHub = () => {
  const { tenantId } = useParams();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [filterClearance, setFilterClearance] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewDoc, setViewDoc] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [docs, setDocs] = useState(() => getItem(tenantId, 'documents', []));

  const userLevel = CLEARANCE_LEVELS[user.clearance]?.level ?? 0;
  const accessibleDocs = filterByAccess(docs, user.clearance);

  const filtered = accessibleDocs.filter(doc => {
    const matchSearch = !search || doc.title.toLowerCase().includes(search.toLowerCase()) || doc.description?.toLowerCase().includes(search.toLowerCase()) || doc.content?.toLowerCase().includes(search.toLowerCase());
    const matchClearance = filterClearance === 'all' || doc.clearance === filterClearance;
    const matchCategory = filterCategory === 'all' || doc.category === filterCategory;
    return matchSearch && matchClearance && matchCategory;
  });

  const handleUpload = (doc) => {
    const updated = [...docs, doc];
    setDocs(updated);
    setItem(tenantId, 'documents', updated);
  };

  const categories = ['all', ...new Set(accessibleDocs.map(d => d.category))];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            className="input pl-9"
            placeholder="Search documents by title, description, or content…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select className="select w-auto text-xs" value={filterClearance} onChange={e => setFilterClearance(e.target.value)}>
            <option value="all">All Clearances</option>
            {ALL_LEVELS.filter(l => l.level <= userLevel).map(l => (
              <option key={l.id} value={l.id}>{l.id} — {l.label}</option>
            ))}
          </select>
          <select className="select w-auto text-xs" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
          </select>
        </div>
        <button onClick={() => setShowUpload(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Upload
        </button>
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-slate-500">
          Showing <span className="text-slate-300 font-medium">{filtered.length}</span> of {accessibleDocs.length} accessible documents
          {docs.length > accessibleDocs.length && (
            <span className="text-slate-600"> ({docs.length - accessibleDocs.length} hidden by clearance)</span>
          )}
        </p>
      </div>

      {/* Document grid */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">{search ? 'No documents match your search' : 'No accessible documents'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          {filtered.map(doc => (
            <DocCard key={doc.id} doc={doc} onClick={() => setViewDoc(doc)} />
          ))}
        </div>
      )}

      {viewDoc && <DocModal doc={viewDoc} onClose={() => setViewDoc(null)} />}
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onSave={handleUpload} userClearance={user.clearance} />}
    </div>
  );
};
