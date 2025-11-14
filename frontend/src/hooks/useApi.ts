import { useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../lib/api";

export const useApi = () => {
  const { auth } = useAuth();
  const token = auth?.token ?? "";

  return useMemo(() => {
    const ensureToken = () => {
      if (!token) {
        throw new Error("Missing authentication token. Please log in again.");
      }
      return token;
    };

    return {
      token,
      listProjects: () => api.listProjects(ensureToken()),
      getProject: (projectId: string) =>
        api.getProject(ensureToken(), projectId),
      createProject: (payload: {
        name: string;
        description?: string;
        status?: "active" | "paused" | "archived";
      }) => api.createProject(ensureToken(), payload),
      deleteProject: (projectId: string) =>
        api.deleteProject(ensureToken(), projectId),
      submitDomain: (
        projectId: string,
        payload: { host: string; notes?: string },
      ) => api.submitDomain(ensureToken(), projectId, payload),
      reviewDomain: (
        projectId: string,
        domainId: string,
        payload: {
          status: "approved" | "rejected" | "suspended";
          notes?: string;
          setPrimary?: boolean;
        },
      ) => api.reviewDomain(ensureToken(), projectId, domainId, payload),
      listTenants: () => api.listTenants(ensureToken()),
      getTenant: (tenantId: string) => api.getTenant(ensureToken(), tenantId),
      createTenant: (
        payload: Parameters<typeof api.createTenant>[1],
      ) => api.createTenant(ensureToken(), payload),
      updateTenantQuota: (
        tenantId: string,
        payload: Parameters<typeof api.updateTenantQuota>[2],
      ) => api.updateTenantQuota(ensureToken(), tenantId, payload),
      createPlan: (
        payload: Parameters<typeof api.createPlan>[1],
      ) => api.createPlan(ensureToken(), payload),
      updateTenantOrgAdmin: (
        tenantId: string,
        payload: Parameters<typeof api.updateTenantOrgAdmin>[2],
      ) => api.updateTenantOrgAdmin(ensureToken(), tenantId, payload),
      updateTenantApiKeys: (
        tenantId: string,
        payload: Parameters<typeof api.updateTenantApiKeys>[2],
      ) => api.updateTenantApiKeys(ensureToken(), tenantId, payload),
      // SEO Autopilot
      createAudit: (
        projectId: string,
        payload: Parameters<typeof api.createAudit>[2],
      ) => api.createAudit(ensureToken(), projectId, payload),
      listAudits: (
        projectId: string,
        filters?: Parameters<typeof api.listAudits>[2],
      ) => api.listAudits(ensureToken(), projectId, filters),
      getAudit: (projectId: string, auditId: string) =>
        api.getAudit(ensureToken(), projectId, auditId),
      runAudit: (projectId: string, auditId: string) =>
        api.runAudit(ensureToken(), projectId, auditId),
      listIssues: (
        projectId: string,
        auditId: string,
        filters?: Parameters<typeof api.listIssues>[3],
      ) => api.listIssues(ensureToken(), projectId, auditId, filters),
      getIssue: (projectId: string, auditId: string, issueId: string) =>
        api.getIssue(ensureToken(), projectId, auditId, issueId),
      updateIssueStatus: (
        projectId: string,
        auditId: string,
        issueId: string,
        status: Parameters<typeof api.updateIssueStatus>[4],
      ) =>
        api.updateIssueStatus(ensureToken(), projectId, auditId, issueId, status),
      createFix: (
        projectId: string,
        auditId: string,
        issueId: string,
        payload: Parameters<typeof api.createFix>[4],
      ) =>
        api.createFix(ensureToken(), projectId, auditId, issueId, payload),
      generateAiFix: (
        projectId: string,
        auditId: string,
        issueId: string,
        provider?: "gpt" | "gemini" | "groq",
      ) =>
        api.generateAiFix(ensureToken(), projectId, auditId, issueId, provider),
      // User Management
      listUsers: () => api.listUsers(ensureToken()),
      createUser: (
        payload: Parameters<typeof api.createUser>[1],
      ) => api.createUser(ensureToken(), payload),
      updateUserRole: (
        userId: string,
        payload: Parameters<typeof api.updateUserRole>[2],
      ) => api.updateUserRole(ensureToken(), userId, payload),
      updateUserToolAccess: (
        userId: string,
        payload: Parameters<typeof api.updateUserToolAccess>[2],
      ) => api.updateUserToolAccess(ensureToken(), userId, payload),
      removeUser: (userId: string) => api.removeUser(ensureToken(), userId),
      getRoleDefinitions: () => api.getRoleDefinitions(ensureToken()),
      getAvailableTools: () => api.getAvailableTools(ensureToken()),
    };
  }, [token]);
};


