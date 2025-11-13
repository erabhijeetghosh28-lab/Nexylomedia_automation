import { useState } from "react";
import {
  FiPlay,
  FiRefreshCcw,
  FiSettings,
  FiZap,
} from "react-icons/fi";
import MemberShell from "../../layouts/MemberShell";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import DataTable from "../../components/ui/DataTable";
import Toggle from "../../components/ui/Toggle";
import Modal from "../../components/ui/Modal";
import {
  automationRuns,
} from "../../data/member";

type MemberPageProps = {
  onNavigate?: (route: string) => void;
};

const recipes = [
  {
    id: "recipe-1",
    title: "New lead enrichment",
    description: "Combine Prospect Radar with CRM updates for high quality profiles.",
    eta: "5 min setup",
  },
  {
    id: "recipe-2",
    title: "SEO regression guard",
    description: "Monitor PageSpeed + Core Web Vitals, auto-open a task when thresholds slip.",
    eta: "8 min setup",
  },
  {
    id: "recipe-3",
    title: "Campaign recap generator",
    description: "Summarize performance and ship a draft email to stakeholders each Friday.",
    eta: "12 min setup",
  },
];

const AutomationsPage = ({ onNavigate }: MemberPageProps) => {
  const [selectedAutomation, setSelectedAutomation] = useState<string | null>(null);

  return (
    <MemberShell
      title="Automation center"
      description="Review personal automations, run tests, and explore recipes to accelerate your workflow."
      breadcrumbs={[
        { label: "My workspace", href: "#" },
        { label: "Automation center" },
      ]}
      rightAccessory={
        <Button variant="primary" size="sm" icon={<FiZap />} onClick={() => setSelectedAutomation("new")}>
          Build automation
        </Button>
      }
      onNavigate={onNavigate}
      activeRoute="member-automations"
    >
      <Card
        title="Active automations"
        subtitle="Status, cadence, and quick actions."
        action={
          <Button variant="ghost" size="sm" icon={<FiRefreshCcw />}>
            Refresh status
          </Button>
        }
      >
        <DataTable
          columns={[
            {
              key: "name",
              header: "Automation",
            },
            {
              key: "state",
              header: "State",
              render: (item: (typeof automationRuns)[number]) => (
                <Badge
                  variant={
                    item.state === "Running"
                      ? "success"
                      : item.state === "Paused"
                        ? "warning"
                        : "info"
                  }
                  dot
                >
                  {item.state}
                </Badge>
              ),
            },
            {
              key: "schedule",
              header: "Schedule",
            },
            {
              key: "lastRun",
              header: "Last run",
            },
            {
              key: "actions",
              header: "",
              render: (item: (typeof automationRuns)[number]) => (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<FiPlay />}
                    onClick={() => setSelectedAutomation(item.id)}
                  >
                    Run now
                  </Button>
                  <Button variant="ghost" size="sm" icon={<FiSettings />}>
                    Settings
                  </Button>
                </div>
              ),
            },
          ]}
          data={automationRuns}
        />
      </Card>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card
          title="Automation recipes"
          subtitle="Prebuilt flows to clone into your workspace."
        >
          <div className="grid gap-4 md:grid-cols-3">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-bg p-4 dark:border-slate-700 dark:bg-slate-900"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {recipe.title}
                  </p>
                  <p className="mt-1 text-xs text-muted dark:text-slate-400">
                    {recipe.description}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4"
                  onClick={() => setSelectedAutomation(recipe.id)}
                >
                  Clone recipe · {recipe.eta}
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Automation guardrails" subtitle="Safety controls and notifications.">
          <div className="space-y-4">
            <Toggle
              checked
              label="Pause automation when errors exceed 3 in 1 hour"
              description="Helps prevent runaway loops."
            />
            <Toggle
              checked={false}
              label="Request approval before publishing changes"
              description="Send to Org Admin for review."
              onChange={() => onNavigate?.("org-settings")}
            />
            <Toggle
              checked
              label="Notify me on Slack for manual steps"
              description="Channel: #automation-hand-offs"
            />
          </div>
        </Card>
      </section>

      <Modal
        open={Boolean(selectedAutomation)}
        onClose={() => setSelectedAutomation(null)}
        title="Automation run"
        description="Trigger this automation or configure a clone. This dialog is a preview only."
        footer={
          <>
            <Button variant="ghost" onClick={() => setSelectedAutomation(null)}>
              Close
            </Button>
            <Button variant="primary" icon={<FiPlay />} onClick={() => setSelectedAutomation(null)}>
              Run simulation
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted dark:text-slate-400">
          Automation <strong>{selectedAutomation}</strong> will execute using your saved credentials
          and guardrails. Live execution available once backend workflows are connected.
        </p>
      </Modal>
    </MemberShell>
  );
};

export default AutomationsPage;

