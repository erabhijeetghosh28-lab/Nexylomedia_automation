import { useState } from "react";
import SuperAdminShell from "../../layouts/SuperAdminShell";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import { useApi } from "../../hooks/useApi";
import { ApiError } from "../../lib/api";

const AdminPlansPage = () => {
  const api = useApi();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [monthlyPrice, setMonthlyPrice] = useState("");
  const [annualPrice, setAnnualPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreatePlan = async () => {
    if (!code || !name) {
      setError("Plan code and name are required");
      return;
    }
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      await api.createPlan({
        code,
        name,
        description: description || undefined,
        monthlyPrice: monthlyPrice ? Number(monthlyPrice) : undefined,
        annualPrice: annualPrice ? Number(annualPrice) : undefined,
        currency,
      });
      setMessage("Plan created successfully.");
      setCode("");
      setName("");
      setDescription("");
      setMonthlyPrice("");
      setAnnualPrice("");
      setCurrency("USD");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to create plan. Check console for details.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SuperAdminShell
      title="Billing plans"
      description="Define reusable plan templates with pricing. Tool quotas are set per-tenant when provisioning or editing."
      breadcrumbs={[
        { label: "Super Admin", href: "/admin" },
        { label: "Plans" },
      ]}
    >
      <Card
        title="Create plan"
        subtitle="Plans define pricing templates. Tool quotas (SEO audits, PageSpeed audits, AI fixes) are configured per-tenant in the tenant detail page."
      >
        <div className="flex flex-col gap-4">
          {error && (
            <div className="rounded-xl border border-danger/40 bg-danger/5 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput
              label="Plan code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="starter, growth, enterprise"
              required
            />
            <TextInput
              label="Plan name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Starter"
              required
            />
          </div>
          <TextInput
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Ideal for small marketing teams"
          />
          <div className="grid gap-4 md:grid-cols-3">
            <TextInput
              label="Monthly price"
              type="number"
              step="0.01"
              value={monthlyPrice}
              onChange={(event) => setMonthlyPrice(event.target.value)}
              placeholder="0.00"
            />
            <TextInput
              label="Annual price"
              type="number"
              step="0.01"
              value={annualPrice}
              onChange={(event) => setAnnualPrice(event.target.value)}
              placeholder="0.00"
            />
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              <span>Currency</span>
              <select
                className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-slate-800 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </label>
          </div>
          <div className="rounded-xl border border-border bg-bg-subtle px-4 py-3 dark:border-slate-800 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted dark:text-slate-400">
              Note
            </p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
              Tool-specific quotas (SEO audits, PageSpeed audits, AI fixes) are
              managed per-tenant. When creating a tenant or editing quotas, you
              can set limits for each automation tool separately.
            </p>
          </div>
          <Button
            onClick={handleCreatePlan}
            disabled={!code || !name}
            loading={loading}
          >
            Create plan
          </Button>
          {message && (
            <p className="text-sm text-success dark:text-success-light">
              {message}
            </p>
          )}
        </div>
      </Card>

      <Card
        title="Plan library"
        subtitle="Future enhancement: list existing plans with quotas, price points, and assigned tenants."
      >
        <p className="text-sm text-muted dark:text-slate-400">
          Plan management UI forthcoming. For now, use the form above to create
          new plans. Assign plans to tenants in the tenant detail page.
        </p>
      </Card>
    </SuperAdminShell>
  );
};

export default AdminPlansPage;
