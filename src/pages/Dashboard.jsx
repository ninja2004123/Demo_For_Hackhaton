import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTenant } from '../contexts/TenantContext.jsx';
import { getItem } from '../utils/storage.js';
import { filterByAccess, CLEARANCE_LEVELS, ALL_LEVELS } from '../utils/clearance.js';
import { ClearanceBadge } from '../components/ClearanceBadge.jsx';
import { FileText, Search, Github, BookOpen, Shield, TrendingUp, Lock, Unlock } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-400',
    purple: 'bg-purple-500/10 text-purple-400',
  };
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-400">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-100">{value}</p>
    </div>
  );
};

const QuickAction = ({ icon: Icon, label, to, description }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(to)}
      className="card p-4 text-left hover:border-blue-500/40 hover:bg-slate-700/20 transition-all group"
    >
      <Icon className="w-5 h-5 text-blue-400 mb-2" />
      <p className="text-sm font-medium text-slate-200 group-hover:text-white">{label}</p>
      <p className="text-xs text-slate-500 mt-0.5">{description}</p>
    </button>
  );
};

export const Dashboard = () => {
  const { tenantId } = useParams();
  const { user } = useAuth();
  const { currentTenant } = useTenant();
  const navigate = useNavigate();

  const allDocs = getItem(tenantId, 'documents', []);
  const allUsers = getItem(tenantId, 'users', []);
  const accessibleDocs = filterByAccess(allDocs, user.clearance);
  const userLevel = CLEARANCE_LEVELS[user.clearance]?.level ?? 0;

  const recentDocs = [...accessibleDocs].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)).slice(0, 6);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Welcome banner */}
      <div className="card p-5 bg-gradient-to-r from-blue-600/10 to-slate-800 border-blue-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">Welcome back, {user.name.split(' ')[0]}</h2>
            <p className="text-sm text-slate-400 mt-0.5">{user.role} · {user.department}</p>
          </div>
          <ClearanceBadge level={user.clearance} size="md" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Accessible Documents" value={accessibleDocs.length} icon={FileText} color="blue" />
        <StatCard label="Total Documents" value={allDocs.length} icon={Lock} color="amber" />
        <StatCard label="Clearance Level" value={`L${CLEARANCE_LEVELS[user.clearance]?.level}`} icon={Shield} color="purple" />
        <StatCard label="Team Members" value={allUsers.length} icon={TrendingUp} color="emerald" />
      </div>

      {/* Clearance visualization */}
      <div className="card p-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Clearance Access Matrix</h3>
        <div className="grid grid-cols-5 gap-2">
          {ALL_LEVELS.map(lvl => {
            const accessible = lvl.level <= userLevel;
            const docsAtLevel = allDocs.filter(d => d.clearance === lvl.id).length;
            return (
              <div
                key={lvl.id}
                className={`rounded-lg p-3 border text-center transition-all ${
                  accessible
                    ? `border-${lvl.color}-600/40 bg-${lvl.color}-500/10`
                    : 'border-slate-700 bg-slate-800/50 opacity-50'
                }`}
              >
                <div className="flex items-center justify-center mb-1">
                  {accessible ? <Unlock className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-slate-500" />}
                </div>
                <p className="text-xs font-bold text-slate-300">{lvl.id}</p>
                <p className="text-xs text-slate-500 mt-0.5">{lvl.label}</p>
                <p className="text-xs font-semibold text-slate-400 mt-1">{docsAtLevel} docs</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickAction icon={Search} label="AI Search" description="Query all accessible sources" to={`/${tenantId}/search`} />
          <QuickAction icon={FileText} label="Document Hub" description="Browse classified documents" to={`/${tenantId}/documents`} />
          <QuickAction icon={BookOpen} label="Onboarding Guide" description="Your personalized learning path" to={`/${tenantId}/onboarding`} />
          <QuickAction icon={Github} label="GitHub" description="Browse repos & query code" to={`/${tenantId}/github`} />
        </div>
      </div>

      {/* Recent documents */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recent Documents</h3>
          <button onClick={() => navigate(`/${tenantId}/documents`)} className="text-xs text-blue-400 hover:text-blue-300">View all →</button>
        </div>
        {recentDocs.length === 0 ? (
          <div className="card p-8 text-center text-slate-500 text-sm">No accessible documents yet</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {recentDocs.map(doc => (
              <button
                key={doc.id}
                onClick={() => navigate(`/${tenantId}/documents`)}
                className="card p-4 text-left hover:border-slate-600 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{doc.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{doc.description}</p>
                  </div>
                  <ClearanceBadge level={doc.clearance} size="xs" showIcon={false} />
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
                  <span>{doc.category}</span>
                  <span>·</span>
                  <span>{doc.uploadedAt}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
