"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.reviewProjectDomain = exports.submitProjectDomain = exports.createProject = exports.listDomainsForProject = exports.getProjectForTenant = exports.listProjectsForTenant = void 0;
const crypto_1 = require("crypto");
const data_source_1 = require("../config/data-source");
const ProjectDomain_1 = require("../entities/ProjectDomain");
const Tenant_1 = require("../entities/Tenant");
const User_1 = require("../entities/User");
const errorHandler_1 = require("../middleware/errorHandler");
const slugify_1 = require("../utils/slugify");
const projectRepository_1 = require("../repositories/projectRepository");
const projectDomainRepository_1 = require("../repositories/projectDomainRepository");
const quotaService_1 = require("./quotaService");
const tenantRepository = () => data_source_1.AppDataSource.getRepository(Tenant_1.Tenant);
const userRepository = () => data_source_1.AppDataSource.getRepository(User_1.User);
const toUserSummary = (user) => {
    if (!user)
        return null;
    return {
        id: user.id,
        email: user.email,
        displayName: user.displayName ?? null,
    };
};
const toProjectDomainResponse = (domain, projectIdOverride) => ({
    id: domain.id,
    projectId: projectIdOverride ?? domain.project?.id ?? "",
    host: domain.host,
    status: domain.status,
    isPrimary: domain.isPrimary,
    verificationToken: domain.verificationToken ?? null,
    submittedBy: toUserSummary(domain.submittedBy),
    approvedBy: toUserSummary(domain.approvedBy),
    approvedAt: domain.approvedAt ?? null,
    notes: domain.notes ?? null,
    createdAt: domain.createdAt,
    updatedAt: domain.updatedAt,
});
const toProjectResponse = (project) => ({
    id: project.id,
    tenantId: project.tenant.id,
    name: project.name,
    slug: project.slug,
    status: project.status,
    description: project.description ?? null,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    createdBy: toUserSummary(project.createdBy),
    domains: (project.domains ?? []).map((domain) => toProjectDomainResponse(domain, project.id)),
});
const listProjectsForTenant = async (tenantId) => {
    const projects = await (0, projectRepository_1.projectRepository)().find({
        where: { tenant: { id: tenantId } },
        relations: [
            "tenant",
            "createdBy",
            "domains",
            "domains.submittedBy",
            "domains.approvedBy",
        ],
        order: { createdAt: "DESC" },
    });
    projects.forEach((project) => {
        if (project.domains) {
            project.domains.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        }
    });
    return projects.map(toProjectResponse);
};
exports.listProjectsForTenant = listProjectsForTenant;
const getProjectForTenant = async (tenantId, projectId) => {
    const project = await loadProjectForTenant(tenantId, projectId);
    return toProjectResponse(project);
};
exports.getProjectForTenant = getProjectForTenant;
const listDomainsForProject = async (tenantId, projectId) => {
    const project = await loadProjectForTenant(tenantId, projectId);
    return project.domains.map((domain) => toProjectDomainResponse(domain, project.id));
};
exports.listDomainsForProject = listDomainsForProject;
const createProject = async (params) => {
    const name = params.name.trim();
    const tenant = await tenantRepository().findOne({
        where: { id: params.tenantId },
    });
    if (!tenant) {
        throw new errorHandler_1.HttpError(404, "Tenant not found");
    }
    const creator = await userRepository().findOne({
        where: { id: params.createdById },
    });
    if (!creator) {
        throw new errorHandler_1.HttpError(404, "User not found");
    }
    if (!name) {
        throw new errorHandler_1.HttpError(400, "Project name is required");
    }
    const repo = (0, projectRepository_1.projectRepository)();
    const slug = await generateProjectSlug(repo, tenant.id, name);
    await (0, quotaService_1.ensureCapacityOrThrow)(tenant.id, "project");
    const project = repo.create({
        tenant,
        createdBy: creator,
        name,
        description: params.description?.trim() ?? null,
        slug,
        status: params.status ?? "active",
    });
    const saved = await repo.save(project);
    await (0, quotaService_1.incrementUsage)(tenant.id, { projectCount: 1 });
    const reloaded = await loadProjectForTenant(tenant.id, saved.id);
    return toProjectResponse(reloaded);
};
exports.createProject = createProject;
const submitProjectDomain = async (params) => {
    const host = normalizeHost(params.host);
    if (!host) {
        throw new errorHandler_1.HttpError(400, "Domain host is required");
    }
    const [project, submittedBy] = await Promise.all([
        (0, projectRepository_1.projectRepository)().findOne({
            where: { id: params.projectId },
            relations: ["tenant"],
        }),
        userRepository().findOne({ where: { id: params.submittedById } }),
    ]);
    if (!project || project.tenant.id !== params.tenantId) {
        throw new errorHandler_1.HttpError(404, "Project not found");
    }
    if (!submittedBy) {
        throw new errorHandler_1.HttpError(404, "User not found");
    }
    await (0, quotaService_1.ensureCapacityOrThrow)(project.tenant.id, "domain");
    const domainRepo = (0, projectDomainRepository_1.projectDomainRepository)();
    const existingForProject = await domainRepo.findOne({
        where: {
            project: { id: project.id },
            host,
        },
    });
    if (existingForProject) {
        throw new errorHandler_1.HttpError(409, "Domain already exists for this project");
    }
    const duplicateAcrossTenant = await domainRepo
        .createQueryBuilder("domain")
        .innerJoin("domain.project", "project")
        .innerJoin("project.tenant", "tenant")
        .where("tenant.id = :tenantId AND domain.host = :host", {
        tenantId: params.tenantId,
        host,
    })
        .getOne();
    if (duplicateAcrossTenant) {
        throw new errorHandler_1.HttpError(409, "Domain already registered in this tenant");
    }
    const domain = domainRepo.create({
        project,
        host,
        status: "pending",
        submittedBy,
        notes: normalizeNote(params.notes),
        verificationToken: (0, crypto_1.randomUUID)(),
    });
    const saved = await domainRepo.save(domain);
    await (0, quotaService_1.incrementUsage)(project.tenant.id, { domainCount: 1 });
    const reloaded = await domainRepo.findOne({
        where: { id: saved.id },
        relations: ["project", "submittedBy", "approvedBy"],
    });
    if (!reloaded) {
        throw new errorHandler_1.HttpError(500, "Failed to load domain after submission");
    }
    return toProjectDomainResponse(reloaded, project.id);
};
exports.submitProjectDomain = submitProjectDomain;
const reviewProjectDomain = async (params) => {
    if (params.setPrimary && params.status !== "approved") {
        throw new errorHandler_1.HttpError(400, "Only approved domains can be marked as primary");
    }
    const result = await data_source_1.AppDataSource.transaction(async (manager) => {
        const domainRepo = manager.getRepository(ProjectDomain_1.ProjectDomain);
        const userRepo = manager.getRepository(User_1.User);
        const domain = await domainRepo.findOne({
            where: { id: params.domainId },
            relations: ["project", "project.tenant", "submittedBy", "approvedBy"],
        });
        if (!domain ||
            domain.project.id !== params.projectId ||
            domain.project.tenant.id !== params.tenantId) {
            throw new errorHandler_1.HttpError(404, "Domain not found");
        }
        const reviewer = await userRepo.findOne({
            where: { id: params.reviewerId },
        });
        if (!reviewer) {
            throw new errorHandler_1.HttpError(404, "User not found");
        }
        domain.status = params.status;
        if (typeof params.notes === "string") {
            domain.notes = normalizeNote(params.notes);
        }
        domain.approvedBy = reviewer;
        domain.approvedAt = new Date();
        if (params.status !== "approved") {
            domain.isPrimary = false;
        }
        if (params.status === "approved" && params.setPrimary) {
            await domainRepo
                .createQueryBuilder()
                .update(ProjectDomain_1.ProjectDomain)
                .set({ isPrimary: false })
                .where("project_id = :projectId", { projectId: params.projectId })
                .execute();
            domain.isPrimary = true;
        }
        await domainRepo.save(domain);
        const reloaded = await domainRepo.findOne({
            where: { id: domain.id },
            relations: ["project", "submittedBy", "approvedBy"],
        });
        if (!reloaded) {
            throw new errorHandler_1.HttpError(500, "Failed to load domain after review");
        }
        return toProjectDomainResponse(reloaded, params.projectId);
    });
    return result;
};
exports.reviewProjectDomain = reviewProjectDomain;
const loadProjectForTenant = async (tenantId, projectId) => {
    const project = await (0, projectRepository_1.projectRepository)().findOne({
        where: { id: projectId, tenant: { id: tenantId } },
        relations: [
            "tenant",
            "createdBy",
            "domains",
            "domains.submittedBy",
            "domains.approvedBy",
        ],
    });
    if (!project) {
        throw new errorHandler_1.HttpError(404, "Project not found");
    }
    if (project.domains) {
        project.domains.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    else {
        project.domains = [];
    }
    return project;
};
const generateProjectSlug = async (repo, tenantId, name) => {
    const base = (0, slugify_1.slugify)(name);
    let candidate = base;
    let increment = 1;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const existing = await repo.findOne({
            where: {
                tenant: { id: tenantId },
                slug: candidate,
            },
        });
        if (!existing) {
            return candidate;
        }
        increment += 1;
        candidate = `${base}-${increment}`;
    }
};
const normalizeHost = (value) => {
    const sanitized = value.trim().toLowerCase();
    const withoutProtocol = sanitized.replace(/^https?:\/\//, "");
    const [hostPart] = withoutProtocol.split("/");
    return (hostPart ?? "").replace(/\/+$/, "");
};
const normalizeNote = (value) => {
    if (typeof value !== "string") {
        return null;
    }
    const trimmed = value.trim();
    return trimmed.length ? trimmed : null;
};
const deleteProject = async (tenantId, projectId) => {
    const project = await (0, projectRepository_1.projectRepository)().findOne({
        where: { id: projectId, tenant: { id: tenantId } },
        relations: ["tenant", "domains"],
    });
    if (!project) {
        throw new errorHandler_1.HttpError(404, "Project not found");
    }
    // Count domains before deletion for usage decrement
    const domainCount = project.domains?.length ?? 0;
    // Delete the project (cascade will handle related entities)
    await (0, projectRepository_1.projectRepository)().remove(project);
    // Decrement usage counts
    await (0, quotaService_1.decrementUsage)(project.tenant.id, {
        projectCount: 1,
        domainCount: domainCount,
    });
};
exports.deleteProject = deleteProject;
//# sourceMappingURL=projectService.js.map