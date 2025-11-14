import { Tenant } from "../entities/Tenant";
export declare const tenantRepository: () => import("typeorm").Repository<Tenant>;
export declare const createTenant: (name: string) => Promise<Tenant>;
export declare const findTenantById: (id: string) => Promise<Tenant | null>;
//# sourceMappingURL=tenantService.d.ts.map