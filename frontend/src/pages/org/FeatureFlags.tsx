import { useState } from "react";
import { FiEdit3, FiShield, FiToggleLeft, FiZap } from "react-icons/fi";
import AppShell from "../../layouts/AppShell";
import Card from "../../components/ui/Card";
import Toggle from "../../components/ui/Toggle";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { featureModules } from "../../data/org";

const FeatureFlags = () => {
  const [flags, setFlags] = useState(featureModules);

  const handleToggle = (key: string) => {
    setFlags((prev) =>
      prev.map((flag) =>
        flag.key === key ? { ...flag, enabled: !flag.enabled } : flag,
      ),
    );
  };

  return (
    <AppShell
      title="Feature Flags"
      description="Enable or disable product modules for Nexylomedia HQ. Changes apply instantly across the organization."
      breadcrumbs={[
        { label: "Org Admin", href: "#" },
        { label: "Feature Flags" },
      ]}
      rightAccessory={
        <Button variant="ghost" size="sm" icon={<FiEdit3 />}>
          Request new module
        </Button>
      }
    >
      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card
          title="Workspace modules"
          subtitle="Control access to major toolsets"
          action={
            <Badge variant="info" dot>
              Growth plan
            </Badge>
          }
        >
          <div className="space-y-3">
            {flags.map((flag) => (
              <Toggle
                key={flag.key}
                checked={flag.enabled}
                onChange={() => handleToggle(flag.key)}
                label={flag.name}
                description={flag.description}
              />
            ))}
          </div>
        </Card>

        <aside className="space-y-4">
          <Card
            title="Kill switch"
            subtitle="Emergency disablement for critical incidents"
            action={
              <Badge variant="danger" dot>
                Escalation
              </Badge>
            }
          >
            <p className="text-xs text-muted dark:text-slate-400">
              Turn off all automation triggers instantly. Use when downstream
              systems are degraded or compliance incidents detected.
            </p>
            <Button
              variant="danger"
              size="sm"
              className="mt-4 w-full"
              icon={<FiShield />}
            >
              Activate kill switch
            </Button>
          </Card>

          <Card title="Beta Programs" subtitle="Early access opt-ins">
            <div className="space-y-3 text-xs text-muted dark:text-slate-400">
              <label className="flex items-start gap-3 rounded-xl border border-border bg-bg px-4 py-3 text-left dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                <input type="checkbox" defaultChecked />
                <span>
                  AI-generated outreach templates
                  <span className="block text-xs">
                    Powered by Gemini & Groq. Rate limited per org.
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-3 rounded-xl border border-border bg-bg px-4 py-3 text-left dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                <input type="checkbox" />
                <span>
                  Multi-touch attribution dashboard
                  <span className="block text-xs">
                    Visualize customer journeys across campaigns.
                  </span>
                </span>
              </label>
            </div>
          </Card>

          <Card title="Automation safeguards">
            <div className="space-y-3 text-xs text-muted dark:text-slate-400">
              <div className="flex items-start gap-3 rounded-xl border border-dashed border-border bg-bg px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                <span className="mt-1 text-primary">
                  <FiZap />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Dry-run mode
                  </p>
                  <p>
                    Simulate n8n flows without committing changes. Useful for
                    QA and staging experiments.
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" icon={<FiToggleLeft />}>
                Toggle dry-run mode
              </Button>
            </div>
          </Card>
        </aside>
      </section>
    </AppShell>
  );
};

export default FeatureFlags;


