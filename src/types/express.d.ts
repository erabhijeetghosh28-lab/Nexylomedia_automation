import type { TenantRole } from "../entities/UserTenant";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        tenantId?: string | null;
        role?: TenantRole;
        scopes?: string[];
      };
    }
  }
}

export {};

