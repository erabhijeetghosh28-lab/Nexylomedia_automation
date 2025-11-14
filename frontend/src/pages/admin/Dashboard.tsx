import { useMemo } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import SuperAdminShell from "../../layouts/SuperAdminShell";
import Card from "../../components/ui/Card";
import { useAuth } from "../../contexts/AuthContext";
import { useQuery } from "../../hooks/useQuery";
import { useApi } from "../../hooks/useApi";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";

const AdminDashboard = () => {
  const { auth } = useAuth();
  const api = useApi();
  const navigate = useNavigate();

  const {
    data,
    loading,
    error,
    refetch,
    filter,
    setFilter,
  } = useQuery(() => api.listTenants(), {
    search: "",
    status: "all",
  });

  const tenants = data?.tenants ?? [];

  const metrics = useMemo(() => {
    if (tenants.length === 0) {
      return {
        total: 0,
        active: 0,
        suspended: 0,
        projects: 0,
        domains: 0,
        mrr: 0,
      };
    }
    let active = 0;
    let suspended = 0;
    let projects = 0;
    let domains = 0;
    let mrr = 0;
    tenants.forEach((tenant) => {
      if (tenant.quota.billingStatus === "active") active += 1;
      if (tenant.quota.billingStatus === "suspended") suspended += 1;
      projects += tenant.usage.projectCount;
      domains += tenant.usage.domainCount;
      if (tenant.plan) {
        mrr += Number(tenant.plan.monthlyPrice ?? 0);
      }
    });
    return {
      total: tenants.length,
      active,
      suspended,
      projects,
      domains,
      mrr,
    };
  }, [tenants]);

  const filteredTenants = useMemo(() => {
    const search = (filter.search ?? "").toLowerCase();
    return tenants.filter((tenant) => {
      const matchesSearch =
        tenant.name.toLowerCase().includes(search) ||
        tenant.slug.toLowerCase().includes(search);
      const matchesStatus =
        !filter.status ||
        filter.status === "all" ||
        tenant.quota.billingStatus === filter.status;
      return matchesSearch && matchesStatus;
    });
  }, [tenants, filter]);

  return (
    <SuperAdminShell
      title="Platform control panel"
      description="Monitor tenant usage, manage quotas and billing plans, and control feature availability."
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="rounded-2xl border border-border bg-bg px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="font-semibold text-slate-900 dark:text-white">
              Signed in as
            </p>
            <p className="mt-1 text-xs uppercase tracking-wide text-muted dark:text-slate-400">
              {auth?.user.email} · Super Admin
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Card title="Total tenants">
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {metrics.total}
            </p>
            <p className="mt-2 text-xs uppercase tracking-wide text-muted dark:text-slate-400">
              {metrics.active} active · {metrics.suspended} suspended
            </p>
          </Card>
          <Card title="Projects under management">
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {metrics.projects}
            </p>
            <p className="mt-2 text-xs uppercase tracking-wide text-muted dark:text-slate-400">
              Across {metrics.total} tenants
            </p>
          </Card>
          <Card title="Domains in automation">
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {metrics.domains}
            </p>
            <p className="mt-2 text-xs uppercase tracking-wide text-muted dark:text-slate-400">
              Real-time verification scope
            </p>
          </Card>
          <Card title="Monthly recurring revenue">
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              ${metrics.mrr.toFixed(2)}
            </p>
            <p className="mt-2 text-xs uppercase tracking-wide text-muted dark:text-slate-400">
              Based on active plan pricing
            </p>
          </Card>
          <Card title="Trial tenants expiring">
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {
                tenants.filter(
                  (tenant) =>
                    tenant.quota.billingStatus === "trial" &&
                    tenant.quota.trialEndsAt &&
                    dayjs(tenant.quota.trialEndsAt).diff(dayjs(), "day") <= 7,
                ).length
              }
            </p>
            <p className="mt-2 text-xs uppercase tracking-wide text-muted dark:text-slate-400">
              Trials ending in the next 7 days
            </p>
          </Card>
          <Card title="Support queue">
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              3
            </p>
            <p className="mt-2 text-xs uppercase tracking-wide text-muted dark:text-slate-400">
              Pending billing/usage requests
            </p>
          </Card>
        </div>

        <Card
          title="Tenant directory"
          subtitle="Search, filter, and dive into tenant quotas, usage, and billing status."
          action={
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Refresh
              </Button>
              <Button size="sm" onClick={() => navigate("/admin/tenants")}>
                Provision tenant
              </Button>
            </div>
          }
        >
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-3">
              <TextInput
                label="Search"
                value={filter.search ?? ""}
                onChange={(event) =>
                  setFilter((prev) => ({ ...prev, search: event.target.value }))
                }
                placeholder="Search tenant name or slug"
              />
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                <span>Billing status</span>
                <select
                  className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-slate-800 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  value={filter.status ?? "all"}
                  onChange={(event) =>
                    setFilter((prev) => ({
                      ...prev,
                      status: event.target.value,
                    }))
                  }
                >
                  <option value="all">All statuses</option>
                  <option value="active">Active</option>
                  <option value="trial">Trial</option>
                  <option value="past_due">Past due</option>
                  <option value="suspended">Suspended</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </label>
            </div>

            {loading ? (
              <p className="text-sm text-muted dark:text-slate-400">
                Loading tenants…
              </p>
            ) : error ? (
              <div className="rounded-2xl border border-danger/40 bg-danger/5 px-4 py-3 text-danger">
                {error.message}
              </div>
            ) : filteredTenants.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border px-6 py-10 text-center dark:border-slate-800">
                <p className="font-semibold text-slate-900 dark:text-white">
                  No tenants found
                </p>
                <p className="mt-2 text-sm text-muted dark:text-slate-400">
                  Adjust your filters or provision a new tenant.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-border dark:border-slate-800">
                <table className="min-w-full divide-y divide-border text-sm dark:divide-slate-800">
                  <thead className="bg-bg-subtle dark:bg-slate-900/60">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-muted uppercase tracking-wide dark:text-slate-400">
                        Tenant
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-muted uppercase tracking-wide dark:text-slate-400">
                        Plan
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-muted uppercase tracking-wide dark:text-slate-400">
                        Projects
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-muted uppercase tracking-wide dark:text-slate-400">
                        Domains
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-muted uppercase tracking-wide dark:text-slate-400">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-muted uppercase tracking-wide dark:text-slate-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border dark:divide-slate-800">
                    {filteredTenants.map((tenant) => (
                      <tr key={tenant.id} className="hover:bg-primary/5 dark:hover:bg-primary/10">
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {tenant.name}
                            </span>
                            <span className="text-xs uppercase tracking-wide text-muted dark:text-slate-400">
                              {tenant.slug}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {tenant.plan?.name ?? "Custom"}
                            </span>
                            <span className="text-xs text-muted dark:text-slate-400">
                              ${tenant.plan?.monthlyPrice.toFixed(2) ?? "0.00"} / mo
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 font-semibold">
                          {tenant.usage.projectCount}
                          {tenant.quota.maxProjects
                            ? ` / ${tenant.quota.maxProjects}`
                            : ""}
                        </td>
                        <td className="px-4 py-4 font-semibold">
                          {tenant.usage.domainCount}
                          {tenant.quota.maxDomains
                            ? ` / ${tenant.quota.maxDomains}`
                            : ""}
                        </td>
                        <td className="px-4 py-4">
                          <span className="rounded-full border border-border bg-bg px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                            {tenant.quota.billingStatus}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/admin/tenants/${tenant.id}`)}
                            >
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/admin/tenants/${tenant.id}`)}
                            >
                              Edit
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      </div>
    </SuperAdminShell>
  );
};

export default AdminDashboard;


