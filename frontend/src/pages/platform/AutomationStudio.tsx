import { FiDownload, FiPlay, FiSettings } from "react-icons/fi";
import AppShell from "../../layouts/AppShell";
import Card from "../../components/ui/Card";
import DataTable from "../../components/ui/DataTable";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { automationPipelines } from "../../data/platform";

type PlatformPageProps = {
  onNavigate?: (route: string) => void;
};

const AutomationStudioPage = ({ onNavigate }: PlatformPageProps) => {
  return (
    <AppShell
      title="Automation studio"
      description="Visual builder powered by n8n to orchestrate workflows across the platform."
      breadcrumbs={[
        { label: "Org Admin", href: "#" },
        { label: "Platform Ops", href: "#" },
        { label: "Automation studio" },
      ]}
      rightAccessory={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" icon={<FiDownload />}>
            Export workflow
          </Button>
          <Button variant="primary" size="sm" icon={<FiPlay />} onClick={() => onNavigate?.("platform-automation")}>
            Run builder
          </Button>
        </div>
      }
      onNavigate={onNavigate}
    >
      <Card
        title="Workflow inventory"
        subtitle="Syncs with n8n instance; statuses update in real-time."
        action={
          <Badge variant="info" dot>
            Connected
          </Badge>
        }
      >
        <DataTable
          columns={[
            { key: "name", header: "Workflow" },
            { key: "status", header: "Status" },
            { key: "lastRun", header: "Last run" },
            { key: "triggers", header: "Triggers" },
            {
              key: "actions",
              header: "",
              render: () => (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" icon={<FiSettings />}>
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" icon={<FiPlay />}>
                    Execute
                  </Button>
                </div>
              ),
            },
          ]}
          data={automationPipelines}
        />
      </Card>

      <Card
        title="Common blueprints"
        subtitle="Kickstart new workflows with tested templates."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "SEO alert triage",
              detail: "Trigger from SEO Autopilot, open tasks, notify stakeholders.",
            },
            {
              title: "Lead enrichment loop",
              detail: "Prospect Radar + Market Research + CRM sync.",
            },
            {
              title: "Campaign pacing guardrail",
              detail: "Monitor spend variance and reallocate budgets automatically.",
            },
          ].map((blueprint) => (
            <div
              key={blueprint.title}
              className="rounded-2xl border border-border bg-bg p-4 dark:border-slate-700 dark:bg-slate-900"
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {blueprint.title}
              </p>
              <p className="mt-2 text-xs text-muted dark:text-slate-400">{blueprint.detail}</p>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
};

export default AutomationStudioPage;

