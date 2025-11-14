import { BaseEntity } from "./BaseEntity";
import { Project } from "./Project";
import { SitePage } from "./SitePage";
import { SeoIssue } from "./SeoIssue";
export type SeoAuditType = "pagespeed" | "seo" | "lighthouse";
export type SeoAuditStatus = "pending" | "queued" | "running" | "completed" | "failed";
export type SeoAuditTrigger = "manual" | "scheduled" | "auto_regression";
export type SeoAuditRunner = "mock" | "live";
export declare class SeoAudit extends BaseEntity {
    project: Project;
    page?: SitePage | null;
    type: SeoAuditType;
    status: SeoAuditStatus;
    trigger: SeoAuditTrigger;
    runner: SeoAuditRunner;
    score?: number | null;
    summary?: string | null;
    error?: string | null;
    rawResult?: Record<string, unknown> | null;
    jobId?: string | null;
    startedAt?: Date | null;
    completedAt?: Date | null;
    issues: SeoIssue[];
}
//# sourceMappingURL=SeoAudit.d.ts.map