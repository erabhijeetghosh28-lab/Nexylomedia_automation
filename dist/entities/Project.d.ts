import { BaseEntity } from "./BaseEntity";
import { Tenant } from "./Tenant";
import { User } from "./User";
import { ProjectDomain } from "./ProjectDomain";
import { SitePage } from "./SitePage";
import { SeoAudit } from "./SeoAudit";
export type ProjectStatus = "active" | "paused" | "archived";
export declare class Project extends BaseEntity {
    tenant: Tenant;
    createdBy: User;
    name: string;
    slug: string;
    status: ProjectStatus;
    description?: string | null;
    domains: ProjectDomain[];
    pages: SitePage[];
    audits: SeoAudit[];
}
//# sourceMappingURL=Project.d.ts.map