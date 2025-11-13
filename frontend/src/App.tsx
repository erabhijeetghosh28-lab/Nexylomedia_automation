import { useState } from "react";
import ComponentLibraryPage from "./pages/components/ComponentLibrary";
import OrgDashboard from "./pages/org/OrgDashboard";
import TeamUsers from "./pages/org/TeamUsers";
import OrganizationSettings from "./pages/org/OrganizationSettings";
import OrgIntegrations from "./pages/org/OrgIntegrations";
import FeatureFlags from "./pages/org/FeatureFlags";
import UsageQuotas from "./pages/org/UsageQuotas";
import Button from "./components/ui/Button";
import {
  FiBarChart2,
  FiLayout,
  FiSettings,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from "react-icons/fi";

function App() {
  const [view, setView] = useState<
    "library" | "org-dashboard" | "team" | "settings" | "integrations" | "flags" | "usage"
  >("org-dashboard");

  const renderView = () => {
    switch (view) {
      case "library":
        return <ComponentLibraryPage />;
      case "org-dashboard":
        return <OrgDashboard />;
      case "team":
        return <TeamUsers />;
      case "settings":
        return <OrganizationSettings />;
      case "integrations":
        return <OrgIntegrations />;
      case "flags":
        return <FeatureFlags />;
      case "usage":
        return <UsageQuotas />;
      default:
        return <OrgDashboard />;
    }
  };

  return (
    <div className="relative">
      <div className="fixed right-6 top-6 z-50 hidden flex-col gap-2 rounded-2xl border border-border bg-bg p-4 shadow-subtle dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 lg:flex">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted dark:text-slate-400">
          Preview surface
        </p>
        <Button
          variant={view === "org-dashboard" ? "primary" : "ghost"}
          size="sm"
          icon={<FiTrendingUp />}
          onClick={() => setView("org-dashboard")}
        >
          Org dashboard
        </Button>
        <Button
          variant={view === "team" ? "primary" : "ghost"}
          size="sm"
          icon={<FiUsers />}
          onClick={() => setView("team")}
        >
          Team & users
        </Button>
        <Button
          variant={view === "settings" ? "primary" : "ghost"}
          size="sm"
          icon={<FiSettings />}
          onClick={() => setView("settings")}
        >
          Org settings
        </Button>
        <Button
          variant={view === "integrations" ? "primary" : "ghost"}
          size="sm"
          icon={<FiLayout />}
          onClick={() => setView("integrations")}
        >
          Integrations
        </Button>
        <Button
          variant={view === "flags" ? "primary" : "ghost"}
          size="sm"
          icon={<FiZap />}
          onClick={() => setView("flags")}
        >
          Feature flags
        </Button>
        <Button
          variant={view === "usage" ? "primary" : "ghost"}
          size="sm"
          icon={<FiBarChart2 />}
          onClick={() => setView("usage")}
        >
          Usage & quotas
        </Button>
        <Button
          variant={view === "library" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setView("library")}
        >
          Component library
        </Button>
      </div>
      {renderView()}
    </div>
  );
}

export default App;
