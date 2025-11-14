import { BaseEntity } from "./BaseEntity";
import { SeoIssue } from "./SeoIssue";
import { User } from "./User";
export type SeoFixProvider = "gpt" | "gemini" | "groq" | "mock" | "manual";
export declare class SeoFix extends BaseEntity {
    issue: SeoIssue;
    provider: SeoFixProvider;
    content: Record<string, unknown>;
    createdBy?: User | null;
}
//# sourceMappingURL=SeoFix.d.ts.map