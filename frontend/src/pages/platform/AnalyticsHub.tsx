import { FiDownload, FiShare2 } from "react-icons/fi";
import AppShell from "../../layouts/AppShell";
import Card from "../../components/ui/Card";
import DataTable from "../../components/ui/DataTable";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { analyticsSnapshots } from "../../data/platform";

type PlatformPageProps = {
  onNavigate?: (route: string) => void;
};

const AnalyticsHubPage = ({ onNavigate }: PlatformPageProps) => {
  return (
    <AppShell
      title="Analytics hub"
      description="Unified performance dashboards powered by every automation surface."
      breadcrumbs={[
        { label: "Org Admin", href: "#" },
        { label: "Platform Ops", href: "#" },
        { label: "Analytics hub" },
      ]}
      rightAccessory={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" icon={<FiDownload />}>
            Export deck
          </Button>
          <Button variant="primary" size="sm" icon={<FiShare2 />} onClick={() => onNavigate?.("super-admin-dashboard")}>
            Share with Super Admin
          </Button>
        </div>
      }
      onNavigate={onNavigate}
    >
      <Card
        title="Snapshot metrics"
        subtitle="Generated nightly."
        action={
          <Badge variant="info" dot>
            Updated 1 hour ago
          </Badge>
        }
      >
        <DataTable
          columns={[
            { key: "metric", header: "Metric" },
            { key: "value", header: "Value" },
            { key: "change", header: "Change" },
            { key: "source", header: "Source" },
          ]}
          data={analyticsSnapshots}
        />
      </Card>

      <Card
        title="Dashboards"
        subtitle="Prebuilt views ready to share."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Revenue influence",
              detail: "Connects Campaigns, Prospect Radar, and Member activity.",
            },
            {
              title: "Automation efficiency",
              detail: "Tracks hours saved, incidents prevented, and success rate.",
            },
            {
              title: "Content performance",
              detail: "Blend Content calendar outputs with SEO Autopilot results.",
            },
          ].map((dashboard) => (
            <div
              key={dashboard.title}
              className="rounded-2xl border border-border bg-bg p-4 dark:border-slate-700 dark:bg-slate-900"
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {dashboard.title}
              </p>
              <p className="mt-2 text-xs text-muted dark:text-slate-400">{dashboard.detail}</p>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
};

export default AnalyticsHubPage;

