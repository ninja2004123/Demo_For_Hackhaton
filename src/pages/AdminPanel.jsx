import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getItem, setItem } from '../utils/storage.js';
import { CLEARANCE_LEVELS, ALL_LEVELS } from '../utils/clearance.js';
import { ClearanceBadge } from '../components/ClearanceBadge.jsx';
import { Users, FileText, Shield, Trash2, ChevronDown, Lock } from 'lucide-react';

const UserRow = ({ user: u, currentUser, onClearanceChange, onDelete }) => {
  const [editing, setEditing] = useState(false);

  return (
    <tr className="border-b border-slate-700/50 hover:bg-slate-700/20">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {u.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm text-slate-200 font-medium">{u.name}</p>
            <p className="text-xs text-slate-500">{u.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-xs text-slate-400">{u.role}</td>
      <td className="px-4 py-3 text-xs text-slate-400">{u.department}</td>
      <td className="px-4 py-3">
        {editing ? (
          <select
            className="select w-auto text-xs py-1"
            value={u.clearance}
            onChange={e => { onClearanceChange(u.id, e.target.value); setEditing(false); }}
            autoFocus
            onBlur={() => setEditing(false)}
          >
            {ALL_LEVELS.map(l => (
              <option key={l.id} value={l.id}>{l.id} — {l.label}</option>
            ))}
          </select>
        ) : (
          <button onClick={() => setEditing(true)} className="group flex items-center gap-1">
            <ClearanceBadge level={u.clearance} size="xs" />
            <ChevronDown className="w-3 h-3 text-slate-600 group-hover:text-slate-400 transition-colors" />
          </button>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          {u.isAdmin && <span className="badge bg-purple-700 text-purple-100">Admin</span>}
          {u.id === currentUser.id && <span className="badge bg-blue-700 text-blue-100">You</span>}
        </div>
      </td>
      <td className="px-4 py-3">
        {u.id !== currentUser.id && (
          <button
            onClick={() => onDelete(u.id)}
            className="text-slate-600 hover:text-red-400 transition-colors"
            title="Delete user"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </td>
    </tr>
  );
};

const DocRow = ({ doc, onDelete, onClearanceChange }) => {
  const [editing, setEditing] = useState(false);
  return (
    <tr className="border-b border-slate-700/50 hover:bg-slate-700/20">
      <td className="px-4 py-3">
        <p className="text-sm text-slate-200 font-medium">{doc.title}</p>
        <p className="text-xs text-slate-500 truncate max-w-xs">{doc.description}</p>
      </td>
      <td className="px-4 py-3 text-xs text-slate-400">{doc.category}</td>
      <td className="px-4 py-3">
        {editing ? (
          <select
            className="select w-auto text-xs py-1"
            value={doc.clearance}
            onChange={e => { onClearanceChange(doc.id, e.target.value); setEditing(false); }}
            autoFocus
            onBlur={() => setEditing(false)}
          >
            {ALL_LEVELS.map(l => <option key={l.id} value={l.id}>{l.id} — {l.label}</option>)}
          </select>
        ) : (
          <button onClick={() => setEditing(true)} className="group flex items-center gap-1">
            <ClearanceBadge level={doc.clearance} size="xs" />
            <ChevronDown className="w-3 h-3 text-slate-600 group-hover:text-slate-400 transition-colors" />
          </button>
        )}
      </td>
      <td className="px-4 py-3 text-xs text-slate-500">{doc.type} · {doc.size}</td>
      <td className="px-4 py-3 text-xs text-slate-500">{doc.uploadedAt}</td>
      <td className="px-4 py-3">
        <button onClick={() => onDelete(doc.id)} className="text-slate-600 hover:text-red-400 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};

export const AdminPanel = () => {
  const { tenantId } = useParams();
  const { user, updateUserClearance } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState(() => getItem(tenantId, 'users', []));
  const [docs, setDocs] = useState(() => getItem(tenantId, 'documents', []));

  if (!user?.isAdmin) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="card p-12 text-center">
          <Lock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-300 mb-2">Admin Access Required</h2>
          <p className="text-slate-500 text-sm">This panel is restricted to workspace administrators.</p>
        </div>
      </div>
    );
  }

  const handleUserClearanceChange = (userId, clearance) => {
    const updated = users.map(u => u.id === userId ? { ...u, clearance } : u);
    setUsers(updated);
    setItem(tenantId, 'users', updated);
    updateUserClearance(userId, clearance);
  };

  const handleDeleteUser = (userId) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    const updated = users.filter(u => u.id !== userId);
    setUsers(updated);
    setItem(tenantId, 'users', updated);
  };

  const handleDocClearanceChange = (docId, clearance) => {
    const updated = docs.map(d => d.id === docId ? { ...d, clearance } : d);
    setDocs(updated);
    setItem(tenantId, 'documents', updated);
  };

  const handleDeleteDoc = (docId) => {
    if (!confirm('Delete this document? This cannot be undone.')) return;
    const updated = docs.filter(d => d.id !== docId);
    setDocs(updated);
    setItem(tenantId, 'documents', updated);
  };

  const clearanceDist = ALL_LEVELS.map(l => ({
    ...l,
    userCount: users.filter(u => u.clearance === l.id).length,
    docCount: docs.filter(d => d.clearance === l.id).length,
  }));

  const tabs = [
    { id: 'users', label: 'Users', icon: Users, count: users.length },
    { id: 'documents', label: 'Documents', icon: FileText, count: docs.length },
    { id: 'clearance', label: 'Clearance Matrix', icon: Shield },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Users', value: users.length, icon: Users },
          { label: 'Total Documents', value: docs.length, icon: FileText },
          { label: 'Your Clearance', value: user.clearance, icon: Shield },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="card p-4 flex items-center gap-3">
            <Icon className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-lg font-bold text-slate-100">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-800">
        {tabs.map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === id ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
            {count !== undefined && (
              <span className="ml-1 text-xs bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded-full">{count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Users tab */}
      {activeTab === 'users' && (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                {['User', 'Role', 'Department', 'Clearance', 'Flags', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <UserRow
                  key={u.id}
                  user={u}
                  currentUser={user}
                  onClearanceChange={handleUserClearanceChange}
                  onDelete={handleDeleteUser}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Documents tab */}
      {activeTab === 'documents' && (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                {['Document', 'Category', 'Clearance', 'File', 'Uploaded', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {docs.map(d => (
                <DocRow
                  key={d.id}
                  doc={d}
                  onDelete={handleDeleteDoc}
                  onClearanceChange={handleDocClearanceChange}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Clearance matrix tab */}
      {activeTab === 'clearance' && (
        <div className="space-y-3">
          {clearanceDist.map(l => (
            <div key={l.id} className="card p-4 flex items-center gap-4">
              <ClearanceBadge level={l.id} size="md" />
              <div className="flex-1">
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-slate-400">
                    <span className="text-slate-100 font-semibold">{l.userCount}</span> users
                  </span>
                  <span className="text-slate-400">
                    <span className="text-slate-100 font-semibold">{l.docCount}</span> documents
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {users.filter(u => u.clearance === l.id).map(u => (
                    <span key={u.id} className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">{u.name}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
