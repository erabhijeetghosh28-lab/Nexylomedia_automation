import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import DataTable from "../../components/ui/DataTable";
import Sparkline from "../../components/ui/Sparkline";
import { tenantDetailMock } from "../../data/superAdmin";

const TenantDetailPage = () => {
  const tenant = tenantDetailMock;
  return (
    <div className="space-y-6">
      <Card
        title={tenant.name}
        subtitle={`Plan: ${tenant.plan.name} · Renewals every month`}
        action={
          <Badge variant="primary" dot>
            Active
          </Badge>
        }
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Plan</p>
            <p className="text-sm text-muted dark:text-slate-400">
              {tenant.plan.name} · ${tenant.plan.monthlyCost}/month
            </p>
            <p className="mt-1 text-xs text-muted dark:text-slate-500">
              Renewal date: {tenant.plan.renewalDate}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Contacts</p>
            <ul className="mt-2 space-y-1 text-sm text-muted dark:text-slate-400">
              {tenant.contacts.map((contact) => (
                <li key={contact.email}>
                  {contact.name} · {contact.role} · {contact.email}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <Card title="Usage trend" subtitle="API calls & AI tokens (last 6 weeks)">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted dark:text-slate-400">
              API Calls
            </p>
            <Sparkline values={tenant.usageTrend.apiCalls} variant="primary" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted dark:text-slate-400">
              AI Tokens
            </p>
            <Sparkline values={tenant.usageTrend.aiTokens} variant="success" />
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Integrations">
          <ul className="space-y-2 text-sm text-muted dark:text-slate-400">
            {tenant.integrations.map((integration) => (
              <li key={integration.name} className="flex items-center justify-between">
                <span>{integration.name}</span>
                <Badge variant={integration.status === "connected" ? "success" : "warning"} dot>
                  {integration.status}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Recent logs">
          <DataTable
            columns={[
              { key: "timestamp", header: "Time" },
              { key: "severity", header: "Severity" },
              { key: "message", header: "Message" },
            ]}
            data={tenant.recentLogs}
          />
        </Card>
      </div>
    </div>
  );
};

export default TenantDetailPage;


