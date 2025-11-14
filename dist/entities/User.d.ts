import { BaseEntity } from "./BaseEntity";
import { UserTenant } from "./UserTenant";
import { Project } from "./Project";
export declare class User extends BaseEntity {
    email: string;
    passwordHash: string;
    displayName?: string;
    memberships: UserTenant[];
    createdProjects: Project[];
}
//# sourceMappingURL=User.d.ts.map