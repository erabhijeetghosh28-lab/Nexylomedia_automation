export type TenantRole = "super_admin" | "org_admin" | "member";

export type TeamUser = {
  id: string;
  email: string;
  displayName: string | null;
  role: TenantRole;
  toolAccess?: Record<string, boolean> | null;
  createdAt: string;
  updatedAt: string;
};

export type RoleDefinition = {
  name: string;
  description: string;
  permissions: string[];
  defaultToolAccess: string[];
};

export type Tool = {
  id: string;
  name: string;
  description: string;
  defaultForRoles: TenantRole[];
};

export type User = {
  id: string;
  email: string;
  displayName?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  token: string;
  user: User;
  tenantId?: string;
  role?: TenantRole;
};

export type Project = {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  status: "active" | "paused" | "archived";
  description: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    email: string;
    displayName: string | null;
  } | null;
  domains: ProjectDomain[];
};

export type ProjectDomainStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "suspended";

export type ProjectDomain = {
  id: string;
  projectId: string;
  host: string;
  status: ProjectDomainStatus;
  isPrimary: boolean;
  verificationToken: string | null;
  submittedBy: {
    id: string;
    email: string;
    displayName: string | null;
  } | null;
  approvedBy: {
    id: string;
    email: string;
    displayName: string | null;
  } | null;
  approvedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TenantQuotaUpdate = {
  planId?: string | null;
  maxProjects?: number | null;
  maxDomains?: number | null;
  maxMembers?: number | null;
  maxOrgAdmins?: number | null;
  maxAutomationsPerMonth?: number | null;
  featureFlags?: Record<string, boolean> | null;
  billingStatus?: string;
  trialEndsAt?: string | null;
  currentPeriodEndsAt?: string | null;
  notes?: string | null;
  apiKeys?: Record<string, string> | null;
};

export type TenantSummary = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  plan: {
    id: string;
    code: string;
    name: string;
    monthlyPrice: number;
    annualPrice: number;
    currency: string;
  } | null;
  quota: {
    billingStatus: string;
    maxProjects: number | null;
    maxDomains: number | null;
    maxMembers: number | null;
    maxOrgAdmins: number | null;
    maxAutomationsPerMonth: number | null;
    trialEndsAt: string | null;
    currentPeriodEndsAt: string | null;
    apiKeys?: Record<string, string> | null;
  };
  usage: {
    projectCount: number;
    domainCount: number;
    memberCount: number;
    orgAdminCount: number;
    automationRunsThisMonth: number;
    lastCalculatedAt: string | null;
  };
  orgAdmin?: {
    id: string;
    email: string;
  };
};

export type SeoAuditType = "pagespeed" | "seo" | "lighthouse";
export type SeoAuditStatus =
  | "pending"
  | "queued"
  | "running"
  | "completed"
  | "failed";
export type SeoAuditTrigger = "manual" | "scheduled" | "auto_regression";

export type SeoAudit = {
  id: string;
  projectId: string;
  pageId?: string | null;
  type: SeoAuditType;
  status: SeoAuditStatus;
  trigger: SeoAuditTrigger;
  runner: string;
  score?: number | null;
  summary?: string | null;
  error?: string | null;
  rawResult?: Record<string, unknown> | null;
  jobId?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  issues?: SeoIssue[];
};

export type SeoIssueSeverity = "info" | "low" | "medium" | "high" | "critical";
export type SeoIssueCategory =
  | "performance"
  | "accessibility"
  | "seo"
  | "best_practices";
export type SeoIssueStatus = "open" | "in_progress" | "resolved" | "ignored";

export type SeoIssue = {
  id: string;
  auditId: string;
  code: string;
  severity: SeoIssueSeverity;
  category: SeoIssueCategory;
  description: string;
  metricValue?: number | null;
  threshold?: number | null;
  recommendation?: string | null;
  status: SeoIssueStatus;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  fixes?: SeoFix[];
};

export type SeoFixProvider = "gpt" | "gemini" | "groq" | "mock" | "manual";

export type SeoFix = {
  id: string;
  issueId: string;
  provider: SeoFixProvider;
  content: Record<string, unknown>;
  createdById?: string | null;
  createdAt: string;
  updatedAt: string;
};

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, "") ||
  "http://localhost:4000/api";

class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

