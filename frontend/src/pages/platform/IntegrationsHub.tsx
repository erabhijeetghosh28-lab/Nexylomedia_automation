import { FiDownload, FiLink } from "react-icons/fi";
import AppShell from "../../layouts/AppShell";
import Card from "../../components/ui/Card";
import DataTable from "../../components/ui/DataTable";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { integrationCatalog } from "../../data/platform";

type PlatformPageProps = {
  onNavigate?: (route: string) => void;
};

const IntegrationsHubPage = ({ onNavigate }: PlatformPageProps) => {
  return (
    <AppShell
      title="Integrations hub"
      description="Manage platform-wide connectors powering automations and data syncs."
      breadcrumbs={[
        { label: "Org Admin", href: "#" },
        { label: "Platform Ops", href: "#" },
        { label: "Integrations hub" },
      ]}
      rightAccessory={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" icon={<FiDownload />}>
            Export inventory
          </Button>
          <Button variant="primary" size="sm" icon={<FiLink />} onClick={() => onNavigate?.("prospect-dashboard")}>
            Add connector
          </Button>
        </div>
      }
      onNavigate={onNavigate}
    >
      <Card
        title="Connector catalog"
        subtitle="Shared across all tenants with per-org overrides."
        action={
          <Badge variant="info" dot>
            3 new connectors available
          </Badge>
        }
      >
        <DataTable
          columns={[
            { key: "name", header: "Integration" },
            { key: "category", header: "Category" },
            { key: "status", header: "Status" },
          ]}
          data={integrationCatalog}
        />
      </Card>

      <Card
        title="Governance"
        subtitle="Control access and monitoring."
      >
        <ul className="space-y-3 text-xs text-muted dark:text-slate-400">
          <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            • Role-based access ensures Member workspace only sees necessary connectors.
          </li>
          <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            • Health monitoring pushes alerts to Notification center.
          </li>
          <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            • Audit logs sync to Super Admin dashboard for transparency.
          </li>
        </ul>
      </Card>
    </AppShell>
  );
};

export default IntegrationsHubPage;

