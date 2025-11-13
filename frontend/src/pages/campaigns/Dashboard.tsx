import { FiDownload, FiPlus, FiZap } from "react-icons/fi";
import AppShell from "../../layouts/AppShell";
import KpiCard from "../../components/ui/KpiCard";
import Sparkline from "../../components/ui/Sparkline";
import Card from "../../components/ui/Card";
import DataTable from "../../components/ui/DataTable";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import {
  campaignKpis,
  campaignSchedule,
  performanceHighlights,
} from "../../data/campaigns";

type CampaignPageProps = {
  onNavigate?: (route: string) => void;
};

const CampaignDashboard = ({ onNavigate }: CampaignPageProps) => {
  return (
    <AppShell
      title="Campaign command center"
      description="Coordinate launches, monitor spend, and unify performance across all channels."
      breadcrumbs={[
        { label: "Org Admin", href: "#" },
        { label: "Campaigns" },
      ]}
      rightAccessory={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" icon={<FiDownload />}>
            Export status deck
          </Button>
          <Button variant="primary" size="sm" icon={<FiPlus />} onClick={() => onNavigate?.("campaign-planner")}>
            Plan new campaign
          </Button>
        </div>
      }
      onNavigate={onNavigate}
    >
      <section className="grid gap-6 lg:grid-cols-4">
        {campaignKpis.map((kpi) => (
          <KpiCard
            key={kpi.title}
            title={kpi.title}
            description={kpi.description}
            value={kpi.value}
            change={kpi.change}
            trend={kpi.trend}
            sparkline={<Sparkline values={kpi.sparkline} />}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[2fr,1fr]">
        <Card
          title="Campaign schedule"
          subtitle="What’s running, what’s scheduled, and what’s in planning."
          action={
            <Button variant="ghost" size="sm" onClick={() => onNavigate?.("campaign-planner")}>
              Open planner
            </Button>
          }
        >
          <DataTable
            columns={[
              { key: "name", header: "Campaign" },
              { key: "channel", header: "Channels" },
              { key: "status", header: "Status" },
              { key: "start", header: "Start" },
              { key: "end", header: "End" },
            ]}
            data={campaignSchedule}
          />
        </Card>

        <Card title="Highlights" subtitle="Signals surfaced by automation.">
          <ul className="space-y-3 text-xs text-muted dark:text-slate-400">
            {performanceHighlights.map((item) => (
              <li
                key={item.id}
                className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
              >
                <p className="font-semibold text-slate-900 dark:text-slate-100">{item.metric}</p>
                <p className="mt-1">{item.detail}</p>
              </li>
            ))}
          </ul>
          <Button
            variant="ghost"
            size="sm"
            icon={<FiZap />}
            className="mt-4"
            onClick={() => onNavigate?.("campaign-ads")}
          >
            Review ads builder
          </Button>
        </Card>
      </section>

      <Card
        title="Risk alerts"
        subtitle="Automation watches budgets and pacing."
        action={
          <Badge variant="danger" dot>
            1 over budget
          </Badge>
        }
      >
        <ul className="space-y-3 text-xs text-muted dark:text-slate-400">
          <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            • Paid social pacing +12% ahead. Consider rebalancing.
          </li>
          <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            • Creative approvals pending for automation ROI blitz day 4.
          </li>
          <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            • Webinar funnel follow-up tasks assigned to Member workspace.
          </li>
        </ul>
      </Card>
    </AppShell>
  );
};

export default CampaignDashboard;

