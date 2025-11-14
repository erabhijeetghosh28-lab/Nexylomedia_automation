import { Column, Entity, JoinColumn, OneToOne, Unique } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Tenant } from "./Tenant";

@Entity({ name: "tenant_usages" })
@Unique(["tenant"])
export class TenantUsage extends BaseEntity {
  @OneToOne(() => Tenant, (tenant) => tenant.usage, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "tenant_id" })
  tenant!: Tenant;

  @Column({ type: "int", default: 0 })
  projectCount!: number;

  @Column({ type: "int", default: 0 })
  domainCount!: number;

  @Column({ type: "int", default: 0 })
  memberCount!: number;

  @Column({ type: "int", default: 0 })
  orgAdminCount!: number;

  @Column({ type: "int", default: 0 })
  automationRunsThisMonth!: number;

  @Column({ type: "datetime2", nullable: true })
  lastCalculatedAt?: Date | null;
}



