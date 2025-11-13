import { FiBarChart2, FiDownload, FiRefreshCcw } from "react-icons/fi";
import AppShell from "../../layouts/AppShell";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import { trendSignals } from "../../data/marketing";

type MarketingPageProps = {
  onNavigate?: (route: string) => void;
};

const TrendsPage = ({ onNavigate }: MarketingPageProps) => {
  return (
    <AppShell
      title="Trend radar"
      description="Track fast-moving topics, sentiment shifts, and keyword surges to inform campaigns."
      breadcrumbs={[
        { label: "Org Admin", href: "#" },
        { label: "Market Research", href: "#" },
        { label: "Trends" },
      ]}
      rightAccessory={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" icon={<FiDownload />}>
            Export trend report
          </Button>
          <Button variant="primary" size="sm" icon={<FiRefreshCcw />} onClick={() => onNavigate?.("seo-dashboard")}>
            Sync with SEO Autopilot
          </Button>
        </div>
      }
      onNavigate={onNavigate}
    >
      <Card
        title="Velocity signals"
        subtitle="Powered by social, SERP, and conversation monitoring."
        action={
          <Badge variant="success" dot>
            Updated 12 minutes ago
          </Badge>
        }
      >
        <DataTable
          columns={[
            { key: "topic", header: "Topic" },
            { key: "velocity", header: "Velocity" },
            { key: "change", header: "Movement" },
            { key: "recommendation", header: "Recommendation" },
          ]}
          data={trendSignals}
        />
      </Card>

      <Card
        title="Channel insights"
        subtitle="Where conversations originate and how to react."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              label: "Communities",
              insight: "Automation ROI calculators trending on Reddit & Slack.",
              action: "Activate community managers to respond within 24h.",
            },
            {
              label: "Search",
              insight: "Queries for 'market research ai templates' up 32%.",
              action: "Launch landing page + blog update.",
            },
            {
              label: "Influencers",
              insight: "3 thought leaders discussing prospect personalization.",
              action: "Pitch collaboration using Prospect Radar data.",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-border bg-bg p-4 dark:border-slate-700 dark:bg-slate-900"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted dark:text-slate-400">
                {item.label}
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                {item.insight}
              </p>
              <p className="mt-2 text-xs text-muted dark:text-slate-400">{item.action}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card
        title="Action queue"
        subtitle="Push high-value actions into automations."
      >
        <ul className="space-y-3 text-xs text-muted dark:text-slate-400">
          <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            • Create targeted ad copy around “automation ROI calculator”.
          </li>
          <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            • Overlay market research data in Prospect Radar sequences.
          </li>
          <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            • Feed topic clusters into Content Calendar for December.
          </li>
        </ul>
        <Button
          variant="ghost"
          size="sm"
          icon={<FiBarChart2 />}
          className="mt-4"
          onClick={() => onNavigate?.("marketing-competitors")}
        >
          Compare competitor moves
        </Button>
      </Card>
    </AppShell>
  );
};

export default TrendsPage;

