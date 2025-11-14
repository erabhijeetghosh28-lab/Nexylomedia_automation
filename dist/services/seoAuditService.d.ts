import { SeoAudit, SeoAuditType, SeoAuditStatus, SeoAuditTrigger } from "../entities/SeoAudit";
type CreateAuditParams = {
    projectId: string;
    type: SeoAuditType;
    pageId?: string | null | undefined;
    trigger?: SeoAuditTrigger;
};
export declare const createAudit: (params: CreateAuditParams) => Promise<SeoAudit>;
export declare const runAudit: (auditId: string, pageSpeedApiKey?: string) => Promise<SeoAudit>;
export declare const listAudits: (projectId: string, filters?: {
    type?: SeoAuditType;
    status?: SeoAuditStatus;
    pageId?: string | null | undefined;
}) => Promise<SeoAudit[]>;
export declare const getAuditById: (auditId: string, projectId: string) => Promise<SeoAudit>;
export {};
//# sourceMappingURL=seoAuditService.d.ts.map