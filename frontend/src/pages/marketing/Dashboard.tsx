import { FiDownload, FiFilter, FiZap } from "react-icons/fi";
import AppShell from "../../layouts/AppShell";
import KpiCard from "../../components/ui/KpiCard";
import Sparkline from "../../components/ui/Sparkline";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import {
  marketingKpis,
  personaInsights,
  ideaBacklog,
} from "../../data/marketing";

type MarketingPageProps = {
  onNavigate?: (route: string) => void;
};

const MarketingDashboard = ({ onNavigate }: MarketingPageProps) => {
  return (
    <AppShell
      title="Market Research HQ"
      description="AI co-pilot for personas, trends, and campaign ideas. Centralize insights to power automation-ready go-to-market strategies."
      breadcrumbs={[
        { label: "Org Admin", href: "#" },
        { label: "Market Research" },
      ]}
      rightAccessory={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" icon={<FiDownload />}>
            Export summary
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<FiZap />}
            onClick={() => onNavigate?.("marketing-personas")}
          >
            Generate persona
          </Button>
        </div>
      }
      onNavigate={onNavigate}
    >
      <section className="grid gap-6 lg:grid-cols-4">
        {marketingKpis.map((kpi) => (
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
          title="Highlighted personas"
          subtitle="Personas flagged for upcoming campaigns."
          action={
            <Button variant="ghost" size="sm" icon={<FiFilter />} onClick={() => onNavigate?.("marketing-personas")}>
              View all personas
            </Button>
          }
        >
          <DataTable
            columns={[
              { key: "name", header: "Persona" },
              {
                key: "painPoints",
                header: "Pain points",
              },
              {
                key: "triggers",
                header: "Conversion triggers",
              },
            ]}
            data={personaInsights}
          />
        </Card>

        <Card title="AI insight stream" subtitle="Newest signals captured.">
          <ul className="space-y-3 text-xs text-muted dark:text-slate-400">
            <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
              • Newly emerging pain point: “automation ROI calculator” mentioned in 28 forums.
            </li>
            <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
              • Competitors doubling down on “hands-off campaign launch” messaging.
            </li>
            <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
              • Persona cross-over: Growth Operators now co-own automation budgets with Ops.
            </li>
          </ul>
        </Card>
      </section>

      <Card
        title="Idea backlog"
        subtitle="Campaign concepts scored by potential impact."
        action={
          <Badge variant="info" dot>
            2 ready for automation
          </Badge>
        }
      >
        <DataTable
          columns={[
            { key: "title", header: "Idea" },
            { key: "channel", header: "Channel" },
            { key: "persona", header: "Persona" },
            { key: "status", header: "Status" },
          ]}
          data={ideaBacklog}
        />
      </Card>
    </AppShell>
  );
};

export default MarketingDashboard;

