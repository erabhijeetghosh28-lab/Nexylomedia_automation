import { BaseEntity } from "./BaseEntity";
import { Project } from "./Project";
import { ProjectDomain } from "./ProjectDomain";
import { SeoAudit } from "./SeoAudit";
export type SitePageOrigin = "sitemap" | "robots" | "manual";
export type SitePageStatus = "discovered" | "crawled" | "blocked";
export declare class SitePage extends BaseEntity {
    project: Project;
    domain?: ProjectDomain | null;
    fullUrl: string;
    urlPath: string;
    status: SitePageStatus;
    origin: SitePageOrigin;
    httpStatus?: number | null;
    checksum?: string | null;
    lastDiscoveredAt?: Date | null;
    lastCrawledAt?: Date | null;
    isIndexed: boolean;
    metadata?: Record<string, unknown> | null;
    audits: SeoAudit[];
}
//# sourceMappingURL=SitePage.d.ts.map