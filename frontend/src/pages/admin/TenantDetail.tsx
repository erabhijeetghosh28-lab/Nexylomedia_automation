import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import SuperAdminShell from "../../layouts/SuperAdminShell";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import Select from "../../components/ui/Select";
import { useApi } from "../../hooks/useApi";
import { useQuery } from "../../hooks/useQuery";

const statusOptions = [
  { label: "Trial", value: "trial" },
  { label: "Active", value: "active" },
  { label: "Past due", value: "past_due" },
  { label: "Suspended", value: "suspended" },
  { label: "Cancelled", value: "cancelled" },
];

const API_KEY_TYPES = [
  { value: "PAGESPEED_API_KEY", label: "PageSpeed Insights API Key" },
  { value: "GEMINI_API_KEY", label: "Google Gemini API Key" },
  { value: "GROQ_API_KEY", label: "Groq API Key" },
  { value: "OPENAI_API_KEY", label: "OpenAI API Key" },
  { value: "ANTHROPIC_API_KEY", label: "Anthropic (Claude) API Key" },
  { value: "CUSTOM", label: "Custom (Other)" },
];

const AdminTenantDetailPage = () => {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const api = useApi();
  const [updating, setUpdating] = useState(false);
  const [updatingOrgAdmin, setUpdatingOrgAdmin] = useState(false);
  const [updatingApiKeys, setUpdatingApiKeys] = useState(false);
  const [form, setForm] = useState({
    maxProjects: "",
    maxDomains: "",
    maxMembers: "",
    maxOrgAdmins: "",
    maxAutomationsPerMonth: "",
    billingStatus: "active",
    trialEndsAt: "",
    currentPeriodEndsAt: "",
  });
  const [orgAdminForm, setOrgAdminForm] = useState({
    email: "",
    password: "",
  });
  const [apiKeysForm, setApiKeysForm] = useState<Record<string, string>>({});
  const [apiKeyTypes, setApiKeyTypes] = useState<Record<string, string>>({}); // Track selected type for each key
  const [apiKeyErrors, setApiKeyErrors] = useState<Record<string, string>>({});
  const [apiKeyGeneralError, setApiKeyGeneralError] = useState<string | null>(
    null,
  );

  const { data, loading, error, refetch } = useQuery(() => api.getTenant(tenantId ?? ""));

  const tenant = data?.tenant;

  // Initialize forms when tenant loads
  useEffect(() => {
    if (tenant) {
      if (tenant.orgAdmin) {
        setOrgAdminForm({ email: tenant.orgAdmin.email, password: "" });
      }
      if (tenant.quota.apiKeys) {
        setApiKeysForm({ ...tenant.quota.apiKeys });
        // Initialize key types - try to match existing keys to known types
        const types: Record<string, string> = {};
        Object.keys(tenant.quota.apiKeys).forEach((key) => {
          const matchedType = API_KEY_TYPES.find((t) => t.value === key);
          types[key] = matchedType ? matchedType.value : "CUSTOM";
        });
        setApiKeyTypes(types);
        setApiKeyErrors({});
        setApiKeyGeneralError(null);
      } else {
        setApiKeysForm({});
        setApiKeyTypes({});
        setApiKeyErrors({});
        setApiKeyGeneralError(null);
      }
      setForm({
        maxProjects: tenant.quota.maxProjects?.toString() ?? "",
        maxDomains: tenant.quota.maxDomains?.toString() ?? "",
        maxMembers: tenant.quota.maxMembers?.toString() ?? "",
        maxOrgAdmins: tenant.quota.maxOrgAdmins?.toString() ?? "",
        maxAutomationsPerMonth: tenant.quota.maxAutomationsPerMonth?.toString() ?? "",
        billingStatus: tenant.quota.billingStatus,
        trialEndsAt: tenant.quota.trialEndsAt
          ? dayjs(tenant.quota.trialEndsAt).format("YYYY-MM-DDTHH:mm")
          : "",
        currentPeriodEndsAt: tenant.quota.currentPeriodEndsAt
          ? dayjs(tenant.quota.currentPeriodEndsAt).format("YYYY-MM-DDTHH:mm")
          : "",
      });
    }
  }, [tenant]);

  const usageProgress = useMemo(() => {
    if (!tenant) return null;

    const percent = (count: number, max?: number | null) => {
      if (!max || max <= 0) return 0;
      return Math.min(100, Math.round((count / max) * 100));
    };

    return {
      projects: percent(
        tenant.usage.projectCount,
        tenant.quota.maxProjects ?? undefined,
      ),
      domains: percent(
        tenant.usage.domainCount,
        tenant.quota.maxDomains ?? undefined,
      ),
      members: percent(
        tenant.usage.memberCount,
        tenant.quota.maxMembers ?? undefined,
      ),
      admins: percent(
        tenant.usage.orgAdminCount,
        tenant.quota.maxOrgAdmins ?? undefined,
      ),
    };
  }, [tenant]);

  const handleInput = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!tenantId) return;
    setUpdating(true);
    try {
      await api.updateTenantQuota(tenantId, {
        maxProjects: form.maxProjects ? Number(form.maxProjects) : null,
        maxDomains: form.maxDomains ? Number(form.maxDomains) : null,
        maxMembers: form.maxMembers ? Number(form.maxMembers) : null,
        maxOrgAdmins: form.maxOrgAdmins ? Number(form.maxOrgAdmins) : null,
        maxAutomationsPerMonth: form.maxAutomationsPerMonth
          ? Number(form.maxAutomationsPerMonth)
          : null,
        billingStatus: form.billingStatus,
        trialEndsAt: form.trialEndsAt || null,
        currentPeriodEndsAt: form.currentPeriodEndsAt || null,
      });
      await refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveOrgAdmin = async () => {
    if (!tenantId) return;
    setUpdatingOrgAdmin(true);
    try {
      const payload: { email?: string; password?: string } = {};
      if (orgAdminForm.email && orgAdminForm.email !== tenant?.orgAdmin?.email) {
        payload.email = orgAdminForm.email;
      }
      if (orgAdminForm.password) {
        payload.password = orgAdminForm.password;
      }
      if (Object.keys(payload).length > 0) {
        await api.updateTenantOrgAdmin(tenantId, payload);
        setOrgAdminForm((prev) => ({ ...prev, password: "" }));
        await refetch();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingOrgAdmin(false);
    }
  };

  const handleSaveApiKeys = async () => {
    if (!tenantId) return;
    const isValid = validateApiKeys();
    if (!isValid) return;
    setUpdatingApiKeys(true);
    try {
      await api.updateTenantApiKeys(tenantId, { apiKeys: apiKeysForm });
      await refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingApiKeys(false);
    }
  };

  const handleAddApiKey = () => {
    const newKeyId = `new_${Date.now()}`;
    setApiKeysForm((prev) => ({ ...prev, [newKeyId]: "" }));
    setApiKeyTypes((prev) => ({ ...prev, [newKeyId]: "PAGESPEED_API_KEY" }));
  };

  const handleRemoveApiKey = (key: string) => {
    setApiKeysForm((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
    setApiKeyTypes((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
    setApiKeyErrors((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const validateApiKeys = () => {
    const errors: Record<string, string> = {};
    const seen = new Set<string>();
    for (const [key, value] of Object.entries(apiKeysForm)) {
      const trimmedKey = key.trim();
      const trimmedValue = value.trim();

      if (!trimmedKey) {
        errors[key] = "Key name is required.";
        continue;
      }
      if (seen.has(trimmedKey)) {
        errors[key] = "Duplicate key name. Use unique names.";
        continue;
      }
      seen.add(trimmedKey);
      if (!trimmedValue) {
        errors[key] = "API key value is required.";
      }
    }

    setApiKeyErrors(errors);
    if (Object.keys(errors).length > 0) {
      setApiKeyGeneralError(
        "Please fix the highlighted API key errors before saving.",
      );
      return false;
    }

    setApiKeyGeneralError(null);
    return true;
  };

  if (!tenantId) {
    return (
      <SuperAdminShell title="Tenant not found">
        <Button variant="outline" onClick={() => navigate("/admin/tenants")}>
          Back to tenants
        </Button>
      </SuperAdminShell>
    );
  }

  return (
    <SuperAdminShell
      title={tenant ? tenant.name : "Loading tenant…"}
      description={tenant ? `Slug: ${tenant.slug}` : ""}
      breadcrumbs={[
        { label: "Super Admin", href: "/admin" },
        { label: "Tenants", href: "/admin/tenants" },
        { label: tenant?.name ?? "Tenant" },
      ]}
    >
      <div className="flex flex-col gap-6">
        <Button variant="ghost" onClick={() => navigate("/admin/tenants")}>
          ← Back to tenants
        </Button>

        {loading ? (
          <Card>
            <p className="text-sm text-muted dark:text-slate-400">
              Loading tenant details…
            </p>
          </Card>
        ) : error ? (
          <div className="rounded-2xl border border-danger/40 bg-danger/5 px-4 py-3 text-danger">
            {error.message}
          </div>
        ) : tenant ? (
          <>
            <Card title="Usage overview">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    label: "Projects",
                    usage: tenant.usage.projectCount,
                    limit: tenant.quota.maxProjects,
                    progress: usageProgress?.projects ?? 0,
                  },
                  {
                    label: "Domains",
                    usage: tenant.usage.domainCount,
                    limit: tenant.quota.maxDomains,
                    progress: usageProgress?.domains ?? 0,
                  },
                  {
                    label: "Members",
                    usage: tenant.usage.memberCount,
                    limit: tenant.quota.maxMembers,
                    progress: usageProgress?.members ?? 0,
                  },
                  {
                    label: "Org admins",
                    usage: tenant.usage.orgAdminCount,
                    limit: tenant.quota.maxOrgAdmins,
                    progress: usageProgress?.admins ?? 0,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-border bg-bg px-4 py-3 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <p className="text-xs uppercase tracking-wide text-muted dark:text-slate-400">
                      {item.label}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">
                        {item.usage}
                      </p>
                      <p className="text-xs text-muted dark:text-slate-400">
                        {item.limit ? `of ${item.limit}` : "Unlimited"}
                      </p>
                    </div>
                    {item.limit ? (
                      <div className="mt-3 h-2 rounded-full bg-border">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </Card>

            <Card
              title="Quota & billing controls"
              subtitle="Adjust allowances and billing state for this tenant."
              action={
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Refresh
                </Button>
              }
            >
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <TextInput
                  label="Max projects"
                  value={form.maxProjects ?? ""}
                  onChange={(event) => handleInput("maxProjects", event.target.value)}
                  placeholder={
                    tenant.quota.maxProjects
                      ? tenant.quota.maxProjects.toString()
                      : "Unlimited"
                  }
                />
                <TextInput
                  label="Max domains"
                  value={form.maxDomains ?? ""}
                  onChange={(event) => handleInput("maxDomains", event.target.value)}
                  placeholder={
                    tenant.quota.maxDomains
                      ? tenant.quota.maxDomains.toString()
                      : "Unlimited"
                  }
                />
                <TextInput
                  label="Max members"
                  value={form.maxMembers ?? ""}
                  onChange={(event) => handleInput("maxMembers", event.target.value)}
                  placeholder={
                    tenant.quota.maxMembers
                      ? tenant.quota.maxMembers.toString()
                      : "Unlimited"
                  }
                />
                <TextInput
                  label="Max org admins"
                  value={form.maxOrgAdmins ?? ""}
                  onChange={(event) =>
                    handleInput("maxOrgAdmins", event.target.value)
                  }
                  placeholder={
                    tenant.quota.maxOrgAdmins
                      ? tenant.quota.maxOrgAdmins.toString()
                      : "Unlimited"
                  }
                />
                <TextInput
                  label="Max automations / month"
                  value={form.maxAutomationsPerMonth ?? ""}
                  onChange={(event) =>
                    handleInput("maxAutomationsPerMonth", event.target.value)
                  }
                  placeholder={
                    tenant.quota.maxAutomationsPerMonth
                      ? tenant.quota.maxAutomationsPerMonth.toString()
                      : "Unlimited"
                  }
                />
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <span>Billing status</span>
                  <select
                    className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-slate-800 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    value={form.billingStatus}
                    onChange={(event) =>
                      handleInput("billingStatus", event.target.value)
                    }
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <TextInput
                  label="Trial ends at"
                  type="datetime-local"
                  value={form.trialEndsAt}
                  onChange={(event) => handleInput("trialEndsAt", event.target.value)}
                  placeholder={
                    tenant.quota.trialEndsAt
                      ? dayjs(tenant.quota.trialEndsAt).format("YYYY-MM-DDTHH:mm")
                      : ""
                  }
                />
                <TextInput
                  label="Current period ends at"
                  type="datetime-local"
                  value={form.currentPeriodEndsAt}
                  onChange={(event) =>
                    handleInput("currentPeriodEndsAt", event.target.value)
                  }
                  placeholder={
                    tenant.quota.currentPeriodEndsAt
                      ? dayjs(tenant.quota.currentPeriodEndsAt).format(
                          "YYYY-MM-DDTHH:mm",
                        )
                      : ""
                  }
                />
              </div>
              <div className="mt-6 flex gap-3">
                <Button onClick={handleSave} loading={updating}>
                  Save changes
                </Button>
                <Button variant="ghost" onClick={() => refetch()}>
                  Reset
                </Button>
              </div>
            </Card>

            <Card
              title="Org Admin Details"
              subtitle="Update the organization admin email and password for this tenant."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <TextInput
                  label="Email"
                  type="email"
                  value={orgAdminForm.email}
                  onChange={(event) =>
                    setOrgAdminForm((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  placeholder={tenant?.orgAdmin?.email ?? "No org admin"}
                />
                <TextInput
                  label="New Password"
                  type="password"
                  value={orgAdminForm.password}
                  onChange={(event) =>
                    setOrgAdminForm((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                  placeholder="Leave empty to keep current password"
                />
              </div>
              <div className="mt-6 flex gap-3">
                <Button
                  onClick={handleSaveOrgAdmin}
                  loading={updatingOrgAdmin}
                  disabled={
                    !orgAdminForm.email ||
                    (orgAdminForm.email === tenant?.orgAdmin?.email &&
                      !orgAdminForm.password)
                  }
                >
                  Update org admin
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (tenant?.orgAdmin) {
                      setOrgAdminForm({
                        email: tenant.orgAdmin.email,
                        password: "",
                      });
                    }
                  }}
                >
                  Reset
                </Button>
              </div>
            </Card>

            <Card
              title="API Keys"
              subtitle="Manage API keys for this tenant (e.g., PageSpeed, Gemini, Groq)."
            >
              <div className="space-y-4">
                {Object.entries(apiKeysForm).length === 0 ? (
                  <p className="text-sm text-muted dark:text-slate-400">
                    No API keys configured. Click "Add API Key" to add one.
                  </p>
                ) : (
                  Object.entries(apiKeysForm).map(([key, value], index) => {
                    const selectedType = apiKeyTypes[key] || "CUSTOM";
                    const isCustom = selectedType === "CUSTOM";
                    const displayKey = isCustom ? key : selectedType;
                    
                    return (
                      <div key={index} className="flex gap-3">
                        <div className="flex-1">
                          <label className="mb-1 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                            Key Type
                          </label>
                          <Select
                            value={selectedType}
                            onChange={(event) => {
                              const newType = event.target.value;
                              setApiKeyTypes((prev) => ({ ...prev, [key]: newType }));
                              
                              if (newType !== "CUSTOM") {
                                // Update the key name to match the selected type
                                const newKeys = { ...apiKeysForm };
                                delete newKeys[key];
                                newKeys[newType] = value;
                                setApiKeysForm(newKeys);
                                
                                // Update types mapping
                                setApiKeyTypes((prev) => {
                                  const updated = { ...prev };
                                  delete updated[key];
                                  updated[newType] = newType;
                                  return updated;
                                });

                                setApiKeyErrors((prev) => {
                                  const updated = { ...prev };
                                  delete updated[key];
                                  return updated;
                                });
                              }
                            }}
                            className="w-full"
                          >
                            {API_KEY_TYPES.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </Select>
                        </div>
                        {isCustom && (
                          <TextInput
                            label="Custom Key Name"
                            value={key}
                            onChange={(event) => {
                              const newKeys = { ...apiKeysForm };
                              delete newKeys[key];
                              newKeys[event.target.value] = value;
                              setApiKeysForm(newKeys);
                              
                              // Update types mapping
                              setApiKeyTypes((prev) => {
                                const updated = { ...prev };
                                delete updated[key];
                                updated[event.target.value] = "CUSTOM";
                                return updated;
                              });

                              setApiKeyErrors((prev) => {
                                const updated = { ...prev };
                                delete updated[key];
                                return updated;
                              });
                            }}
                            placeholder="e.g., CUSTOM_API_KEY"
                            className="flex-1"
                          />
                        )}
                        <TextInput
                          label="API Key"
                          type="password"
                          value={value}
                          onChange={(event) => {
                            setApiKeysForm((prev) => ({
                              ...prev,
                              [key]: event.target.value,
                            }));
                            setApiKeyErrors((prev) => {
                              const updated = { ...prev };
                              delete updated[key];
                              return updated;
                            });
                          }}
                          placeholder="Enter API key"
                          className="flex-1"
                        />
                        {apiKeyErrors[key] && (
                          <p className="text-xs font-semibold text-danger">
                            {apiKeyErrors[key]}
                          </p>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveApiKey(key)}
                          className="mt-6"
                        >
                          Remove
                        </Button>
                      </div>
                    );
                  })
                )}
                <Button variant="outline" onClick={handleAddApiKey}>
                  + Add API Key
                </Button>
              </div>
              <div className="mt-6 flex gap-3">
                <Button
                  onClick={handleSaveApiKeys}
                  loading={updatingApiKeys}
                >
                  Save API keys
                </Button>
                {apiKeyGeneralError && (
                  <p className="text-sm font-semibold text-danger">{apiKeyGeneralError}</p>
                )}
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (tenant?.quota.apiKeys) {
                      setApiKeysForm({ ...tenant.quota.apiKeys });
                      // Reset key types
                      const types: Record<string, string> = {};
                      Object.keys(tenant.quota.apiKeys).forEach((key) => {
                        const matchedType = API_KEY_TYPES.find((t) => t.value === key);
                        types[key] = matchedType ? matchedType.value : "CUSTOM";
                      });
                      setApiKeyTypes(types);
                    } else {
                      setApiKeysForm({});
                      setApiKeyTypes({});
                    }
                  }}
                >
                  Reset
                </Button>
              </div>
            </Card>
          </>
        ) : null}
      </div>
    </SuperAdminShell>
  );
};

export default AdminTenantDetailPage;


