import { FiCalendar, FiDownload, FiSettings } from "react-icons/fi";
import AppShell from "../../layouts/AppShell";
import KpiCard from "../../components/ui/KpiCard";
import Sparkline from "../../components/ui/Sparkline";
import Card from "../../components/ui/Card";
import DataTable from "../../components/ui/DataTable";
import Button from "../../components/ui/Button";
import Timeline, { type TimelineItem } from "../../components/ui/Timeline";
import Badge from "../../components/ui/Badge";
import {
  seoKpis,
  seoFocus,
  autopilotRuns,
  seoRecommendations,
} from "../../data/seoAutopilot";

type SeoPageProps = {
  onNavigate?: (route: string) => void;
};

const toTimelineStatus = (status: string): TimelineItem["status"] => {
  switch (status) {
    case "Success":
      return "success";
    case "Warning":
      return "warning";
    case "Failed":
      return "danger";
    default:
      return "info";
  }
};

const runTimeline: TimelineItem[] = autopilotRuns.map((run) => ({
  id: run.id,
  title: run.workflow,
  description: `${run.status} · ${run.duration}`,
  timestamp: run.runAt,
  status: toTimelineStatus(run.status),
}));

const SeoAutopilotDashboard = ({ onNavigate }: SeoPageProps) => {
  return (
    <AppShell
      title="SEO Autopilot"
      description="Real-time visibility into automation coverage, issue volume, and the next best actions across SEO."
      breadcrumbs={[
        { label: "Org Admin", href: "#" },
        { label: "SEO Autopilot" },
      ]}
      rightAccessory={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" icon={<FiDownload />}>
            Export health report
          </Button>
          <Button variant="primary" size="sm" icon={<FiCalendar />} onClick={() => onNavigate?.("seo-playbooks")}>
            View playbooks
          </Button>
        </div>
      }
      onNavigate={onNavigate}
    >
      <section className="grid gap-6 lg:grid-cols-4">
        {seoKpis.map((kpi) => (
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
          title="Focus areas"
          subtitle="Highlights generated from nightly automation runs."
          action={
            <Button variant="ghost" size="sm" icon={<FiSettings />}>
              Configure detectors
            </Button>
          }
        >
          <DataTable
            columns={[
              { key: "metric", header: "Signal" },
              { key: "value", header: "Detail" },
              {
                key: "action",
                header: "Next step",
              },
            ]}
            data={seoFocus}
          />
        </Card>

        <Card title="Recent automation runs" subtitle="Timeline of key workflows.">
          <Timeline items={runTimeline} />
        </Card>
      </section>

      <Card
        title="Recommended actions"
        subtitle="Approve, schedule, or assign to your team."
        action={
          <Badge variant="info" dot>
            Updated 8 minutes ago
          </Badge>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          {seoRecommendations.map((rec) => (
            <div
              key={rec.id}
              className="flex flex-col justify-between rounded-2xl border border-border bg-bg p-4 dark:border-slate-700 dark:bg-slate-900"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {rec.title}
                </p>
                <p className="mt-2 text-xs text-muted dark:text-slate-400">
                  Team: {rec.team}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted dark:text-slate-400">
                <span>Impact: {rec.impact}</span>
                <span>Effort: {rec.effort}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-4"
                onClick={() => onNavigate?.("member-tasks")}
              >
                Assign follow-up
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
};

export default SeoAutopilotDashboard;

