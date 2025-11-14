import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Tenant } from "./Tenant";
import { User } from "./User";

export type IntegrationScope = "tenant" | "user";
export type IntegrationStatus = "ok" | "failed" | "untested";

@Entity({ name: "integrations" })
@Index(["tenant", "provider"])
@Index(["user", "provider"])
export class Integration extends BaseEntity {
  @ManyToOne(() => Tenant, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "tenant_id" })
  tenant?: Tenant | null;

  @ManyToOne(() => User, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user?: User | null;

  @Column({ type: "nvarchar", length: 64 })
  provider!: string;

  @Column({ type: "nvarchar", length: 128 })
  keyMask!: string;

  @Column({ type: "nvarchar", length: 512 })
  secretRef!: string;

  @Column({ type: "nvarchar", length: 16 })
  scope!: IntegrationScope;

  @Column({ type: "nvarchar", length: 16, default: "untested" })
  status!: IntegrationStatus;

  @Column("simple-json", { nullable: true })
  configJson?: Record<string, unknown> | null;
}

