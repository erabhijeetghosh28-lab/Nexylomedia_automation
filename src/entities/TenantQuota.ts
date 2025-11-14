import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  Unique,
} from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Tenant } from "./Tenant";
import { TenantPlan } from "./TenantPlan";

export type BillingStatus =
  | "trial"
  | "active"
  | "past_due"
  | "suspended"
  | "cancelled";

@Entity({ name: "tenant_quotas" })
@Unique(["tenant"])
export class TenantQuota extends BaseEntity {
  @OneToOne(() => Tenant, (tenant) => tenant.quota, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "tenant_id" })
  tenant!: Tenant;

  @ManyToOne(() => TenantPlan, (plan) => plan.quotas, {
    nullable: true,
  })
  @JoinColumn({ name: "plan_id" })
  plan?: TenantPlan | null;

  @Column({ type: "int", nullable: true })
  maxProjects?: number | null;

  @Column({ type: "int", nullable: true })
  maxDomains?: number | null;

  @Column({ type: "int", nullable: true })
  maxMembers?: number | null;

  @Column({ type: "int", nullable: true })
  maxOrgAdmins?: number | null;

  @Column({ type: "int", nullable: true })
  maxAutomationsPerMonth?: number | null;

  @Column("simple-json", { nullable: true })
  featureFlags?: Record<string, boolean> | null;

  @Column({ type: "nvarchar", length: 16, default: "trial" })
  billingStatus!: BillingStatus;

  @Column({ type: "datetime2", nullable: true })
  trialEndsAt?: Date | null;

  @Column({ type: "datetime2", nullable: true })
  currentPeriodEndsAt?: Date | null;

  @Column({ type: "nvarchar", length: "MAX", nullable: true })
  notes?: string | null;

  @Column("simple-json", { nullable: true })
  apiKeys?: Record<string, string> | null;
}


