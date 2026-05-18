import { useState } from 'react';
import { Outlet, Navigate, useParams, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { Header } from './Header.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

const PAGE_META = {
  dashboard:  { title: 'Dashboard',        subtitle: 'Your clearance-filtered workspace overview' },
  documents:  { title: 'Document Hub',     subtitle: 'Browse and manage classified documents' },
  search:     { title: 'AI Search',        subtitle: 'Intelligent search across all accessible sources' },
  github:     { title: 'GitHub',           subtitle: 'Browse repositories and query code with AI' },
  azure:      { title: 'Azure DevOps',     subtitle: 'Repos, pipelines, work items, and wikis' },
  onboarding: { title: 'Onboarding Guide', subtitle: 'Your personalized AI-generated learning path' },
  admin:      { title: 'Admin Panel',      subtitle: 'Manage users, clearance levels, and documents' },
};

export const Shell = ({ children }) => {
  const { user, loading } = useAuth();
  const { tenantId, page } = useParams();
  const location = useLocation();
  const currentPage = page || location.pathname.split('/').pop();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400 text-sm">Loading…</div>
      </div>
    );
  }

  if (!user) return <Navigate to={`/${tenantId}/login`} replace />;

  const meta = PAGE_META[currentPage] || { title: 'Vault', subtitle: '' };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};
