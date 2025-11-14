import { SeoIssue, SeoIssueStatus } from "../entities/SeoIssue";
import { SeoFix, SeoFixProvider } from "../entities/SeoFix";
export declare const listIssues: (auditId: string, filters?: {
    status?: SeoIssueStatus;
    severity?: string | null | undefined;
    category?: string | null | undefined;
}) => Promise<SeoIssue[]>;
export declare const getIssueById: (issueId: string, auditId: string) => Promise<SeoIssue>;
export declare const updateIssueStatus: (issueId: string, status: SeoIssueStatus) => Promise<SeoIssue>;
export declare const createFix: (params: {
    issueId: string;
    provider: SeoFixProvider;
    content: Record<string, unknown>;
    createdById?: string;
}) => Promise<SeoFix>;
export declare const generateAiFix: (issueId: string, provider?: "gpt" | "gemini" | "groq", apiKey?: string) => Promise<SeoFix>;
//# sourceMappingURL=seoIssueService.d.ts.map