import {
  Entity,
  Column,
  ManyToOne,
  Index,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Project } from "./Project";
import { ProjectDomain } from "./ProjectDomain";
import { SeoAudit } from "./SeoAudit";

export type SitePageOrigin = "sitemap" | "robots" | "manual";
export type SitePageStatus = "discovered" | "crawled" | "blocked";

@Entity({ name: "site_pages" })
@Index(["project", "fullUrl"], { unique: true })
export class SitePage extends BaseEntity {
  @ManyToOne(() => Project, (project) => project.pages, {
    onDelete: "NO ACTION",
  })
  @JoinColumn({ name: "project_id" })
  project!: Project;

  @ManyToOne(() => ProjectDomain, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "domain_id" })
  domain?: ProjectDomain | null;

  @Column({ type: "nvarchar", length: 2048 })
  fullUrl!: string;

  @Column({ type: "nvarchar", length: 1024 })
  urlPath!: string;

  @Column({ type: "nvarchar", length: 16, default: "discovered" })
  status!: SitePageStatus;

  @Column({ type: "nvarchar", length: 16, default: "sitemap" })
  origin!: SitePageOrigin;

  @Column({ type: "int", nullable: true })
  httpStatus?: number | null;

  @Column({ type: "nvarchar", length: 64, nullable: true })
  checksum?: string | null;

  @Column({ type: "datetime2", nullable: true })
  lastDiscoveredAt?: Date | null;

  @Column({ type: "datetime2", nullable: true })
  lastCrawledAt?: Date | null;

  @Column({ default: true })
  isIndexed!: boolean;

  @Column("simple-json", { nullable: true })
  metadata?: Record<string, unknown> | null;

  @OneToMany(() => SeoAudit, (audit) => audit.page)
  audits!: SeoAudit[];
}


