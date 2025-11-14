import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SuperAdminShell from "../../layouts/SuperAdminShell";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import Modal from "../../components/ui/Modal";
import { useApi } from "../../hooks/useApi";
import { useQuery } from "../../hooks/useQuery";
import { ApiError } from "../../lib/api";

const AdminTenantsPage = () => {
  const api = useApi();
  const navigate = useNavigate();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [form, setForm] = useState({
    tenantName: "",
    orgAdminEmail: "",
    orgAdminPassword: "",
    maxProjects: "",
    maxDomains: "",
    maxMembers: "",
    maxOrgAdmins: "",
    maxAutomationsPerMonth: "",
  });

  const {
    data,
    loading,
    error,
    filter,
    setFilter,
    refetch,
  } = useQuery(() => api.listTenants(), {
    search: "",
    status: "all",
  });

  const tenants = data?.tenants ?? [];

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

  const handleCreateTenant = async () => {
    if (!form.tenantName || !form.orgAdminEmail || !form.orgAdminPassword) {
      setCreateError("Tenant name, email, and password are required");
      return;
    }
    setCreating(true);
    setCreateError(null);
    try {
      await api.createTenant({
        tenantName: form.tenantName,
        orgAdminEmail: form.orgAdminEmail,
        orgAdminPassword: form.orgAdminPassword,
        initialQuota: {
          maxProjects: form.maxProjects ? Number(form.maxProjects) : null,
          maxDomains: form.maxDomains ? Number(form.maxDomains) : null,
          maxMembers: form.maxMembers ? Number(form.maxMembers) : null,
          maxOrgAdmins: form.maxOrgAdmins ? Number(form.maxOrgAdmins) : null,
          maxAutomationsPerMonth: form.maxAutomationsPerMonth
            ? Number(form.maxAutomationsPerMonth)
            : null,
        },
      });
      setCreateModalOpen(false);
      setForm({
        tenantName: "",
        orgAdminEmail: "",
        orgAdminPassword: "",
        maxProjects: "",
        maxDomains: "",
        maxMembers: "",
        maxOrgAdmins: "",
        maxAutomationsPerMonth: "",
      });
      await refetch();
    } catch (err) {
      if (err instanceof ApiError) {
        setCreateError(err.message);
      } else {
        setCreateError("Failed to create tenant");
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <SuperAdminShell
      title="Tenant directory"
      description="Manage tenant lifecycle, quotas, feature availability, and invitations."
      breadcrumbs={[
        { label: "Super Admin", href: "/admin" },
        { label: "Tenants" },
      ]}
    >
      <Modal
        open={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setCreateError(null);
        }}
        title="Provision new tenant"
        description="Create a new organization workspace with an org admin user."
        footer={
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTenant} loading={creating}>
              Create tenant
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          {createError && (
            <div className="rounded-xl border border-danger/40 bg-danger/5 px-4 py-3 text-sm text-danger">
              {createError}
            </div>
          )}
          <TextInput
            label="Tenant name"
            value={form.tenantName}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, tenantName: event.target.value }))
            }
            placeholder="Acme Marketing"
            required
          />
          <TextInput
            label="Org admin email"
            type="email"
            value={form.orgAdminEmail}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, orgAdminEmail: event.target.value }))
            }
            placeholder="admin@acme.com"
            required
          />
          <TextInput
            label="Org admin password"
            type="password"
            value={form.orgAdminPassword}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                orgAdminPassword: event.target.value,
              }))
            }
            placeholder="Secure password"
            required
          />
          <div className="border-t border-border pt-4 dark:border-slate-800">
            <p className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
              Initial quotas (optional)
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput
                label="Max projects"
                type="number"
                value={form.maxProjects}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, maxProjects: event.target.value }))
                }
                placeholder="Leave empty for unlimited"
              />
              <TextInput
                label="Max domains"
                type="number"
                value={form.maxDomains}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, maxDomains: event.target.value }))
                }
                placeholder="Leave empty for unlimited"
              />
              <TextInput
                label="Max members"
                type="number"
                value={form.maxMembers}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, maxMembers: event.target.value }))
                }
                placeholder="Leave empty for unlimited"
              />
              <TextInput
                label="Max org admins"
                type="number"
                value={form.maxOrgAdmins}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, maxOrgAdmins: event.target.value }))
                }
                placeholder="Leave empty for unlimited"
              />
              <TextInput
                label="Max automations / month"
                type="number"
                value={form.maxAutomationsPerMonth}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    maxAutomationsPerMonth: event.target.value,
                  }))
                }
                placeholder="Leave empty for unlimited"
              />
            </div>
          </div>
        </div>
      </Modal>

      <Card
        title="Search & filter"
        subtitle="Quickly locate tenants by name, slug, or billing state."
        padded={false}
      >
        <div className="grid gap-4 px-6 py-6 md:grid-cols-3">
          <TextInput
            label="Search"
            value={filter.search ?? ""}
            onChange={(event) =>
              setFilter((prev) => ({ ...prev, search: event.target.value }))
            }
            placeholder="Acme, marketing, etc."
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
          <div className="flex items-end">
            <Button variant="outline" className="w-full" onClick={() => refetch()}>
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      <Card
        title="Tenants"
        subtitle="Overview of quotas, usage, and feature access."
        action={
          <Button size="sm" onClick={() => setCreateModalOpen(true)}>
            Provision tenant
          </Button>
        }
      >
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
              Adjust filters or create a new tenant.
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
                  <tr
                    key={tenant.id}
                    className="hover:bg-primary/5 dark:hover:bg-primary/10"
                  >
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
                          Edit quota
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </SuperAdminShell>
  );
};

export default AdminTenantsPage;
