import { Entity, Column, OneToMany, OneToOne, ManyToOne, JoinColumn, ValueTransformer } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { UserTenant } from "./UserTenant";
import { Project } from "./Project";
import { TenantQuota } from "./TenantQuota";
import { TenantUsage } from "./TenantUsage";
import { TenantPlan } from "./TenantPlan";

// Transformer to handle JSON columns stored as nvarchar(MAX)
const jsonTransformer: ValueTransformer = {
  to: (value: Record<string, any> | null) => {
    return value ? JSON.stringify(value) : null;
  },
  from: (value: string | null) => {
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  },
};

@Entity({ name: "tenants" })
export class Tenant extends BaseEntity {
  @Column({ unique: true })
  slug!: string;

  @Column()
  name!: string;

  @ManyToOne(() => TenantPlan, { nullable: true })
  @JoinColumn({ name: "plan_key", referencedColumnName: "key" })
  plan?: TenantPlan | null;

  @Column({
    type: "nvarchar",
    length: "MAX",
    nullable: true,
    name: "features_json",
    transformer: jsonTransformer,
  })
  featuresJson?: Record<string, boolean> | null;

  @OneToMany(() => UserTenant, (membership) => membership.tenant)
  memberships!: UserTenant[];

  @OneToMany(() => Project, (project) => project.tenant)
  projects!: Project[];

  @OneToOne(() => TenantQuota, (quota) => quota.tenant)
  quota!: TenantQuota;

  @OneToOne(() => TenantUsage, (usage) => usage.tenant)
  usage!: TenantUsage;
}

