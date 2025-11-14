import { BaseEntity } from "./BaseEntity";
import { SeoAudit } from "./SeoAudit";
import { SeoFix } from "./SeoFix";
export type SeoIssueSeverity = "info" | "low" | "medium" | "high" | "critical";
export type SeoIssueCategory = "performance" | "accessibility" | "seo" | "best_practices";
export type SeoIssueStatus = "open" | "in_progress" | "resolved" | "ignored";
export declare class SeoIssue extends BaseEntity {
    audit: SeoAudit;
    code: string;
    severity: SeoIssueSeverity;
    category: SeoIssueCategory;
    description: string;
    metricValue?: number | null;
    threshold?: number | null;
    recommendation?: string | null;
    status: SeoIssueStatus;
    resolvedAt?: Date | null;
    fixes: SeoFix[];
}
//# sourceMappingURL=SeoIssue.d.ts.map