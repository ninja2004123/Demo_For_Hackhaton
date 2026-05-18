import { NavLink, useParams } from 'react-router-dom';
import { LayoutDashboard, FileText, Search, Github, Cloud, BookOpen, LogOut, ShieldCheck, Users, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useTenant } from '../../contexts/TenantContext.jsx';
import { ClearanceBadge } from '../ClearanceBadge.jsx';
import { CLEARANCE_LEVELS } from '../../utils/clearance.js';

const NavItem = ({ to, icon: Icon, label, restricted, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `nav-link ${isActive ? 'active' : ''} ${restricted ? 'opacity-60' : ''}`
    }
  >
    <Icon className="w-4 h-4 flex-shrink-0" />
    <span>{label}</span>
    {restricted && <span className="ml-auto text-xs text-slate-500">L3+</span>}
  </NavLink>
);

export const Sidebar = ({ open, onClose }) => {
  const { tenantId } = useParams();
  const { user, logout } = useAuth();
  const { currentTenant } = useTenant();
  const base = `/${tenantId}`;
  const userLevel = CLEARANCE_LEVELS[user?.clearance]?.level ?? 0;

  const close = () => onClose?.();

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 w-60 flex-shrink-0',
          'bg-slate-900 border-r border-slate-800 flex flex-col h-screen',
          'transition-transform duration-200 ease-in-out',
          open ? 'translate-x-0' : '-translate-x-full',
          'md:static md:translate-x-0',
        ].join(' ')}
      >
        {/* Logo */}
        <div className="px-4 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-100 tracking-wide">NexusIQ</div>
              <div className="text-xs text-slate-500 truncate max-w-[120px]">{currentTenant?.name || 'Platform'}</div>
            </div>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={close}
            className="md:hidden text-slate-500 hover:text-slate-300 transition-colors p-1"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          <p className="px-3 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Workspace</p>
          <NavItem to={`${base}/dashboard`}  icon={LayoutDashboard} label="Dashboard"       onClick={close} />
          <NavItem to={`${base}/documents`}  icon={FileText}        label="Document Hub"    onClick={close} />
          <NavItem to={`${base}/search`}     icon={Search}          label="AI Search"       onClick={close} />
          <NavItem to={`${base}/onboarding`} icon={BookOpen}        label="Onboarding Guide" onClick={close} />

          <p className="px-3 pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Integrations</p>
          <NavItem to={`${base}/github`} icon={Github} label="GitHub"      restricted={userLevel < 3} onClick={close} />
          <NavItem to={`${base}/azure`}  icon={Cloud}  label="Azure DevOps" restricted={userLevel < 3} onClick={close} />

          {user?.isAdmin && (
            <>
              <p className="px-3 pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Admin</p>
              <NavItem to={`${base}/admin`} icon={Users} label="Admin Panel" onClick={close} />
            </>
          )}
        </nav>

        {/* User card */}
        <div className="border-t border-slate-800 px-3 py-3">
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {user?.name?.charAt(0) ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-200 truncate">{user?.name}</p>
              <ClearanceBadge level={user?.clearance} size="xs" />
            </div>
            <button
              onClick={logout}
              className="text-slate-500 hover:text-slate-300 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
