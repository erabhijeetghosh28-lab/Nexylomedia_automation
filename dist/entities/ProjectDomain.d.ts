import { BaseEntity } from "./BaseEntity";
import { Project } from "./Project";
import { User } from "./User";
export type ProjectDomainStatus = "pending" | "approved" | "rejected" | "suspended";
export declare class ProjectDomain extends BaseEntity {
    project: Project;
    host: string;
    status: ProjectDomainStatus;
    isPrimary: boolean;
    verificationToken?: string | null;
    submittedBy: User;
    approvedBy?: User | null;
    approvedAt?: Date | null;
    notes?: string | null;
}
//# sourceMappingURL=ProjectDomain.d.ts.map