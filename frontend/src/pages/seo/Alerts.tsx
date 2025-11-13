import { FiBell, FiFilter, FiSlack, FiZap } from "react-icons/fi";
import AppShell from "../../layouts/AppShell";
import Card from "../../components/ui/Card";
import DataTable from "../../components/ui/DataTable";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Toggle from "../../components/ui/Toggle";
import { seoAlerts } from "../../data/seoAutopilot";

type SeoPageProps = {
  onNavigate?: (route: string) => void;
};

const AlertsPage = ({ onNavigate }: SeoPageProps) => {
  return (
    <AppShell
      title="SEO Alerts"
      description="Unified view of automated alerts, their severity, and response workflows."
      breadcrumbs={[
        { label: "Org Admin", href: "#" },
        { label: "SEO Autopilot", href: "#" },
        { label: "Alerts" },
      ]}
      rightAccessory={
        <Button variant="ghost" size="sm" icon={<FiFilter />}>
          Filter alerts
        </Button>
      }
      onNavigate={onNavigate}
    >
      <Card
        title="Active alerts"
        subtitle="Automations escalate issues based on severity."
        action={
          <Button variant="primary" size="sm" icon={<FiZap />}>
            Trigger diagnostic run
          </Button>
        }
      >
        <DataTable
          columns={[
            {
              key: "severity",
              header: "Severity",
              render: (item: (typeof seoAlerts)[number]) => (
                <Badge
                  variant={
                    item.severity === "High"
                      ? "danger"
                      : item.severity === "Medium"
                        ? "warning"
                        : "info"
                  }
                  dot
                >
                  {item.severity}
                </Badge>
              ),
            },
            { key: "title", header: "Alert" },
            { key: "detected", header: "Detected" },
            {
              key: "owners",
              header: "Owners",
              render: (item: (typeof seoAlerts)[number]) => item.owners.join(", "),
            },
            {
              key: "actions",
              header: "",
              render: () => (
                <Button variant="ghost" size="sm" icon={<FiSlack />}>
                  Notify channel
                </Button>
              ),
            },
          ]}
          data={seoAlerts}
        />
      </Card>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card
          title="Response playbook"
          subtitle="Automations assigned to each severity level."
        >
          <ul className="space-y-3 text-xs text-muted dark:text-slate-400">
            <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
              • High: Open member task, run remediation automation, ping #seo-critical
            </li>
            <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
              • Medium: Queue playbook review, attach Market Research snapshot
            </li>
            <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
              • Low: Log insight and include in weekly report
            </li>
          </ul>
        </Card>

        <Card
          title="Notification preferences"
          subtitle="Control how alerts reach stakeholders."
          action={
            <Badge variant="info">
              Synced with Member workspace
            </Badge>
          }
        >
          <div className="space-y-4">
            <Toggle
              checked
              label="Escalate high severity to SMS"
              description="Sends to on-call org admin"
            />
            <Toggle
              checked={false}
              label="Send weekly digest email"
              description="Every Monday at 8am"
            />
            <Toggle
              checked
              label="Auto-open task for blocked automations"
              description="Assign to Member workspace owner"
            />
            <Button variant="ghost" size="sm" icon={<FiBell />} onClick={() => onNavigate?.("member-dashboard")}>
              Preview member view
            </Button>
          </div>
        </Card>
      </section>
    </AppShell>
  );
};

export default AlertsPage;

