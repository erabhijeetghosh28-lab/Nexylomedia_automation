import { randomUUID } from "crypto";
import { AppDataSource } from "../config/data-source";
import { Project, ProjectStatus } from "../entities/Project";
import {
  ProjectDomain,
  ProjectDomainStatus,
} from "../entities/ProjectDomain";
import { Tenant } from "../entities/Tenant";
import { User } from "../entities/User";
import { HttpError } from "../middleware/errorHandler";
import { slugify } from "../utils/slugify";
import { projectRepository } from "../repositories/projectRepository";
import { projectDomainRepository } from "../repositories/projectDomainRepository";
import {
  ensureCapacityOrThrow,
  incrementUsage,
  decrementUsage,
} from "./quotaService";

const tenantRepository = () => AppDataSource.getRepository(Tenant);
const userRepository = () => AppDataSource.getRepository(User);

type UserSummary = {
  id: string;
  email: string;
  displayName: string | null;
};

export type ProjectDomainResponse = {
  id: string;
  projectId: string;
  host: string;
  status: ProjectDomainStatus;
  isPrimary: boolean;
  verificationToken: string | null;
  submittedBy: UserSummary | null;
  approvedBy: UserSummary | null;
  approvedAt: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectResponse = {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  status: ProjectStatus;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: UserSummary | null;
  domains: ProjectDomainResponse[];
};

type CreateProjectParams = {
  tenantId: string;
  createdById: string;
  name: string;
  description?: string;
  status?: ProjectStatus;
};

type SubmitDomainParams = {
  tenantId: string;
  projectId: string;
  submittedById: string;
  host: string;
  notes?: string | null;
};

type ReviewDomainParams = {
  tenantId: string;
  projectId: string;
  domainId: string;
  reviewerId: string;
  status: Extract<ProjectDomainStatus, "approved" | "rejected" | "suspended">;
  notes?: string;
  setPrimary?: boolean;
};

const toUserSummary = (user?: User | null): UserSummary | null => {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName ?? null,
  };
};

const toProjectDomainResponse = (
  domain: ProjectDomain,
  projectIdOverride?: string,
): ProjectDomainResponse => ({
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

const toProjectResponse = (project: Project): ProjectResponse => ({
  id: project.id,
  tenantId: project.tenant.id,
  name: project.name,
  slug: project.slug,
  status: project.status,
  description: project.description ?? null,
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
  createdBy: toUserSummary(project.createdBy),
  domains: (project.domains ?? []).map((domain) =>
    toProjectDomainResponse(domain, project.id),
  ),
});

export const listProjectsForTenant = async (
  tenantId: string,
): Promise<ProjectResponse[]> => {
  const projects = await projectRepository().find({
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
      project.domains.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      );
    }
  });

  return projects.map(toProjectResponse);
};

export const getProjectForTenant = async (
  tenantId: string,
  projectId: string,
): Promise<ProjectResponse> => {
  const project = await loadProjectForTenant(tenantId, projectId);
  return toProjectResponse(project);
};

export const listDomainsForProject = async (
  tenantId: string,
  projectId: string,
): Promise<ProjectDomainResponse[]> => {
  const project = await loadProjectForTenant(tenantId, projectId);
  return project.domains.map((domain) =>
    toProjectDomainResponse(domain, project.id),
  );
};

export const createProject = async (
  params: CreateProjectParams,
): Promise<ProjectResponse> => {
  const name = params.name.trim();
  const tenant = await tenantRepository().findOne({
    where: { id: params.tenantId },
  });
  if (!tenant) {
    throw new HttpError(404, "Tenant not found");
  }

  const creator = await userRepository().findOne({
    where: { id: params.createdById },
  });
  if (!creator) {
    throw new HttpError(404, "User not found");
  }

  if (!name) {
    throw new HttpError(400, "Project name is required");
  }

  const repo = projectRepository();
  const slug = await generateProjectSlug(repo, tenant.id, name);

  await ensureCapacityOrThrow(tenant.id, "project");

  const project = repo.create({
    tenant,
    createdBy: creator,
    name,
    description: params.description?.trim() ?? null,
    slug,
    status: params.status ?? "active",
  });

  const saved = await repo.save(project);
  await incrementUsage(tenant.id, { projectCount: 1 });
  const reloaded = await loadProjectForTenant(tenant.id, saved.id);
  return toProjectResponse(reloaded);
};

