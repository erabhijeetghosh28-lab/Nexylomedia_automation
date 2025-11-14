import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/auth/Login";
import SignupPage from "./pages/auth/Signup";
import DashboardLayout from "./layouts/DashboardLayout";
import ProjectsListPage from "./pages/projects/ProjectsList";
import ProjectDetailPage from "./pages/projects/ProjectDetail";
import SuperAdminDashboard from "./pages/admin/Dashboard";
import AdminTenantsPage from "./pages/admin/Tenants";
import AdminTenantDetailPage from "./pages/admin/TenantDetail";
import AdminPlansPage from "./pages/admin/Plans";
import AdminBillingPage from "./pages/admin/Billing";
import SeoAuditsListPage from "./pages/seo/AuditsList";
import SeoAuditDetailPage from "./pages/seo/AuditDetail";
import TeamUsersPage from "./pages/org/TeamUsers";

const RequireGuest = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/projects" replace />;
  }
  return <Outlet />;
};

const RequireAuth = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const DashboardRoutes = () => (
  <DashboardLayout>
    <Outlet />
  </DashboardLayout>
);

const RequireSuperAdmin = () => {
  const { auth } = useAuth();
  if (auth?.role !== "super_admin") {
    return <Navigate to="/projects" replace />;
  }
  return <Outlet />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RequireGuest />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route element={<DashboardRoutes />}>
            <Route path="/projects" element={<ProjectsListPage />} />
            <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
            <Route path="/projects/:projectId/seo/audits" element={<SeoAuditsListPage />} />
            <Route path="/projects/:projectId/seo/audits/:auditId" element={<SeoAuditDetailPage />} />
            <Route path="/team" element={<TeamUsersPage />} />
          </Route>

          <Route element={<RequireSuperAdmin />}>
            <Route path="/admin" element={<SuperAdminDashboard />} />
            <Route path="/admin/tenants" element={<AdminTenantsPage />} />
            <Route path="/admin/tenants/:tenantId" element={<AdminTenantDetailPage />} />
            <Route path="/admin/plans" element={<AdminPlansPage />} />
            <Route path="/admin/billing" element={<AdminBillingPage />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/projects" replace />} />
        <Route path="*" element={<Navigate to="/projects" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
