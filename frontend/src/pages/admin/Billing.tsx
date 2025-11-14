import SuperAdminShell from "../../layouts/SuperAdminShell";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const AdminBillingPage = () => {
  return (
    <SuperAdminShell
      title="Billing intelligence"
      description="High-level metrics and manual adjustments for recurring billing."
      breadcrumbs={[
        { label: "Super Admin", href: "/admin" },
        { label: "Billing" },
      ]}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Monthly recurring revenue (MRR)">
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            $12,450
          </p>
          <p className="mt-2 text-xs uppercase tracking-wide text-muted dark:text-slate-400">
            +8% vs previous month
          </p>
        </Card>
        <Card title="Annual recurring revenue (ARR)">
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            $149,400
          </p>
          <p className="mt-2 text-xs uppercase tracking-wide text-muted dark:text-slate-400">
            Projected based on active plans
          </p>
        </Card>
        <Card title="Past due invoices">
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            $1,230
          </p>
          <p className="mt-2 text-xs uppercase tracking-wide text-muted dark:text-slate-400">
            4 tenants require follow-up
          </p>
        </Card>
      </div>

      <Card
        title="Billing tasks"
        subtitle="Quick actions to maintain healthy cash flow."
      >
        <div className="flex flex-col gap-3 md:flex-row">
          <Button variant="outline">Export invoices</Button>
          <Button variant="outline">Sync payment provider</Button>
          <Button variant="outline">Send past-due notices</Button>
        </div>
      </Card>

      <Card
        title="Upcoming enhancements"
        subtitle="Stripe integration, payment history, revenue forecasting, and churn analytics."
      >
        <p className="text-sm text-muted dark:text-slate-400">
          The backend now persists plan and quota information so we can wire up
          the billing provider of your choice. Future iterations will surface
          invoice-level data, payment events, and usage-based billing metrics.
        </p>
      </Card>
    </SuperAdminShell>
  );
};

export default AdminBillingPage;



