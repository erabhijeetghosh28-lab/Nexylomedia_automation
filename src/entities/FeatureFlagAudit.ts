import { Entity, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Tenant } from "./Tenant";
import { User } from "./User";

@Entity({ name: "feature_flag_audit" })
@Index(["tenant", "flagKey"])
@Index(["enabledAt"])
export class FeatureFlagAudit extends BaseEntity {
  @ManyToOne(() => Tenant, { onDelete: "CASCADE" })
  @JoinColumn({ name: "tenant_id" })
  tenant!: Tenant;

  @Column({ type: "nvarchar", length: 128 })
  flagKey!: string;

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "enabled_by_user_id" })
  enabledBy?: User | null;

  @Column({ type: "datetime2", default: () => "GETDATE()" })
  enabledAt!: Date;

  @Column({ type: "nvarchar", length: "MAX", nullable: true })
  reason?: string | null;
}

