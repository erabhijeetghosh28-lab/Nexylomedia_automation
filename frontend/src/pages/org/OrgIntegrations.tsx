import { useState } from "react";
import {
  FiCheckCircle,
  FiLink,
  FiRefreshCcw,
  FiSettings,
  FiSlash,
} from "react-icons/fi";
import AppShell from "../../layouts/AppShell";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Toggle from "../../components/ui/Toggle";
import Modal from "../../components/ui/Modal";
import TextInput from "../../components/ui/TextInput";
import { integrations } from "../../data/org";

const OrgIntegrations = () => {
  const [connectModal, setConnectModal] = useState<string | null>(null);
  const [testStatus, setTestStatus] = useState<
    Record<string, "idle" | "loading" | "success">
  >({});

  const handleTestConnection = (name: string) => {
    setTestStatus((prev) => ({ ...prev, [name]: "loading" }));
    setTimeout(() => {
      setTestStatus((prev) => ({ ...prev, [name]: "success" }));
      setTimeout(() => {
        setTestStatus((prev) => ({ ...prev, [name]: "idle" }));
      }, 3000);
    }, 1200);
  };

  return (
    <AppShell
      title="Integrations"
      description="Connect services to enhance audits, automations, and campaigns. Manage credentials, run tests, and monitor status."
      breadcrumbs={[
        { label: "Org Admin", href: "#" },
        { label: "Integrations" },
      ]}
      rightAccessory={
        <Button variant="outline" size="sm" icon={<FiSettings />}>
          Integration settings
        </Button>
      }
    >
      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="grid gap-4">
          {integrations.map((integration) => {
            const statusBadge =
              integration.status === "connected" ? (
                <Badge variant="success" dot>
                  Connected
                </Badge>
              ) : (
                <Badge variant="warning" dot>
                  Not connected
                </Badge>
              );

            return (
              <Card
                key={integration.name}
                title={integration.name}
                subtitle={integration.description}
                action={statusBadge}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted dark:text-slate-400">
                    <FiCheckCircle className="text-success" />
                    <span>
                      {integration.status === "connected"
                        ? `Last checked ${integration.lastChecked}`
                        : "Connection required"}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant={
                        integration.status === "connected"
                          ? "outline"
                          : "primary"
                      }
                      size="sm"
                      icon={
                        integration.status === "connected" ? (
                          <FiSlash />
                        ) : (
                          <FiLink />
                        )
                      }
                      onClick={() => setConnectModal(integration.name)}
                    >
                      {integration.status === "connected"
                        ? "Manage"
                        : "Connect"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<FiRefreshCcw />}
                      disabled={integration.status !== "connected"}
                      loading={testStatus[integration.name] === "loading"}
                      onClick={() => handleTestConnection(integration.name)}
                    >
                      {testStatus[integration.name] === "success"
                        ? "Test passed"
                        : "Test connection"}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <aside className="space-y-4 rounded-2xl border border-border bg-bg p-6 shadow-subtle dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Event webhooks
          </h3>
          <div className="space-y-3 text-xs text-muted dark:text-slate-400">
            <p>
              Send automation events to external systems. Use for custom
              reporting or triggering downstream workflows.
            </p>
            <div className="rounded-xl border border-dashed border-border bg-bg px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted dark:text-slate-400">
                Example events
              </p>
              <ul className="mt-2 space-y-1">
                <li>• audit.completed</li>
                <li>• campaign.launched</li>
                <li>• lead.imported</li>
              </ul>
            </div>
          </div>
          <Toggle
            checked
            label="Retry failed deliveries automatically"
            description="Three attempts with exponential backoff."
          />
          <Toggle
            checked={false}
            label="Send payload samples via email"
            description="Useful for QA teams verifying mapping."
          />
          <Button variant="ghost" size="sm">
            Manage webhooks
          </Button>
        </aside>
      </section>

      <Modal
        open={Boolean(connectModal)}
        onClose={() => setConnectModal(null)}
        title={connectModal ? `Configure ${connectModal}` : ""}
        description="Provide API credentials and optional scopes. Credentials are encrypted at rest and masked in logs."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConnectModal(null)}>
              Cancel
            </Button>
            <Button variant="primary">Save integration</Button>
          </>
        }
      >
        <div className="space-y-4">
          <TextInput label="API key" placeholder="sk-..." />
          <TextInput label="Secret" placeholder="****" type="password" />
          <label className="flex items-start gap-3 rounded-xl border border-border bg-bg px-4 py-3 text-sm text-muted dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <input type="checkbox" defaultChecked />
            Restrict access to automation jobs only
          </label>
          <label className="flex items-start gap-3 rounded-xl border border-border bg-bg px-4 py-3 text-sm text-muted dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <input type="checkbox" />
            Notify security team when credential rotates
          </label>
        </div>
      </Modal>
    </AppShell>
  );
};

export default OrgIntegrations;


