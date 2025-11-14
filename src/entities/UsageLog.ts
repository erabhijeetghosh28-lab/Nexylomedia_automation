import { Entity, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Tenant } from "./Tenant";

@Entity({ name: "usage_logs" })
@Index(["tenant", "metricKey", "periodStart"])
@Index(["tenant", "periodStart", "periodEnd"])
export class UsageLog extends BaseEntity {
  @ManyToOne(() => Tenant, { onDelete: "CASCADE" })
  @JoinColumn({ name: "tenant_id" })
  tenant!: Tenant;

  @Column({ type: "nvarchar", length: 128 })
  metricKey!: string;

  @Column({ type: "int" })
  value!: number;

  @Column({ type: "datetime2" })
  periodStart!: Date;

  @Column({ type: "datetime2" })
  periodEnd!: Date;
}

