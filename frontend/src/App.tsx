import { useState, useMemo } from "react";
import ComponentLibraryPage from "./pages/components/ComponentLibrary";
import OrgDashboard from "./pages/org/OrgDashboard";
import TeamUsers from "./pages/org/TeamUsers";
import OrganizationSettings from "./pages/org/OrganizationSettings";
import OrgIntegrations from "./pages/org/OrgIntegrations";
import FeatureFlags from "./pages/org/FeatureFlags";
import UsageQuotas from "./pages/org/UsageQuotas";
import SeoAutopilotDashboard from "./pages/seo/Dashboard";
import SeoPlaybooksPage from "./pages/seo/Playbooks";
import SeoAlertsPage from "./pages/seo/Alerts";
import MemberDashboard from "./pages/member/Dashboard";
import MemberTasks from "./pages/member/Tasks";
import MemberInsights from "./pages/member/Insights";
import MemberAutomations from "./pages/member/Automations";
import MarketingDashboard from "./pages/marketing/Dashboard";
import MarketingPersonas from "./pages/marketing/Personas";
import MarketingTrends from "./pages/marketing/Trends";
import MarketingCompetitors from "./pages/marketing/Competitors";
import CampaignDashboard from "./pages/campaigns/Dashboard";
import CampaignPlanner from "./pages/campaigns/Planner";
import CampaignAds from "./pages/campaigns/Ads";
import CampaignBudget from "./pages/campaigns/Budget";
import ProspectDashboard from "./pages/prospect/Dashboard";
import ProspectLeads from "./pages/prospect/Leads";
import ProspectSequences from "./pages/prospect/Sequences";
import ProspectPipeline from "./pages/prospect/Pipeline";
import ContentCalendarPage from "./pages/platform/ContentCalendar";
import InfluencerManagerPage from "./pages/platform/InfluencerManager";
import AssetLibraryPage from "./pages/platform/AssetLibrary";
import NotificationCenterPage from "./pages/platform/NotificationCenter";
import AnalyticsHubPage from "./pages/platform/AnalyticsHub";
import AutomationStudioPage from "./pages/platform/AutomationStudio";
import IntegrationsHubPage from "./pages/platform/IntegrationsHub";
import SuperAdminShell from "./layouts/SuperAdminShell";
import SuperAdminDashboard from "./pages/superadmin/Dashboard";
import TenantsPage from "./pages/superadmin/Tenants";
import TenantDetailPage from "./pages/superadmin/TenantDetail";
import BillingPage from "./pages/superadmin/Billing";
import SuperAdminFeatureFlags from "./pages/superadmin/FeatureFlags";
import AuditLogsPage from "./pages/superadmin/AuditLogs";
import IntegrationsPage from "./pages/superadmin/Integrations";
import Button from "./components/ui/Button";
import {
  FiBarChart2,
  FiBook,
  FiBell,
  FiCompass,
  FiFlag,
  FiGlobe,
  FiHome,
  FiLayout,
  FiList,
  FiCalendar,
  FiTarget,
  FiShield,
  FiSettings,
  FiTrendingUp,
  FiUsers,
  FiZap,
  FiActivity,
  FiDatabase,
  FiLink,
} from "react-icons/fi";

type View =
  | "library"
  | "org-dashboard"
  | "team"
  | "settings"
  | "integrations"
  | "flags"
  | "usage"
  | "seo-dashboard"
  | "seo-playbooks"
  | "seo-alerts"
  | "marketing-dashboard"
  | "marketing-personas"
  | "marketing-trends"
  | "marketing-competitors"
  | "prospect-dashboard"
  | "prospect-leads"
  | "prospect-sequences"
  | "prospect-pipeline"
  | "campaign-dashboard"
  | "campaign-planner"
  | "campaign-ads"
  | "campaign-budget"
  | "platform-content"
  | "platform-influencers"
  | "platform-assets"
  | "platform-notifications"
  | "platform-analytics"
  | "platform-automation"
  | "platform-integrations"
  | "member-dashboard"
  | "member-tasks"
  | "member-insights"
  | "member-automations"
  | "super-admin-dashboard"
  | "super-admin-tenants"
  | "super-admin-tenant-detail"
  | "super-admin-billing"
  | "super-admin-flags"
  | "super-admin-logs"
  | "super-admin-integrations";

