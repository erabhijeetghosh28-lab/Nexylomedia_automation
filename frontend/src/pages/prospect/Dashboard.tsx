import { FiDownload, FiPlay, FiZap } from "react-icons/fi";
import AppShell from "../../layouts/AppShell";
import KpiCard from "../../components/ui/KpiCard";
import Sparkline from "../../components/ui/Sparkline";
import Card from "../../components/ui/Card";
import DataTable from "../../components/ui/DataTable";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Timeline, { type TimelineItem } from "../../components/ui/Timeline";
import {
  prospectKpis,
  prospectLeads,
  handoffTasks,
} from "../../data/prospect";

type ProspectPageProps = {
  onNavigate?: (route: string) => void;
};

const handoffTimeline: TimelineItem[] = handoffTasks.map((task) => ({
  id: task.id,
  title: task.title,
  description: `Priority: ${task.priority}`,
  timestamp: task.due,
  status: task.priority === "High" ? "danger" : task.priority === "Medium" ? "warning" : "info",
}));

const ProspectDashboard = ({ onNavigate }: ProspectPageProps) => {
  return (
    <AppShell
      title="Prospect Radar"
      description="Centralize lead intelligence, automate sourcing, and hand off action items seamlessly to sales."
      breadcrumbs={[
        { label: "Org Admin", href: "#" },
        { label: "Prospect Radar" },
      ]}
      rightAccessory={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" icon={<FiDownload />}>
            Export pipeline CSV
          </Button>
          <Button variant="primary" size="sm" icon={<FiPlay />} onClick={() => onNavigate?.("prospect-sequences")}>
            Launch sequence
          </Button>
        </div>
      }
      onNavigate={onNavigate}
    >
      <section className="grid gap-6 lg:grid-cols-4">
        {prospectKpis.map((kpi) => (
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
          title="Pipeline snapshot"
          subtitle="Leads sourced this week."
          action={
            <Button variant="ghost" size="sm" onClick={() => onNavigate?.("prospect-leads")}>
              View all leads
            </Button>
          }
        >
          <DataTable
            columns={[
              { key: "name", header: "Lead" },
              { key: "company", header: "Company" },
              { key: "stage", header: "Stage" },
              { key: "fit", header: "Fit" },
              { key: "owner", header: "Owner" },
            ]}
            data={prospectLeads}
          />
        </Card>

        <Card title="Automation hand-offs" subtitle="Next actions from automations.">
          <Timeline items={handoffTimeline} />
        </Card>
      </section>

      <Card
        title="Automation coverage"
        subtitle="Which sources feed Prospect Radar."
        action={
          <Badge variant="info" dot>
            Connected: LinkedIn, Apollo, Gemini
          </Badge>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              label: "Inbound enrichment",
              detail: "Automatically enrich form fills and assign to SDR queue.",
            },
            {
              label: "Intent signals",
              detail: "Surface companies researching automation via webhooks.",
            },
            {
              label: "Outreach sync",
              detail: "Push hot leads directly into sequences with personalization tokens.",
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
                {item.detail}
              </p>
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon={<FiZap />}
          className="mt-4"
          onClick={() => onNavigate?.("prospect-sequences")}
        >
          Configure automations
        </Button>
      </Card>
    </AppShell>
  );
};

export default ProspectDashboard;

