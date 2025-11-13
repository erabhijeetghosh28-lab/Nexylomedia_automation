import type { TenantRole } from "../entities/UserTenant";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        tenantId?: string;
        role?: TenantRole;
      };
    }
  }
}

export {};