const toJson = async (response: Response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

type RequestOptions = {
  token?: string;
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

const request = async <T>(
  path: string,
  { token, method = "GET", body, headers = {} }: RequestOptions = {},
): Promise<T> => {
  const url = `${API_BASE}${path}`;
  
  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorPayload = await toJson(response);
      const message =
        (errorPayload as { error?: { message?: string } })?.error?.message ??
        response.statusText ??
        "Request failed";
      throw new ApiError(response.status, message, errorPayload);
    }

    return (await toJson(response)) as T;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError(408, "Request timeout. Please check if the server is running.");
    }
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new ApiError(
        0,
        "Network error. Please check if the backend server is running on " + API_BASE,
      );
    }
    throw error;
  }
};

export const api = {
  signup: (payload: {
    email: string;
    password: string;
    tenantName: string;
  }) =>
    request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: payload,
    }),
  login: (payload: { email: string; password: string }) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: payload,
    }),
  listProjects: (token: string) =>
    request<{ projects: Project[] }>("/projects", { token }),
  getProject: (token: string, projectId: string) =>
    request<{ project: Project }>(`/projects/${projectId}`, {
      token,
    }),
  createProject: (
    token: string,
    payload: { name: string; description?: string; status?: Project["status"] },
  ) =>
    request<{ project: Project }>("/projects", {
      method: "POST",
      token,
      body: payload,
    }),
  deleteProject: (token: string, projectId: string) =>
    request<void>(`/projects/${projectId}`, {
      method: "DELETE",
      token,
    }),
  submitDomain: (
    token: string,
    projectId: string,
    payload: { host: string; notes?: string },
  ) =>
    request<{ domain: ProjectDomain }>(`/projects/${projectId}/domains`, {
      method: "POST",
      token,
      body: payload,
    }),
  reviewDomain: (
    token: string,
    projectId: string,
    domainId: string,
    payload: {
      status: Extract<ProjectDomainStatus, "approved" | "rejected" | "suspended">;
      notes?: string;
      setPrimary?: boolean;
    },
  ) =>
    request<{ domain: ProjectDomain }>(
      `/projects/${projectId}/domains/${domainId}`,
      {
        method: "PATCH",
        token,
        body: payload,
      },
    ),
  listTenants: (token: string) =>
    request<{ tenants: TenantSummary[] }>("/admin/tenants", { token }),
  getTenant: (token: string, tenantId: string) =>
    request<{ tenant: TenantSummary }>(`/admin/tenants/${tenantId}`, {
      token,
    }),
  updateTenantQuota: (
    token: string,
    tenantId: string,
    payload: TenantQuotaUpdate,
  ) =>
    request<{ tenant: TenantSummary }>(
      `/admin/tenants/${tenantId}/quota`,
      {
        method: "PATCH",
        token,
        body: payload,
      },
    ),
  createTenant: (
    token: string,
    payload: {
      tenantName: string;
      orgAdminEmail: string;
      orgAdminPassword: string;
      planId?: string | null;
      initialQuota?: {
        maxProjects?: number | null;
        maxDomains?: number | null;
        maxMembers?: number | null;
        maxOrgAdmins?: number | null;
        maxAutomationsPerMonth?: number | null;
      };
    },
  ) =>
    request<{ tenant: TenantSummary }>("/admin/tenants", {
      method: "POST",
      token,
      body: payload,
    }),
  createPlan: (
    token: string,
    payload: {
      code: string;
      name: string;
      description?: string;
      monthlyPrice?: number;
      annualPrice?: number;
      currency?: string;
    },
  ) =>
    request<{ plan: unknown }>("/admin/plans", {
      method: "POST",
      token,
      body: payload,
    }),
  updateTenantOrgAdmin: (
    token: string,
    tenantId: string,
    payload: {
      email?: string;
      password?: string;
    },
  ) =>
    request<{ tenant: TenantSummary }>(
      `/admin/tenants/${tenantId}/org-admin`,
      {
        method: "PATCH",
        token,
        body: payload,
      },
    ),
  updateTenantApiKeys: (
    token: string,
    tenantId: string,
    payload: {
      apiKeys?: Record<string, string> | null;
    },
  ) =>
    request<{ tenant: TenantSummary }>(
      `/admin/tenants/${tenantId}/api-keys`,
      {
        method: "PATCH",
        token,
        body: payload,
      },
    ),
  // SEO Autopilot
  createAudit: (
    token: string,
    projectId: string,
    payload: {
      type: SeoAuditType;
      pageId?: string | null;
      trigger?: SeoAuditTrigger;
    },
  ) =>
    request<{ audit: SeoAudit }>(`/seo/projects/${projectId}/audits`, {
      method: "POST",
      token,
      body: payload,
    }),
  listAudits: (
    token: string,
    projectId: string,
    filters?: {
      type?: SeoAuditType;
      status?: SeoAuditStatus;
      pageId?: string;
    },
  ) => {
    const params = new URLSearchParams();
    if (filters?.type) params.append("type", filters.type);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.pageId) params.append("pageId", filters.pageId);
    const query = params.toString();
    return request<{ audits: SeoAudit[] }>(
      `/seo/projects/${projectId}/audits${query ? `?${query}` : ""}`,
      { token },
    );
  },
  getAudit: (token: string, projectId: string, auditId: string) =>
    request<{ audit: SeoAudit }>(
      `/seo/projects/${projectId}/audits/${auditId}`,
      { token },
    ),
  runAudit: (token: string, projectId: string, auditId: string) =>
    request<{ audit: SeoAudit }>(
      `/seo/projects/${projectId}/audits/${auditId}/run`,
      { method: "POST", token },
    ),
  listIssues: (
    token: string,
    projectId: string,
    auditId: string,
    filters?: {
      status?: SeoIssueStatus;
      severity?: SeoIssueSeverity;
      category?: SeoIssueCategory;
    },
  ) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.severity) params.append("severity", filters.severity);
    if (filters?.category) params.append("category", filters.category);
    const query = params.toString();
    return request<{ issues: SeoIssue[] }>(
      `/seo/projects/${projectId}/audits/${auditId}/issues${query ? `?${query}` : ""}`,
      { token },
    );
  },
  getIssue: (
    token: string,
    projectId: string,
    auditId: string,
    issueId: string,
  ) =>
    request<{ issue: SeoIssue }>(
      `/seo/projects/${projectId}/audits/${auditId}/issues/${issueId}`,
      { token },
    ),
  updateIssueStatus: (
    token: string,
    projectId: string,
    auditId: string,
    issueId: string,
    status: SeoIssueStatus,
  ) =>
    request<{ issue: SeoIssue }>(
      `/seo/projects/${projectId}/audits/${auditId}/issues/${issueId}/status`,
      { method: "PATCH", token, body: { status } },
    ),
  createFix: (
    token: string,
    projectId: string,
    auditId: string,
    issueId: string,
    payload: {
      provider?: SeoFixProvider;
      content: Record<string, unknown>;
    },
  ) =>
    request<{ fix: SeoFix }>(
      `/seo/projects/${projectId}/audits/${auditId}/issues/${issueId}/fixes`,
      { method: "POST", token, body: payload },
    ),
  generateAiFix: (
    token: string,
    projectId: string,
    auditId: string,
    issueId: string,
    provider?: "gpt" | "gemini" | "groq",
  ) =>
    request<{ fix: SeoFix }>(
      `/seo/projects/${projectId}/audits/${auditId}/issues/${issueId}/fixes/generate`,
      { method: "POST", token, body: { provider: provider ?? "gpt" } },
    ),
  // User Management
  listUsers: (token: string) =>
    request<{ users: TeamUser[] }>("/users", { token }),
  createUser: (
    token: string,
    payload: {
      email: string;
      password: string;
      displayName?: string;
      role: TenantRole;
      toolAccess?: Record<string, boolean>;
    },
  ) =>
    request<{ user: TeamUser }>("/users", {
      method: "POST",
      token,
      body: payload,
    }),
  updateUserRole: (
    token: string,
    userId: string,
    payload: {
      role: TenantRole;
      toolAccess?: Record<string, boolean>;
    },
  ) =>
    request<{ user: TeamUser }>(`/users/${userId}/role`, {
      method: "PATCH",
      token,
      body: payload,
    }),
  updateUserToolAccess: (
    token: string,
    userId: string,
    payload: { toolAccess: Record<string, boolean> },
  ) =>
    request<{ user: TeamUser }>(`/users/${userId}/tool-access`, {
      method: "PATCH",
      token,
      body: payload,
    }),
  removeUser: (token: string, userId: string) =>
    request<void>(`/users/${userId}`, { method: "DELETE", token }),
  getRoleDefinitions: (token: string) =>
    request<{ roles: Record<TenantRole, RoleDefinition> }>("/users/roles", {
      token,
    }),
  getAvailableTools: (token: string) =>
    request<{ tools: Tool[] }>("/users/tools", { token }),
};

export { ApiError };

