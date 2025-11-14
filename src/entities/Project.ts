import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  JoinColumn,
} from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Tenant } from "./Tenant";
import { User } from "./User";
import { ProjectDomain } from "./ProjectDomain";
import { SitePage } from "./SitePage";
import { SeoAudit } from "./SeoAudit";

export type ProjectStatus = "active" | "paused" | "archived";

@Entity({ name: "projects" })
@Index(["tenant", "slug"], { unique: true })
export class Project extends BaseEntity {
  @ManyToOne(() => Tenant, (tenant) => tenant.projects, {
    eager: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "tenant_id" })
  tenant!: Tenant;

  @ManyToOne(() => User, (user) => user.createdProjects, {
    eager: true,
    onDelete: "NO ACTION",
  })
  @JoinColumn({ name: "created_by_id" })
  createdBy!: User;

  @Column({ type: "nvarchar", length: 120 })
  name!: string;

  @Column({ type: "nvarchar", length: 160 })
  slug!: string;

  @Column({ type: "nvarchar", length: 20, default: "active" })
  status!: ProjectStatus;

  @Column({ type: "nvarchar", length: 512, nullable: true })
  description?: string | null;

  @OneToMany(() => ProjectDomain, (domain) => domain.project)
  domains!: ProjectDomain[];

  @OneToMany(() => SitePage, (page) => page.project, {
    cascade: ["remove"],
  })
  pages!: SitePage[];

  @OneToMany(() => SeoAudit, (audit) => audit.project)
  audits!: SeoAudit[];
}


