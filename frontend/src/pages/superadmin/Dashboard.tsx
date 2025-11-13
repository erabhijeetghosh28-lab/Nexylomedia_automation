import Card from "../../components/ui/Card";
import KpiCard from "../../components/ui/KpiCard";
import Sparkline from "../../components/ui/Sparkline";
import Timeline from "../../components/ui/Timeline";
import DataTable from "../../components/ui/DataTable";
import { platformMetrics, tenantSummaries } from "../../data/superAdmin";

const SuperAdminDashboard = () => {
  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {platformMetrics.kpis.map((kpi) => (
          <KpiCard
            key={kpi.label}
            title={kpi.label}
            description={kpi.delta}
            value={kpi.value}
            trend={kpi.trend === "down" ? "down" : "up"}
            sparkline={<Sparkline values={[5, 6, 7, 8, 9, 10]} variant="primary" />}
          />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card title="Platform health" subtitle="Monitors n8n, APIs, and adapters">
          <div className="grid gap-3">
            {platformMetrics.systemHealth.map((item) => (
              <div
                key={item.service}
                className="rounded-2xl border border-border bg-bg px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <span>{item.service}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      item.status === "healthy"
                        ? "bg-success/10 text-success"
                        : item.status === "warning"
                          ? "bg-warning/10 text-warning"
                          : "bg-danger/10 text-danger"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted dark:text-slate-400">{item.detail}</p>
                <p className="mt-1 text-xs text-muted dark:text-slate-500">
                  Checked {item.lastChecked}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Platform activity" subtitle="Latest super admin actions">
          <Timeline
            items={platformMetrics.activity.map((item, index) => ({
              id: `activity-${index}`,
              title: item.text,
              description: "",
              timestamp: item.time,
              status: index === 1 ? "warning" : "success",
            }))}
          />
        </Card>
      </section>

      <Card
        title="Tenant snapshot"
        subtitle="Top tenants by usage. Click a row to inspect details."
      >
        <DataTable
          columns={[
            { key: "name", header: "Tenant" },
            { key: "plan", header: "Plan" },
            {
              key: "users",
              header: "Users",
              align: "right",
            },
            {
              key: "apiCalls",
              header: "API Calls",
              align: "right",
            },
            {
              key: "aiTokens",
              header: "AI Tokens",
              align: "right",
            },
            {
              key: "mrr",
              header: "MRR",
              align: "right",
              render: (tenant) => `$${tenant.mrr}`,
            },
          ]}
          data={tenantSummaries}
        />
      </Card>
    </div>
  );
};

export default SuperAdminDashboard;


