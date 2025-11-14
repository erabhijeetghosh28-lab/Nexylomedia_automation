import { Column, Entity, Index, OneToMany, ValueTransformer } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { TenantQuota } from "./TenantQuota";

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

@Entity({ name: "tenant_plans" })
@Index(["code"], { unique: true })
@Index(["key"], { unique: true })
export class TenantPlan extends BaseEntity {
  @Column({ length: 64 })
  code!: string;

  @Column({ type: "nvarchar", length: 64, unique: true, nullable: true })
  key?: string | null;

  @Column({ length: 120 })
  name!: string;

  @Column({ type: "nvarchar", length: 512, nullable: true })
  description?: string | null;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  monthlyPrice!: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  annualPrice!: number;

  @Column({ length: 8, default: "USD" })
  currency!: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({
    type: "nvarchar",
    length: "MAX",
    nullable: true,
    name: "allowed_features",
    transformer: jsonTransformer,
  })
  allowedFeatures?: Record<string, boolean> | null;

  @Column({
    type: "nvarchar",
    length: "MAX",
    nullable: true,
    name: "quotas",
    transformer: jsonTransformer,
  })
  quotas?: Record<string, number> | null;

  @OneToMany(() => TenantQuota, (quota) => quota.plan)
  quotasList!: TenantQuota[];
}



