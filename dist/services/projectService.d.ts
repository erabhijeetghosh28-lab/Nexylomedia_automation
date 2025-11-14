import { ProjectStatus } from "../entities/Project";
import { ProjectDomainStatus } from "../entities/ProjectDomain";
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
export declare const listProjectsForTenant: (tenantId: string) => Promise<ProjectResponse[]>;
export declare const getProjectForTenant: (tenantId: string, projectId: string) => Promise<ProjectResponse>;
export declare const listDomainsForProject: (tenantId: string, projectId: string) => Promise<ProjectDomainResponse[]>;
export declare const createProject: (params: CreateProjectParams) => Promise<ProjectResponse>;
export declare const submitProjectDomain: (params: SubmitDomainParams) => Promise<ProjectDomainResponse>;
export declare const reviewProjectDomain: (params: ReviewDomainParams) => Promise<ProjectDomainResponse>;
export declare const deleteProject: (tenantId: string, projectId: string) => Promise<void>;
export {};
//# sourceMappingURL=projectService.d.ts.map