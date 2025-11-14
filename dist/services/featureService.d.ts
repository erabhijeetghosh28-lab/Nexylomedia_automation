export type FeatureStatus = {
    enabled: boolean;
    source: "plan" | "override" | null;
    quotaLeft?: number;
};
export declare const isFeatureEnabled: (tenantId: string, featureKey: string) => Promise<boolean>;
export declare const getFeatureSource: (tenantId: string, featureKey: string) => Promise<"plan" | "override" | null>;
export declare const getFeatureStatus: (tenantId: string, featureKey: string) => Promise<FeatureStatus>;
export declare const setFeatureOverride: (tenantId: string, featureKey: string, enabled: boolean, userId: string, reason?: string) => Promise<void>;
//# sourceMappingURL=featureService.d.ts.map