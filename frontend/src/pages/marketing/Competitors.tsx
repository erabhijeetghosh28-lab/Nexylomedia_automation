import { FiDownload, FiFlag, FiTarget } from "react-icons/fi";
import AppShell from "../../layouts/AppShell";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import { competitorMoves } from "../../data/marketing";

type MarketingPageProps = {
  onNavigate?: (route: string) => void;
};

const CompetitorsPage = ({ onNavigate }: MarketingPageProps) => {
  return (
    <AppShell
      title="Competitive intelligence"
      description="Monitor competitor releases, positioning, and messaging to inform our GTM automation."
      breadcrumbs={[
        { label: "Org Admin", href: "#" },
        { label: "Market Research", href: "#" },
        { label: "Competitors" },
      ]}
      rightAccessory={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" icon={<FiDownload />}>
            Export briefing
          </Button>
          <Button variant="primary" size="sm" icon={<FiFlag />} onClick={() => onNavigate?.("member-tasks")}>
            Create response plan
          </Button>
        </div>
      }
      onNavigate={onNavigate}
    >
      <Card
        title="Latest moves"
        subtitle="Sourced from public feeds, newsletters, and partner intel."
        action={
          <Badge variant="info">
            3 tracked competitors
          </Badge>
        }
      >
        <DataTable
          columns={[
            { key: "company", header: "Company" },
            { key: "move", header: "Move" },
            { key: "impact", header: "Impact" },
            { key: "response", header: "Suggested response" },
          ]}
          data={competitorMoves}
        />
      </Card>

      <Card
        title="Positioning shifts"
        subtitle="Narratives to watch from each competitor."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              company: "AutomataHQ",
              shift: "Leaning into 'all-in-one ops platform' messaging.",
              counter: "Double down on niche automation depth + n8n integration.",
            },
            {
              company: "FlowForge",
              shift: "Positioning as budget-friendly alternative for agencies.",
              counter: "Highlight ROI proof and premium support for agency scaling.",
            },
            {
              company: "NimbleOps",
              shift: "Marketing quick-start kits for content teams.",
              counter: "Showcase multi-team orchestration and SEO Autopilot coverage.",
            },
          ].map((item) => (
            <div
              key={item.company}
              className="rounded-2xl border border-border bg-bg p-4 dark:border-slate-700 dark:bg-slate-900"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted dark:text-slate-400">
                {item.company}
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                {item.shift}
              </p>
              <p className="mt-2 text-xs text-muted dark:text-slate-400">
                Counter move: {item.counter}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card
        title="Response automation"
        subtitle="Automatically push competitor moves into campaigns."
      >
        <ul className="space-y-3 text-xs text-muted dark:text-slate-400">
          <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            • Sync high-impact moves to Member workspace action list.
          </li>
          <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            • Trigger campaign idea generator referencing updated positioning.
          </li>
          <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            • Alert Exec team when impact = High for 2+ moves in a week.
          </li>
        </ul>
        <Button
          variant="ghost"
          size="sm"
          icon={<FiTarget />}
          className="mt-4"
          onClick={() => onNavigate?.("marketing-dashboard")}
        >
          Back to dashboard
        </Button>
      </Card>
    </AppShell>
  );
};

export default CompetitorsPage;

