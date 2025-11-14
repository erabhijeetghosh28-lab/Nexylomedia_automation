import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import { requireTenantContext } from "../middleware/tenantContext";
import {
  createProject,
  deleteProject,
  getProjectForTenant,
  listDomainsForProject,
  listProjectsForTenant,
  reviewProjectDomain,
  submitProjectDomain,
} from "../services/projectService";
import { HttpError } from "../middleware/errorHandler";
import { ProjectDomainStatus } from "../entities/ProjectDomain";
import type { ProjectStatus } from "../entities/Project";

export const projectRouter = Router();

projectRouter.use(requireAuth);
projectRouter.use(requireTenantContext);

projectRouter.get("/", async (req, res, next) => {
  try {
    if (!req.auth?.tenantId) {
      throw new HttpError(400, "Tenant context missing");
    }
    const projects = await listProjectsForTenant(req.auth.tenantId);
    res.json({ projects });
  } catch (error) {
    next(error);
  }
});

projectRouter.get("/:projectId", async (req, res, next) => {
  try {
    if (!req.auth?.tenantId) {
      throw new HttpError(400, "Tenant context missing");
    }
    const project = await getProjectForTenant(
      req.auth.tenantId,
      req.params.projectId,
    );
    res.json({ project });
  } catch (error) {
    next(error);
  }
});

projectRouter.post(
  "/",
  requireRole("org_admin", "super_admin"),
  async (req, res, next) => {
    try {
      if (!req.auth?.tenantId) {
        throw new HttpError(400, "Tenant context missing");
      }
      const name = toStringValue(req.body?.name);
      const description = toOptionalString(req.body?.description);
      const status = parseProjectStatus(req.body?.status);

      const projectInput: Parameters<typeof createProject>[0] = {
        tenantId: req.auth.tenantId,
        createdById: req.auth.userId,
        name,
      };

      if (description !== undefined) {
        projectInput.description = description;
      }
      if (status) {
        projectInput.status = status;
      }

      const project = await createProject(projectInput);
      res.status(201).json({ project });
    } catch (error) {
      next(error);
    }
  },
);

projectRouter.delete(
  "/:projectId",
  requireRole("org_admin", "super_admin"),
  async (req, res, next) => {
    try {
      const tenantId = req.auth?.tenantId;
      const projectId = req.params.projectId;
      if (!tenantId || !projectId) {
        throw new HttpError(400, "Tenant context or project ID missing");
      }
      await deleteProject(tenantId, projectId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

projectRouter.get("/:projectId/domains", async (req, res, next) => {
  try {
    if (!req.auth?.tenantId) {
      throw new HttpError(400, "Tenant context missing");
    }
    const { projectId } = req.params as { projectId: string };
    const domains = await listDomainsForProject(req.auth.tenantId, projectId);
    res.json({ domains });
  } catch (error) {
    next(error);
  }
});

projectRouter.post(
  "/:projectId/domains",
  requireRole("member", "org_admin", "super_admin"),
  async (req, res, next) => {
    try {
      if (!req.auth?.tenantId) {
        throw new HttpError(400, "Tenant context missing");
      }
      const { projectId } = req.params as { projectId: string };
      const host = toStringValue(req.body?.host);
      const notes = toOptionalString(req.body?.notes);

      const domain = await submitProjectDomain({
        tenantId: req.auth.tenantId,
        projectId,
        submittedById: req.auth.userId,
        host,
        ...(notes !== undefined ? { notes } : {}),
      });
      res.status(201).json({ domain });
    } catch (error) {
      next(error);
    }
  },
);

projectRouter.patch(
  "/:projectId/domains/:domainId",
  requireRole("org_admin", "super_admin"),
  async (req, res, next) => {
    try {
      if (!req.auth?.tenantId) {
        throw new HttpError(400, "Tenant context missing");
      }
      const { projectId, domainId } = req.params as {
        projectId: string;
        domainId: string;
      };
      const status = parseDomainStatus(req.body?.status);
      const setPrimary = parseBoolean(req.body?.setPrimary);
      const notes = toOptionalString(req.body?.notes);
      const domain = await reviewProjectDomain({
        tenantId: req.auth.tenantId,
        projectId,
        domainId,
        reviewerId: req.auth.userId,
        status,
        ...(notes !== undefined ? { notes } : {}),
        setPrimary,
      });
      res.json({ domain });
    } catch (error) {
      next(error);
    }
  },
);

const parseDomainStatus = (
  value: unknown,
): Extract<ProjectDomainStatus, "approved" | "rejected" | "suspended"> => {
  if (typeof value !== "string") {
    throw new HttpError(400, "Domain status is required");
  }
  const normalized = value.toLowerCase() as ProjectDomainStatus;
  const allowed = new Set(["approved", "rejected", "suspended"]);
  if (!allowed.has(normalized)) {
    throw new HttpError(400, "Invalid domain status");
  }
  return normalized as Extract<
    ProjectDomainStatus,
    "approved" | "rejected" | "suspended"
  >;
};

const parseBoolean = (value: unknown): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "y"].includes(normalized)) return true;
    if (["false", "0", "no", "n", ""].includes(normalized)) return false;
  }
  return false;
};

const toStringValue = (value: unknown): string => {
  if (typeof value === "string") {
    return value;
  }
  return "";
};

const toOptionalString = (value: unknown): string | undefined => {
  return typeof value === "string" ? value : undefined;
};

const parseProjectStatus = (
  value: unknown,
): ProjectStatus | undefined => {
  if (typeof value !== "string") return undefined;
  const normalized = value.trim().toLowerCase();
  if (["active", "paused", "archived"].includes(normalized)) {
    return normalized as ProjectStatus;
  }
  return undefined;
};


