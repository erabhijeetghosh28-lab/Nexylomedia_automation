import {
  Entity,
  Column,
  ManyToOne,
  Unique,
  JoinColumn,
} from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { Tenant } from "./Tenant";

export type TenantRole = "super_admin" | "org_admin" | "member";

@Entity({ name: "user_tenants" })
@Unique(["user", "tenant"])
export class UserTenant extends BaseEntity {
  @ManyToOne(() => User, (user) => user.memberships, { eager: true })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => Tenant, (tenant) => tenant.memberships, { eager: true })
  @JoinColumn({ name: "tenant_id" })
  tenant!: Tenant;

  @Column({ type: "nvarchar", length: 32 })
  role!: TenantRole;
}

