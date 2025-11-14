import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  JoinColumn,
} from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { SeoAudit } from "./SeoAudit";
import { SeoFix } from "./SeoFix";

export type SeoIssueSeverity =
  | "info"
  | "low"
  | "medium"
  | "high"
  | "critical";
export type SeoIssueCategory =
  | "performance"
  | "accessibility"
  | "seo"
  | "best_practices";
export type SeoIssueStatus =
  | "open"
  | "in_progress"
  | "resolved"
  | "ignored";

@Entity({ name: "seo_issues" })
@Index(["audit", "code"])
export class SeoIssue extends BaseEntity {
  @ManyToOne(() => SeoAudit, (audit) => audit.issues, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "audit_id" })
  audit!: SeoAudit;

  @Column({ length: 128 })
  code!: string;

  @Column({ type: "nvarchar", length: 16, default: "medium" })
  severity!: SeoIssueSeverity;

  @Column({ type: "nvarchar", length: 20, default: "performance" })
  category!: SeoIssueCategory;

  @Column({ type: "nvarchar", length: 512 })
  description!: string;

  @Column({ type: "decimal", precision: 10, scale: 4, nullable: true })
  metricValue?: number | null;

  @Column({ type: "decimal", precision: 10, scale: 4, nullable: true })
  threshold?: number | null;

  @Column({ type: "nvarchar", length: 1024, nullable: true })
  recommendation?: string | null;

  @Column({ type: "nvarchar", length: 16, default: "open" })
  status!: SeoIssueStatus;

  @Column({ type: "datetime2", nullable: true })
  resolvedAt?: Date | null;

  @OneToMany(() => SeoFix, (fix) => fix.issue, {
    cascade: true,
  })
  fixes!: SeoFix[];
}


