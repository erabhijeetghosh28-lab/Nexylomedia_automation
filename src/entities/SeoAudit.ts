import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  JoinColumn,
} from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Project } from "./Project";
import { SitePage } from "./SitePage";
import { SeoIssue } from "./SeoIssue";

export type SeoAuditType = "pagespeed" | "seo" | "lighthouse";
export type SeoAuditStatus =
  | "pending"
  | "queued"
  | "running"
  | "completed"
  | "failed";
export type SeoAuditTrigger = "manual" | "scheduled" | "auto_regression";
export type SeoAuditRunner = "mock" | "live";

@Entity({ name: "seo_audits" })
@Index(["project", "type", "status"])
export class SeoAudit extends BaseEntity {
  @ManyToOne(() => Project, (project) => project.audits, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "project_id" })
  project!: Project;

  @ManyToOne(() => SitePage, (page) => page.audits, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "page_id" })
  page?: SitePage | null;

  @Column({ type: "nvarchar", length: 20 })
  type!: SeoAuditType;

  @Column({ type: "nvarchar", length: 20, default: "pending" })
  status!: SeoAuditStatus;

  @Column({ type: "nvarchar", length: 20, default: "manual" })
  trigger!: SeoAuditTrigger;

  @Column({ type: "nvarchar", length: 10, default: "mock" })
  runner!: SeoAuditRunner;

  @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
  score?: number | null;

  @Column({ type: "nvarchar", length: 512, nullable: true })
  summary?: string | null;

  @Column({ type: "nvarchar", length: 1024, nullable: true })
  error?: string | null;

  @Column("simple-json", { nullable: true })
  rawResult?: Record<string, unknown> | null;

  @Column({ type: "nvarchar", length: 128, nullable: true })
  jobId?: string | null;

  @Column({ type: "datetime2", nullable: true })
  startedAt?: Date | null;

  @Column({ type: "datetime2", nullable: true })
  completedAt?: Date | null;

  @OneToMany(() => SeoIssue, (issue) => issue.audit, {
    cascade: true,
  })
  issues!: SeoIssue[];
}


