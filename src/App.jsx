import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { TenantProvider } from './contexts/TenantContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { Shell } from './components/Layout/Shell.jsx';
import { CompanySelector } from './pages/CompanySelector.jsx';
import { Login } from './pages/Login.jsx';
import { Register } from './pages/Register.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { DocumentHub } from './pages/DocumentHub.jsx';
import { AISearch } from './pages/AISearch.jsx';
import { GitHub } from './pages/GitHub.jsx';
import { AzureDevOps } from './pages/AzureDevOps.jsx';
import { OnboardingGuide } from './pages/OnboardingGuide.jsx';
import { AdminPanel } from './pages/AdminPanel.jsx';

const TenantRoutes = () => {
  const { tenantId } = useParams();
  return (
    <AuthProvider tenantId={tenantId}>
      <Routes>
        <Route path="login"    element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path=":page"    element={<Shell />}>
          <Route index element={null} />
        </Route>
        <Route path="" element={<Navigate to="login" replace />} />
      </Routes>
    </AuthProvider>
  );
};

const TenantShellRoutes = () => {
  const { tenantId } = useParams();
  return (
    <AuthProvider tenantId={tenantId}>
      <Shell>
        <Routes>
          <Route path="dashboard"  element={<Dashboard />} />
          <Route path="documents"  element={<DocumentHub />} />
          <Route path="search"     element={<AISearch />} />
          <Route path="github"     element={<GitHub />} />
          <Route path="azure"      element={<AzureDevOps />} />
          <Route path="onboarding" element={<OnboardingGuide />} />
          <Route path="admin"      element={<AdminPanel />} />
        </Routes>
      </Shell>
    </AuthProvider>
  );
};

export default function App() {
  return (
    <TenantProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CompanySelector />} />
          <Route path="/:tenantId/login"    element={<TenantLoginRoute />} />
          <Route path="/:tenantId/register" element={<TenantRegisterRoute />} />
          <Route path="/:tenantId/:page"    element={<TenantPageRoute />} />
          <Route path="/:tenantId"          element={<TenantRootRoute />} />
        </Routes>
      </BrowserRouter>
    </TenantProvider>
  );
}

const TenantLoginRoute    = () => { const { tenantId } = useParams(); return <AuthProvider tenantId={tenantId}><Login /></AuthProvider>; };
const TenantRegisterRoute = () => { const { tenantId } = useParams(); return <AuthProvider tenantId={tenantId}><Register /></AuthProvider>; };
const TenantRootRoute     = () => { const { tenantId } = useParams(); return <Navigate to={`/${tenantId}/login`} replace />; };

const TenantPageRoute = () => {
  const { tenantId, page } = useParams();
  const pages = { dashboard: Dashboard, documents: DocumentHub, search: AISearch, github: GitHub, azure: AzureDevOps, onboarding: OnboardingGuide, admin: AdminPanel };
  const PageComponent = pages[page];
  if (!PageComponent) return <Navigate to={`/${tenantId}/dashboard`} replace />;
  return (
    <AuthProvider tenantId={tenantId}>
      <Shell>
        <PageComponent />
      </Shell>
    </AuthProvider>
  );
};
