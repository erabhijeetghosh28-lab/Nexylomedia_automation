import { FiDownload, FiTrendingUp } from "react-icons/fi";
import MemberShell from "../../layouts/MemberShell";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import DataTable from "../../components/ui/DataTable";
import Sparkline from "../../components/ui/Sparkline";
import Badge from "../../components/ui/Badge";
import { memberInsights } from "../../data/member";

type MemberPageProps = {
  onNavigate?: (route: string) => void;
};

const trendData = [
  { label: "Mon", value: 68 },
  { label: "Tue", value: 72 },
  { label: "Wed", value: 74 },
  { label: "Thu", value: 78 },
  { label: "Fri", value: 81 },
  { label: "Sat", value: 83 },
  { label: "Sun", value: 86 },
];

const InsightsPage = ({ onNavigate }: MemberPageProps) => {
  return (
    <MemberShell
      title="Insights"
      description="Personalized analytics paired with guidance. Drill into trends surfaced from SEO, campaigns, and automations."
      breadcrumbs={[
        { label: "My workspace", href: "#" },
        { label: "Insights" },
      ]}
      rightAccessory={
        <Button variant="ghost" size="sm" icon={<FiDownload />}>
          Export snapshot
        </Button>
      }
      onNavigate={onNavigate}
      activeRoute="member-insights"
    >
      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card
          title="Momentum score"
          subtitle="Composite index of your impact last 7 days."
          action={
            <Badge variant="success" dot>
              +9 vs prior week
            </Badge>
          }
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-bg p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted dark:text-slate-400">
                Score trajectory
              </p>
              <Sparkline values={trendData.map((d) => d.value)} />
              <p className="text-xs text-muted dark:text-slate-400">
                Consistent week-over-week improvements driven by campaign execution.
              </p>
            </div>
            <div className="space-y-4 text-sm text-muted dark:text-slate-400">
              <p>• 42% of completed work tied to automation hand-offs.</p>
              <p>• Response time to critical alerts down to 38 minutes (best yet).</p>
              <p>• Net new insights generated via Market Research: 5.</p>
              <Button
                variant="ghost"
                size="sm"
                icon={<FiTrendingUp />}
                onClick={() => onNavigate?.("member-tasks")}
              >
                Assign follow-up tasks
              </Button>
            </div>
          </div>
        </Card>

        <Card title="Signal breakdown" subtitle="Where your energy delivers outsized returns.">
          <ul className="space-y-3 text-xs text-muted dark:text-slate-400">
            <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
              • Market Research insights used in 3 proposals (↑2 week-over-week)
            </li>
            <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
              • Prospect Radar assists closed 4 SQLs (↑1 week-over-week)
            </li>
            <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
              • Content updates from SEO Autopilot reduced bounce rate by 8%
            </li>
          </ul>
        </Card>
      </section>

      <Card title="Key insights" subtitle="Automatically generated for your role.">
        <DataTable
          columns={[
            {
              key: "metric",
              header: "Metric",
            },
            {
              key: "value",
              header: "Highlight",
            },
            {
              key: "context",
              header: "Context",
            },
          ]}
          data={memberInsights}
        />
      </Card>

      <Card title="Narrative summary" subtitle="AI-generated synopsis to share with your team.">
        <div className="space-y-4 text-sm text-muted dark:text-slate-400">
          <p>
            Momentum stayed strong thanks to consistent automation usage and faster follow-ups on
            SEO alerts. Your active automations saved 6+ hours, letting you finalize the holiday
            nurture sequence ahead of schedule.
          </p>
          <p>
            Core Web Vitals attention is paying off — CLS regressions were caught and triaged within
            30 minutes, preventing downstream ranking dips. Market Research data continues to lift
            personalization results, especially for growth operators.
          </p>
          <p>
            Recommended next step: turn the “Prospect Radar sync” learnings into a shareable
            playbook for the org admin team.
          </p>
        </div>
      </Card>
    </MemberShell>
  );
};

export default InsightsPage;

