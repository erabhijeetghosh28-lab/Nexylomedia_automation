import { FiAlertTriangle, FiDownload } from "react-icons/fi";
import AppShell from "../../layouts/AppShell";
import Card from "../../components/ui/Card";
import ProgressBar from "../../components/ui/ProgressBar";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Sparkline from "../../components/ui/Sparkline";
import { quotaUsage } from "../../data/org";

const monthlyUsage = [
  { label: "Jan", value: 58 },
  { label: "Feb", value: 64 },
  { label: "Mar", value: 72 },
  { label: "Apr", value: 70 },
  { label: "May", value: 76 },
  { label: "Jun", value: 81 },
  { label: "Jul", value: 88 },
];

type OrgPageProps = {
  onNavigate?: (route: string) => void;
};

const UsageQuotas = ({ onNavigate }: OrgPageProps) => {
  return (
    <AppShell
      title="Usage & Quotas"
      description="Monitor consumption across API calls, automation runs, AI tokens, and seats. Configure alerts before limits are hit."
      breadcrumbs={[
        { label: "Org Admin", href: "#" },
        { label: "Usage & Quotas" },
      ]}
      activeNav="usage"
      rightAccessory={
        <Button variant="outline" size="sm" icon={<FiDownload />}>
          Export usage CSV
        </Button>
      }
      onNavigate={onNavigate}
    >
      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card
          title="Monthly usage trends"
          subtitle="Weighted across PageSpeed, AI tokens, and automations"
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted dark:text-slate-400">
              <Badge variant="primary" dot>
                PageSpeed
              </Badge>
              <Badge variant="success" dot>
                AI Tokens
              </Badge>
              <Badge variant="warning" dot>
                Automations
              </Badge>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-bg p-4 dark:border-slate-700 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted dark:text-slate-400">
                  Weighted usage index
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">
                  88
                </p>
                <p className="text-xs text-success">+12% vs previous month</p>
                <div className="mt-4">
                  <Sparkline
                    values={monthlyUsage.map((m) => m.value)}
                    variant="primary"
                  />
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-bg p-4 dark:border-slate-700 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted dark:text-slate-400">
                  Cost projection
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">
                  ₹42,300
                </p>
                <p className="text-xs text-warning">Forecasted by usage</p>
                <div className="mt-4">
                  <Sparkline
                    values={[32, 34, 36, 39, 41, 42, 43]}
                    variant="warning"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <aside className="space-y-4">
          <Card title="Alerts" subtitle="Keep usage on track">
            <div className="space-y-3 text-xs text-muted dark:text-slate-400">
              <div className="flex items-start gap-3 rounded-xl border border-dashed border-border bg-bg px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                <span className="mt-0.5 text-warning">
                  <FiAlertTriangle />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    90% PageSpeed threshold
                  </p>
                  <p>Notify Abhijeet + Ops Slack channel when limit nears.</p>
                </div>
              </div>
              <label className="flex items-start gap-3 rounded-xl border border-border bg-bg px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                <input type="checkbox" defaultChecked />
                <span>
                  Weekly usage digest
                  <span className="block text-xs">
                    Email summary every Monday 9 AM.
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-3 rounded-xl border border-border bg-bg px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                <input type="checkbox" />
                <span>
                  Slack alerts
                  <span className="block text-xs">
                    #automation-alerts channel
                  </span>
                </span>
              </label>
            </div>
          </Card>
        </aside>
      </section>

      <Card
        title="Quota consumption"
        subtitle="Real-time usage updated every 15 minutes"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quotaUsage.map((quota) => (
            <div
              key={quota.label}
              className="rounded-2xl border border-border bg-bg p-4 dark:border-slate-700 dark:bg-slate-900"
            >
              <ProgressBar
                label={quota.label}
                value={quota.value}
                max={quota.max}
                helper={quota.helper}
                color={quota.color}
              />
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
};

export default UsageQuotas;


