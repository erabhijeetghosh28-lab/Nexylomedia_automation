import { FiBarChart2, FiDownload, FiTrendingUp } from "react-icons/fi";
import AppShell from "../../layouts/AppShell";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import { pipelineStages } from "../../data/prospect";

type ProspectPageProps = {
  onNavigate?: (route: string) => void;
};

const PipelinePage = ({ onNavigate }: ProspectPageProps) => {
  return (
    <AppShell
      title="Pipeline intelligence"
      description="Understand velocity, coverage, and automation impact across the funnel."
      breadcrumbs={[
        { label: "Org Admin", href: "#" },
        { label: "Prospect Radar", href: "#" },
        { label: "Pipeline" },
      ]}
      rightAccessory={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" icon={<FiDownload />}>
            Export pipeline deck
          </Button>
          <Button variant="primary" size="sm" icon={<FiBarChart2 />} onClick={() => onNavigate?.("prospect-dashboard")}>
            Back to overview
          </Button>
        </div>
      }
      onNavigate={onNavigate}
    >
      <Card
        title="Stage metrics"
        subtitle="Automated rollups synced from CRM."
        action={
          <Badge variant="info" dot>
            Updated 5 minutes ago
          </Badge>
        }
      >
        <DataTable
          columns={[
            { key: "name", header: "Stage" },
            { key: "opportunities", header: "Opportunities" },
            { key: "value", header: "Value" },
            { key: "velocity", header: "Velocity" },
          ]}
          data={pipelineStages}
        />
      </Card>

      <Card
        title="Automation impact"
        subtitle="Funnel lift driven by automations vs manual efforts."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              label: "Automation-sourced pipeline",
              value: "$280k",
              detail: "+18% vs last month",
            },
            {
              label: "Manual-sourced pipeline",
              value: "$180k",
              detail: "-6% vs last month",
            },
            {
              label: "Closed won via automations",
              value: "9 deals",
              detail: "+3 vs last quarter",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-border bg-bg p-4 dark:border-slate-700 dark:bg-slate-900"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted dark:text-slate-400">
                {item.label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {item.value}
              </p>
              <p className="mt-1 text-xs text-muted dark:text-slate-400">{item.detail}</p>
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon={<FiTrendingUp />}
          className="mt-4"
          onClick={() => onNavigate?.("member-insights")}
        >
          Share with Member workspace
        </Button>
      </Card>
    </AppShell>
  );
};

export default PipelinePage;

