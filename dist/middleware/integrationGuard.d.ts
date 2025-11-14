import type { Request, Response, NextFunction } from "express";
import type { Integration } from "../entities/Integration";
declare global {
    namespace Express {
        interface Request {
            integration?: Integration;
            integrationSecret?: string;
        }
    }
}
export declare const requireIntegration: (provider: string, options?: {
    allowUserKey?: boolean;
}) => (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=integrationGuard.d.ts.map