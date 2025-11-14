import { Integration, IntegrationScope, IntegrationStatus } from "../entities/Integration";
export type CreateIntegrationParams = {
    tenantId?: string;
    userId?: string;
    provider: string;
    secret: string;
    scope: IntegrationScope;
    configJson?: Record<string, unknown>;
};
export type UpdateIntegrationParams = {
    secret?: string;
    status?: IntegrationStatus;
    configJson?: Record<string, unknown>;
};
export type FindIntegrationParams = {
    tenantId?: string;
    userId?: string;
    provider: string;
};
export declare const findIntegration: (params: FindIntegrationParams) => Promise<Integration | null>;
export declare const createIntegration: (params: CreateIntegrationParams) => Promise<Integration>;
export declare const updateIntegration: (id: string, params: UpdateIntegrationParams) => Promise<Integration>;
export declare const deleteIntegration: (id: string) => Promise<void>;
export declare const testIntegration: (id: string) => Promise<{
    status: "ok" | "failed";
    message?: string;
}>;
export declare const getIntegrationSecret: (integration: Integration) => Promise<string>;
export declare const getMaskedKey: (integration: Integration) => string;
//# sourceMappingURL=integrationService.d.ts.map