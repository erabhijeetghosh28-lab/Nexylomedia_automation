import { FiBarChart2, FiDownload, FiTrendingUp } from "react-icons/fi";
import AppShell from "../../layouts/AppShell";
import Card from "../../components/ui/Card";
import DataTable from "../../components/ui/DataTable";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { budgetAllocations } from "../../data/campaigns";

type CampaignPageProps = {
  onNavigate?: (route: string) => void;
};

const BudgetPage = ({ onNavigate }: CampaignPageProps) => {
  return (
    <AppShell
      title="Budget & pacing"
      description="Monitor spend, reallocate budget, and forecast impact."
      breadcrumbs={[
        { label: "Org Admin", href: "#" },
        { label: "Campaigns", href: "#" },
        { label: "Budget" },
      ]}
      rightAccessory={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" icon={<FiDownload />}>
            Export pacing report
          </Button>
          <Button variant="primary" size="sm" icon={<FiBarChart2 />} onClick={() => onNavigate?.("campaign-dashboard")}>
            View dashboard
          </Button>
        </div>
      }
      onNavigate={onNavigate}
    >
      <Card
        title="Allocation by channel"
        subtitle="Real-time view of planned vs actual."
        action={
          <Badge variant="info" dot>
            Last sync 4 minutes ago
          </Badge>
        }
      >
        <DataTable
          columns={[
            { key: "channel", header: "Channel" },
            { key: "planned", header: "Planned" },
            { key: "actual", header: "Actual" },
            { key: "variance", header: "Variance" },
          ]}
          data={budgetAllocations}
        />
      </Card>

      <Card
        title="Forecast adjustments"
        subtitle="Use automation recommendations to stay on target."
      >
        <ul className="space-y-3 text-xs text-muted dark:text-slate-400">
          <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            • Shift $1,200 from paid search to content syndication to balance spend.
          </li>
          <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            • Increase webinar retargeting budget by $800 for upcoming event.
          </li>
          <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            • Automate daily pacing alerts to Member workspace.
          </li>
        </ul>
        <Button
          variant="ghost"
          size="sm"
          icon={<FiTrendingUp />}
          className="mt-4"
          onClick={() => onNavigate?.("prospect-dashboard")}
        >
          Track pipeline impact
        </Button>
      </Card>
    </AppShell>
  );
};

export default BudgetPage;

