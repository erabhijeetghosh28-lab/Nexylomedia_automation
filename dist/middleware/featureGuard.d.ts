import type { Request, Response, NextFunction } from "express";
export declare const tenantFeatureGuard: (featureKey: string) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=featureGuard.d.ts.map