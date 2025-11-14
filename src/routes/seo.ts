import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { requireTenantContext } from "../middleware/tenantContext";
import { tenantFeatureGuard } from "../middleware/featureGuard";
import { requireIntegration } from "../middleware/integrationGuard";
import {
  createAudit,
  listAudits,
  getAuditById,
  runAudit,
} from "../services/seoAuditService";
import {
  listIssues,
  getIssueById,
  updateIssueStatus,
  createFix,
  generateAiFix,
} from "../services/seoIssueService";
import { toOptionalString } from "../utils/parsers";
import { HttpError } from "../middleware/errorHandler";

export const seoRouter = Router();

seoRouter.use(requireAuth);
seoRouter.use(requireTenantContext);
seoRouter.use(tenantFeatureGuard("seo"));

// Audits
seoRouter.post("/projects/:projectId/audits", async (req, res, next) => {
  try {
    if (!req.auth?.tenantId) {
      throw new HttpError(400, "Tenant context missing");
    }
    const pageId = toOptionalString(req.body?.pageId);
    const audit = await createAudit({
      projectId: req.params.projectId,
      type: req.body?.type,
      pageId: pageId ?? null,
      trigger: req.body?.trigger,
    });
    res.status(201).json({ audit });
  } catch (error) {
    next(error);
  }
});

seoRouter.get("/projects/:projectId/audits", async (req, res, next) => {
  try {
    if (!req.auth?.tenantId) {
      throw new HttpError(400, "Tenant context missing");
    }
    const pageId = toOptionalString(req.query?.pageId);
    const audits = await listAudits(req.params.projectId, {
      type: req.query?.type as any,
      status: req.query?.status as any,
      pageId: pageId ?? null,
    });
    res.json({ audits });
  } catch (error) {
    next(error);
  }
});

seoRouter.get(
  "/projects/:projectId/audits/:auditId",
  async (req, res, next) => {
    try {
      if (!req.auth?.tenantId) {
        throw new HttpError(400, "Tenant context missing");
      }
      const audit = await getAuditById(
        req.params.auditId,
        req.params.projectId,
      );
      res.json({ audit });
    } catch (error) {
      next(error);
    }
  },
);

seoRouter.post(
  "/projects/:projectId/audits/:auditId/run",
  requireIntegration("pagespeed"),
  async (req, res, next) => {
    try {
      if (!req.auth?.tenantId) {
        throw new HttpError(400, "Tenant context missing");
      }
      // Pass integration secret to runAudit
      const apiKey = req.integrationSecret;
      if (!apiKey) {
        throw new HttpError(400, "Integration secret not available");
      }
      const audit = await runAudit(req.params.auditId, apiKey);
      res.json({ audit });
    } catch (error) {
      next(error);
    }
  },
);

// Issues
seoRouter.get(
  "/projects/:projectId/audits/:auditId/issues",
  async (req, res, next) => {
    try {
      if (!req.auth?.tenantId) {
        throw new HttpError(400, "Tenant context missing");
      }
      const severity = toOptionalString(req.query?.severity);
      const category = toOptionalString(req.query?.category);
      const issues = await listIssues(req.params.auditId, {
        status: req.query?.status as any,
        severity: severity ?? null,
        category: category ?? null,
      });
      res.json({ issues });
    } catch (error) {
      next(error);
    }
  },
);

seoRouter.get(
  "/projects/:projectId/audits/:auditId/issues/:issueId",
  async (req, res, next) => {
    try {
      if (!req.auth?.tenantId) {
        throw new HttpError(400, "Tenant context missing");
      }
      const issue = await getIssueById(
        req.params.issueId,
        req.params.auditId,
      );
      res.json({ issue });
    } catch (error) {
      next(error);
    }
  },
);

seoRouter.patch(
  "/projects/:projectId/audits/:auditId/issues/:issueId/status",
  async (req, res, next) => {
    try {
      if (!req.auth?.tenantId) {
        throw new HttpError(400, "Tenant context missing");
      }
      const issue = await updateIssueStatus(
        req.params.issueId,
        req.body?.status,
      );
      res.json({ issue });
    } catch (error) {
      next(error);
    }
  },
);

// Fixes
seoRouter.post(
  "/projects/:projectId/audits/:auditId/issues/:issueId/fixes",
  async (req, res, next) => {
    try {
      if (!req.auth?.tenantId) {
        throw new HttpError(400, "Tenant context missing");
      }
      const fix = await createFix({
        issueId: req.params.issueId,
        provider: req.body?.provider ?? "manual",
        content: req.body?.content ?? {},
        createdById: req.auth.userId,
      });
      res.status(201).json({ fix });
    } catch (error) {
      next(error);
    }
  },
);

seoRouter.post(
  "/projects/:projectId/audits/:auditId/issues/:issueId/fixes/generate",
  async (req, res, next) => {
    try {
      if (!req.auth?.tenantId) {
        throw new HttpError(400, "Tenant context missing");
      }
      const provider = (req.body?.provider ?? "gpt") as "gpt" | "gemini" | "groq";
      
      // Require integration for the specific provider
      const integrationGuard = requireIntegration(provider);
      await new Promise<void>((resolve, reject) => {
        integrationGuard(req, res, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      const fix = await generateAiFix(
        req.params.issueId,
        provider,
        req.integrationSecret,
      );
      res.status(201).json({ fix });
    } catch (error) {
      next(error);
    }
  },
);