export const submitProjectDomain = async (
  params: SubmitDomainParams,
): Promise<ProjectDomainResponse> => {
  const host = normalizeHost(params.host);
  if (!host) {
    throw new HttpError(400, "Domain host is required");
  }

  const [project, submittedBy] = await Promise.all([
    projectRepository().findOne({
      where: { id: params.projectId },
      relations: ["tenant"],
    }),
    userRepository().findOne({ where: { id: params.submittedById } }),
  ]);

  if (!project || project.tenant.id !== params.tenantId) {
    throw new HttpError(404, "Project not found");
  }
  if (!submittedBy) {
    throw new HttpError(404, "User not found");
  }

  await ensureCapacityOrThrow(project.tenant.id, "domain");

  const domainRepo = projectDomainRepository();

  const existingForProject = await domainRepo.findOne({
    where: {
      project: { id: project.id },
      host,
    },
  });
  if (existingForProject) {
    throw new HttpError(409, "Domain already exists for this project");
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
    throw new HttpError(409, "Domain already registered in this tenant");
  }

  const domain = domainRepo.create({
    project,
    host,
    status: "pending",
    submittedBy,
    notes: normalizeNote(params.notes),
    verificationToken: randomUUID(),
  });

  const saved = await domainRepo.save(domain);
  await incrementUsage(project.tenant.id, { domainCount: 1 });

  const reloaded = await domainRepo.findOne({
    where: { id: saved.id },
    relations: ["project", "submittedBy", "approvedBy"],
  });
  if (!reloaded) {
    throw new HttpError(500, "Failed to load domain after submission");
  }

  return toProjectDomainResponse(reloaded, project.id);
};

export const reviewProjectDomain = async (
  params: ReviewDomainParams,
): Promise<ProjectDomainResponse> => {
  if (params.setPrimary && params.status !== "approved") {
    throw new HttpError(
      400,
      "Only approved domains can be marked as primary",
    );
  }

  const result = await AppDataSource.transaction(async (manager) => {
    const domainRepo = manager.getRepository(ProjectDomain);
    const userRepo = manager.getRepository(User);

    const domain = await domainRepo.findOne({
      where: { id: params.domainId },
      relations: ["project", "project.tenant", "submittedBy", "approvedBy"],
    });
    if (
      !domain ||
      domain.project.id !== params.projectId ||
      domain.project.tenant.id !== params.tenantId
    ) {
      throw new HttpError(404, "Domain not found");
    }

    const reviewer = await userRepo.findOne({
      where: { id: params.reviewerId },
    });
    if (!reviewer) {
      throw new HttpError(404, "User not found");
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
        .update(ProjectDomain)
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
      throw new HttpError(500, "Failed to load domain after review");
    }

    return toProjectDomainResponse(reloaded, params.projectId);
  });

  return result;
};

const loadProjectForTenant = async (tenantId: string, projectId: string) => {
  const project = await projectRepository().findOne({
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
    throw new HttpError(404, "Project not found");
  }

  if (project.domains) {
    project.domains.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  } else {
    project.domains = [];
  }

  return project;
};

const generateProjectSlug = async (
  repo: ReturnType<typeof projectRepository>,
  tenantId: string,
  name: string,
) => {
  const base = slugify(name);
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

const normalizeHost = (value: string) => {
  const sanitized = value.trim().toLowerCase();
  const withoutProtocol = sanitized.replace(/^https?:\/\//, "");
  const [hostPart] = withoutProtocol.split("/");
  return (hostPart ?? "").replace(/\/+$/, "");
};

const normalizeNote = (value?: string | null) => {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

export const deleteProject = async (
  tenantId: string,
  projectId: string,
): Promise<void> => {
  const project = await projectRepository().findOne({
    where: { id: projectId, tenant: { id: tenantId } },
    relations: ["tenant", "domains"],
  });

  if (!project) {
    throw new HttpError(404, "Project not found");
  }

  // Count domains before deletion for usage decrement
  const domainCount = project.domains?.length ?? 0;

  // Manually delete related entities first to avoid foreign key constraint errors
  // The database constraints may not have CASCADE enabled even though the entities say they should
  if (project.domains && project.domains.length > 0) {
    const domainRepo = AppDataSource.getRepository(ProjectDomain);
    await domainRepo.remove(project.domains);
  }

  // Delete the project
  // Note: SitePage has cascade: ["remove"] so it should be handled automatically
  // SeoAudit doesn't have cascade, but we'll let the database handle it or handle it separately if needed
  await projectRepository().remove(project);

  // Decrement usage counts
  await decrementUsage(project.tenant.id, {
    projectCount: 1,
    domainCount: domainCount,
  });
};