function App() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [view, setView] = useState<View>("super-admin-dashboard");

  const allViews = useMemo<View[]>(
    () => [
      "library",
      "org-dashboard",
      "team",
      "settings",
      "integrations",
      "flags",
      "usage",
      "seo-dashboard",
      "seo-playbooks",
      "seo-alerts",
      "marketing-dashboard",
      "marketing-personas",
      "marketing-trends",
      "marketing-competitors",
      "prospect-dashboard",
      "prospect-leads",
      "prospect-sequences",
      "prospect-pipeline",
      "campaign-dashboard",
      "campaign-planner",
      "campaign-ads",
      "campaign-budget",
      "platform-content",
      "platform-influencers",
      "platform-assets",
      "platform-notifications",
      "platform-analytics",
      "platform-automation",
      "platform-integrations",
      "member-dashboard",
      "member-tasks",
      "member-insights",
      "member-automations",
      "super-admin-dashboard",
      "super-admin-tenants",
      "super-admin-tenant-detail",
      "super-admin-billing",
      "super-admin-flags",
      "super-admin-logs",
      "super-admin-integrations",
    ],
    [],
  );

  const handleNavigate = (route: string) => {
    if (allViews.includes(route as View)) {
      setView(route as View);
      setPreviewOpen(false);
    }
  };

  const renderView = () => {
    switch (view) {
      case "library":
        return <ComponentLibraryPage onNavigate={handleNavigate} />;
      case "super-admin-dashboard":
        return (
          <SuperAdminShell
            title="Platform overview"
            description="Monitor tenants, usage, and automation health across the Nexylomedia platform."
            onNavigate={(route) => setView(route as View)}
            activeRoute={view}
          >
            <SuperAdminDashboard />
          </SuperAdminShell>
        );
      case "super-admin-tenants":
        return (
          <SuperAdminShell
            title="Tenants"
            description="Manage tenant lifecycle, quotas, and impersonation."
            onNavigate={(route) => setView(route as View)}
            activeRoute={view}
          >
            <TenantsPage />
          </SuperAdminShell>
        );
      case "super-admin-tenant-detail":
        return (
          <SuperAdminShell
            title="Tenant detail"
            breadcrumbs={[
              { label: "Super Admin", href: "#" },
              { label: "Tenants", href: "#" },
              { label: "Tenant detail" },
            ]}
            description="Usage dashboards, integrations, and recent activity."
            onNavigate={(route) => setView(route as View)}
            activeRoute={view}
          >
            <TenantDetailPage />
          </SuperAdminShell>
        );
      case "super-admin-billing":
        return (
          <SuperAdminShell
            title="Billing & invoices"
            description="Billing history and plan adjustments across the platform."
            onNavigate={(route) => setView(route as View)}
            activeRoute={view}
          >
            <BillingPage />
          </SuperAdminShell>
        );
      case "super-admin-flags":
        return (
          <SuperAdminShell
            title="Feature flags"
            description="Enable or disable capabilities per tenant."
            onNavigate={(route) => setView(route as View)}
            activeRoute={view}
          >
            <SuperAdminFeatureFlags />
          </SuperAdminShell>
        );
      case "super-admin-logs":
        return (
          <SuperAdminShell
            title="Audit logs"
            description="Track super admin actions and automation events."
            onNavigate={(route) => setView(route as View)}
            activeRoute={view}
          >
            <AuditLogsPage />
          </SuperAdminShell>
        );
      case "super-admin-integrations":
        return (
          <SuperAdminShell
            title="Global integrations"
            description="Manage platform connectors and availability."
            onNavigate={(route) => setView(route as View)}
            activeRoute={view}
          >
            <IntegrationsPage />
          </SuperAdminShell>
        );
      case "org-dashboard":
        return <OrgDashboard onNavigate={handleNavigate} />;
      case "team":
        return <TeamUsers onNavigate={handleNavigate} />;
      case "settings":
        return <OrganizationSettings onNavigate={handleNavigate} />;
      case "integrations":
        return <OrgIntegrations onNavigate={handleNavigate} />;
      case "flags":
        return <FeatureFlags onNavigate={handleNavigate} />;
      case "usage":
        return <UsageQuotas onNavigate={handleNavigate} />;
      case "seo-dashboard":
        return <SeoAutopilotDashboard onNavigate={handleNavigate} />;
      case "seo-playbooks":
        return <SeoPlaybooksPage onNavigate={handleNavigate} />;
      case "seo-alerts":
        return <SeoAlertsPage onNavigate={handleNavigate} />;
      case "marketing-dashboard":
        return <MarketingDashboard onNavigate={handleNavigate} />;
      case "marketing-personas":
        return <MarketingPersonas onNavigate={handleNavigate} />;
      case "marketing-trends":
        return <MarketingTrends onNavigate={handleNavigate} />;
      case "marketing-competitors":
        return <MarketingCompetitors onNavigate={handleNavigate} />;
      case "prospect-dashboard":
        return <ProspectDashboard onNavigate={handleNavigate} />;
      case "prospect-leads":
        return <ProspectLeads onNavigate={handleNavigate} />;
      case "prospect-sequences":
        return <ProspectSequences onNavigate={handleNavigate} />;
      case "prospect-pipeline":
        return <ProspectPipeline onNavigate={handleNavigate} />;
      case "campaign-dashboard":
        return <CampaignDashboard onNavigate={handleNavigate} />;
      case "campaign-planner":
        return <CampaignPlanner onNavigate={handleNavigate} />;
      case "campaign-ads":
        return <CampaignAds onNavigate={handleNavigate} />;
      case "campaign-budget":
        return <CampaignBudget onNavigate={handleNavigate} />;
      case "platform-content":
        return <ContentCalendarPage onNavigate={handleNavigate} />;
      case "platform-influencers":
        return <InfluencerManagerPage onNavigate={handleNavigate} />;
      case "platform-assets":
        return <AssetLibraryPage onNavigate={handleNavigate} />;
      case "platform-notifications":
        return <NotificationCenterPage onNavigate={handleNavigate} />;
      case "platform-analytics":
        return <AnalyticsHubPage onNavigate={handleNavigate} />;
      case "platform-automation":
        return <AutomationStudioPage onNavigate={handleNavigate} />;
      case "platform-integrations":
        return <IntegrationsHubPage onNavigate={handleNavigate} />;
      case "member-dashboard":
        return <MemberDashboard onNavigate={handleNavigate} />;
      case "member-tasks":
        return <MemberTasks onNavigate={handleNavigate} />;
      case "member-insights":
        return <MemberInsights onNavigate={handleNavigate} />;
      case "member-automations":
        return <MemberAutomations onNavigate={handleNavigate} />;
      default:
        return <OrgDashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setPreviewOpen((prev) => !prev)}
        className="fixed right-6 top-6 z-50 hidden rounded-full border border-border bg-bg px-4 py-2 text-xs font-semibold shadow-subtle transition hover:border-primary/40 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 lg:block"
      >
        {previewOpen ? "Close Preview Menu" : "Open Preview Menu"}
      </button>
      {previewOpen && (
        <div className="fixed right-6 top-20 z-50 hidden max-h-[80vh] w-64 flex-col gap-2 overflow-y-auto rounded-2xl border border-border bg-bg p-4 shadow-subtle dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 lg:flex">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted dark:text-slate-400">
          Preview surface
        </p>
        <Button
          variant={view === "super-admin-dashboard" ? "primary" : "ghost"}
          size="sm"
          icon={<FiShield />}
          onClick={() => handleNavigate("super-admin-dashboard")}
        >
          Super Admin overview
        </Button>
        <Button
          variant={view === "super-admin-tenants" ? "primary" : "ghost"}
          size="sm"
          icon={<FiUsers />}
          onClick={() => handleNavigate("super-admin-tenants")}
        >
          Super Admin tenants
        </Button>
        <Button
          variant={view === "super-admin-tenant-detail" ? "primary" : "ghost"}
          size="sm"
          icon={<FiUsers />}
          onClick={() => handleNavigate("super-admin-tenant-detail")}
        >
          Tenant detail
        </Button>
        <Button
          variant={view === "super-admin-billing" ? "primary" : "ghost"}
          size="sm"
          icon={<FiBarChart2 />}
          onClick={() => handleNavigate("super-admin-billing")}
        >
          Super Admin billing
        </Button>
        <Button
          variant={view === "super-admin-flags" ? "primary" : "ghost"}
          size="sm"
          icon={<FiZap />}
          onClick={() => handleNavigate("super-admin-flags")}
        >
          Super Admin flags
        </Button>
        <Button
          variant={view === "super-admin-logs" ? "primary" : "ghost"}
          size="sm"
          icon={<FiLayout />}
          onClick={() => handleNavigate("super-admin-logs")}
        >
          Audit logs
        </Button>
        <Button
          variant={view === "super-admin-integrations" ? "primary" : "ghost"}
          size="sm"
          icon={<FiLayout />}
          onClick={() => handleNavigate("super-admin-integrations")}
        >
          Global integrations
        </Button>
        <Button
          variant={view === "org-dashboard" ? "primary" : "ghost"}
          size="sm"
          icon={<FiTrendingUp />}
          onClick={() => handleNavigate("org-dashboard")}
        >
          Org dashboard
        </Button>
        <Button
          variant={view === "team" ? "primary" : "ghost"}
          size="sm"
          icon={<FiUsers />}
          onClick={() => handleNavigate("team")}
        >
          Team & users
        </Button>
        <Button
          variant={view === "settings" ? "primary" : "ghost"}
          size="sm"
          icon={<FiSettings />}
          onClick={() => handleNavigate("settings")}
        >
          Org settings
        </Button>
        <Button
          variant={view === "integrations" ? "primary" : "ghost"}
          size="sm"
          icon={<FiLayout />}
          onClick={() => handleNavigate("integrations")}
        >
          Integrations
        </Button>
        <Button
          variant={view === "flags" ? "primary" : "ghost"}
          size="sm"
          icon={<FiZap />}
          onClick={() => handleNavigate("flags")}
        >
          Feature flags
        </Button>
        <Button
          variant={view === "usage" ? "primary" : "ghost"}
          size="sm"
          icon={<FiBarChart2 />}
          onClick={() => handleNavigate("usage")}
        >
          Usage & quotas
        </Button>
        <Button
          variant={view === "seo-dashboard" ? "primary" : "ghost"}
          size="sm"
          icon={<FiZap />}
          onClick={() => handleNavigate("seo-dashboard")}
        >
          SEO Autopilot
        </Button>
        <Button
          variant={view === "seo-playbooks" ? "primary" : "ghost"}
          size="sm"
          icon={<FiBook />}
          onClick={() => handleNavigate("seo-playbooks")}
        >
          SEO playbooks
        </Button>
        <Button
          variant={view === "seo-alerts" ? "primary" : "ghost"}
          size="sm"
          icon={<FiBell />}
          onClick={() => handleNavigate("seo-alerts")}
        >
          SEO alerts
        </Button>
        <Button
          variant={view === "marketing-dashboard" ? "primary" : "ghost"}
          size="sm"
          icon={<FiGlobe />}
          onClick={() => handleNavigate("marketing-dashboard")}
        >
          Market Research
        </Button>
        <Button
          variant={view === "marketing-personas" ? "primary" : "ghost"}
          size="sm"
          icon={<FiUsers />}
          onClick={() => handleNavigate("marketing-personas")}
        >
          Personas
        </Button>
        <Button
          variant={view === "marketing-trends" ? "primary" : "ghost"}
          size="sm"
          icon={<FiTrendingUp />}
          onClick={() => handleNavigate("marketing-trends")}
        >
          Trend radar
        </Button>
        <Button
          variant={view === "marketing-competitors" ? "primary" : "ghost"}
          size="sm"
          icon={<FiFlag />}
          onClick={() => handleNavigate("marketing-competitors")}
        >
          Competitors
        </Button>
        <Button
          variant={view === "prospect-dashboard" ? "primary" : "ghost"}
          size="sm"
          icon={<FiTarget />}
          onClick={() => handleNavigate("prospect-dashboard")}
        >
          Prospect Radar
        </Button>
        <Button
          variant={view === "prospect-leads" ? "primary" : "ghost"}
          size="sm"
          icon={<FiUsers />}
          onClick={() => handleNavigate("prospect-leads")}
        >
          Leads
        </Button>
        <Button
          variant={view === "prospect-sequences" ? "primary" : "ghost"}
          size="sm"
          icon={<FiZap />}
          onClick={() => handleNavigate("prospect-sequences")}
        >
          Sequences
        </Button>
        <Button
          variant={view === "prospect-pipeline" ? "primary" : "ghost"}
          size="sm"
          icon={<FiBarChart2 />}
          onClick={() => handleNavigate("prospect-pipeline")}
        >
          Pipeline
        </Button>
        <Button
          variant={view === "campaign-dashboard" ? "primary" : "ghost"}
          size="sm"
          icon={<FiTarget />}
          onClick={() => handleNavigate("campaign-dashboard")}
        >
          Campaign HQ
        </Button>
        <Button
          variant={view === "campaign-planner" ? "primary" : "ghost"}
          size="sm"
          icon={<FiCalendar />}
          onClick={() => handleNavigate("campaign-planner")}
        >
          Planner
        </Button>
        <Button
          variant={view === "campaign-ads" ? "primary" : "ghost"}
          size="sm"
          icon={<FiZap />}
          onClick={() => handleNavigate("campaign-ads")}
        >
          Ads builder
        </Button>
        <Button
          variant={view === "campaign-budget" ? "primary" : "ghost"}
          size="sm"
          icon={<FiBarChart2 />}
          onClick={() => handleNavigate("campaign-budget")}
        >
          Budget & pacing
        </Button>
        <Button
          variant={view === "platform-content" ? "primary" : "ghost"}
          size="sm"
          icon={<FiCalendar />}
          onClick={() => handleNavigate("platform-content")}
        >
          Content calendar
        </Button>
        <Button
          variant={view === "platform-influencers" ? "primary" : "ghost"}
          size="sm"
          icon={<FiUsers />}
          onClick={() => handleNavigate("platform-influencers")}
        >
          Influencer manager
        </Button>
        <Button
          variant={view === "platform-assets" ? "primary" : "ghost"}
          size="sm"
          icon={<FiDatabase />}
          onClick={() => handleNavigate("platform-assets")}
        >
          Asset library
        </Button>
        <Button
          variant={view === "platform-notifications" ? "primary" : "ghost"}
          size="sm"
          icon={<FiBell />}
          onClick={() => handleNavigate("platform-notifications")}
        >
          Notification center
        </Button>
        <Button
          variant={view === "platform-analytics" ? "primary" : "ghost"}
          size="sm"
          icon={<FiBarChart2 />}
          onClick={() => handleNavigate("platform-analytics")}
        >
          Analytics hub
        </Button>
        <Button
          variant={view === "platform-automation" ? "primary" : "ghost"}
          size="sm"
          icon={<FiActivity />}
          onClick={() => handleNavigate("platform-automation")}
        >
          Automation studio
        </Button>
        <Button
          variant={view === "platform-integrations" ? "primary" : "ghost"}
          size="sm"
          icon={<FiLink />}
          onClick={() => handleNavigate("platform-integrations")}
        >
          Integrations hub
        </Button>
        <Button
          variant={view === "member-dashboard" ? "primary" : "ghost"}
          size="sm"
          icon={<FiHome />}
          onClick={() => handleNavigate("member-dashboard")}
        >
          Member workspace
        </Button>
        <Button
          variant={view === "member-tasks" ? "primary" : "ghost"}
          size="sm"
          icon={<FiList />}
          onClick={() => handleNavigate("member-tasks")}
        >
          My tasks
        </Button>
        <Button
          variant={view === "member-insights" ? "primary" : "ghost"}
          size="sm"
          icon={<FiCompass />}
          onClick={() => handleNavigate("member-insights")}
        >
          Personal insights
        </Button>
        <Button
          variant={view === "member-automations" ? "primary" : "ghost"}
          size="sm"
          icon={<FiZap />}
          onClick={() => handleNavigate("member-automations")}
        >
          Automation center
        </Button>
        <Button
          variant={view === "library" ? "primary" : "ghost"}
          size="sm"
          onClick={() => handleNavigate("library")}
        >
          Component library
        </Button>
      </div>
      )}
      {renderView()}
    </div>
  );
}

export default App;
