import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { requireTenantContext } from "../middleware/tenantContext";
import { requireRole } from "../middleware/auth";
import {
  createIntegration,
  findIntegration,
  updateIntegration,
  deleteIntegration,
  testIntegration,
  getMaskedKey,
} from "../services/integrationService";
import { HttpError } from "../middleware/errorHandler";
import { integrationRepository } from "../repositories/integrationRepository";

export const integrationRouter = Router();

integrationRouter.use(requireAuth);

// GET /api/integrations - List integrations (org admin sees tenant, user sees their own)
integrationRouter.get("/", async (req, res, next) => {
  try {
    const repo = integrationRepository();
    const where: any = {};

    if (req.auth?.role === "org_admin" || req.auth?.role === "super_admin") {
      // Org admins see tenant integrations
      if (req.auth.tenantId) {
        where.tenant = { id: req.auth.tenantId };
      }
    } else {
      // Users see their own integrations
      if (req.auth?.userId) {
        where.user = { id: req.auth.userId };
      }
    }

    const integrations = await repo.find({
      where,
      relations: ["tenant", "user"],
      order: { createdAt: "DESC" },
    });

    // Return masked keys only
    res.json({
      integrations: integrations.map((integration) => ({
        id: integration.id,
        provider: integration.provider,
        keyMask: getMaskedKey(integration),
        scope: integration.scope,
        status: integration.status,
        configJson: integration.configJson,
        createdAt: integration.createdAt,
        updatedAt: integration.updatedAt,
      })),
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/integrations - Create integration (org admin creates tenant, user creates personal)
integrationRouter.post("/", async (req, res, next) => {
  try {
    if (!req.auth?.userId) {
      throw new HttpError(401, "Unauthorized");
    }

    const { provider, secret, scope, configJson } = req.body;

    if (!provider || !secret) {
      throw new HttpError(400, "Provider and secret are required");
    }

    // Determine scope
    let finalScope: "tenant" | "user" = scope || "user";
    if (req.auth.role === "org_admin" || req.auth.role === "super_admin") {
      // Org admins can create tenant-scoped integrations
      if (scope === "tenant" && req.auth.tenantId) {
        finalScope = "tenant";
      }
    } else {
      // Regular users can only create user-scoped
      finalScope = "user";
    }

    const integration = await createIntegration({
      ...(finalScope === "tenant" && req.auth.tenantId ? { tenantId: req.auth.tenantId } : {}),
      ...(finalScope === "user" && req.auth.userId ? { userId: req.auth.userId } : {}),
      provider,
      secret,
      scope: finalScope,
      configJson,
    });

    res.status(201).json({
      integration: {
        id: integration.id,
        provider: integration.provider,
        keyMask: getMaskedKey(integration),
        scope: integration.scope,
        status: integration.status,
        configJson: integration.configJson,
        createdAt: integration.createdAt,
        updatedAt: integration.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/integrations/:id/test - Test integration
integrationRouter.post("/:id/test", async (req, res, next) => {
  try {
    const result = await testIntegration(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/integrations/:id - Delete integration
integrationRouter.delete("/:id", async (req, res, next) => {
  try {
    // Verify ownership
    const repo = integrationRepository();
    const integration = await repo.findOne({
      where: { id: req.params.id },
      relations: ["tenant", "user"],
    });

    if (!integration) {
      throw new HttpError(404, "Integration not found");
    }

    // Check permissions
    if (integration.scope === "tenant") {
      if (
        req.auth?.role !== "org_admin" &&
        req.auth?.role !== "super_admin"
      ) {
        throw new HttpError(403, "Only org admins can delete tenant integrations");
      }
      if (integration.tenant?.id !== req.auth?.tenantId) {
        throw new HttpError(403, "Cannot delete integration from another tenant");
      }
    } else {
      if (integration.user?.id !== req.auth?.userId) {
        throw new HttpError(403, "Cannot delete another user's integration");
      }
    }

    await deleteIntegration(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// GET /api/me/integrations - User's personal integrations
integrationRouter.get("/me", async (req, res, next) => {
  try {
    if (!req.auth?.userId) {
      throw new HttpError(401, "Unauthorized");
    }

    const repo = integrationRepository();
    const integrations = await repo.find({
      where: {
        user: { id: req.auth.userId },
        scope: "user",
      },
      order: { createdAt: "DESC" },
    });

    res.json({
      integrations: integrations.map((integration) => ({
        id: integration.id,
        provider: integration.provider,
        keyMask: getMaskedKey(integration),
        scope: integration.scope,
        status: integration.status,
        configJson: integration.configJson,
        createdAt: integration.createdAt,
        updatedAt: integration.updatedAt,
      })),
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/me/integrations - Create user's personal integration
integrationRouter.post("/me", async (req, res, next) => {
  try {
    if (!req.auth?.userId) {
      throw new HttpError(401, "Unauthorized");
    }

    const { provider, secret, configJson } = req.body;

    if (!provider || !secret) {
      throw new HttpError(400, "Provider and secret are required");
    }

    const integration = await createIntegration({
      userId: req.auth.userId,
      provider,
      secret,
      scope: "user",
      configJson,
    });

    res.status(201).json({
      integration: {
        id: integration.id,
        provider: integration.provider,
        keyMask: getMaskedKey(integration),
        scope: integration.scope,
        status: integration.status,
        configJson: integration.configJson,
        createdAt: integration.createdAt,
        updatedAt: integration.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/me/integrations/:id - Delete user's personal integration
integrationRouter.delete("/me/:id", async (req, res, next) => {
  try {
    if (!req.auth?.userId) {
      throw new HttpError(401, "Unauthorized");
    }

    const repo = integrationRepository();
    const integration = await repo.findOne({
      where: { id: req.params.id },
      relations: ["user"],
    });

    if (!integration) {
      throw new HttpError(404, "Integration not found");
    }

    if (integration.user?.id !== req.auth.userId) {
      throw new HttpError(403, "Cannot delete another user's integration");
    }

    if (integration.scope !== "user") {
      throw new HttpError(403, "Cannot delete tenant integration via this endpoint");
    }

    await deleteIntegration(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

