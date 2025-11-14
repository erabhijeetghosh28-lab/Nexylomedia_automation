import {
  Entity,
  Column,
  ManyToOne,
  Index,
  JoinColumn,
} from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Project } from "./Project";
import { User } from "./User";

export type ProjectDomainStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "suspended";

@Entity({ name: "project_domains" })
@Index(["project", "host"], { unique: true })
export class ProjectDomain extends BaseEntity {
  @ManyToOne(() => Project, (project) => project.domains, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "project_id" })
  project!: Project;

  @Column({ length: 255 })
  host!: string;

  @Column({ type: "nvarchar", length: 20, default: "pending" })
  status!: ProjectDomainStatus;

  @Column({ default: false })
  isPrimary!: boolean;

  @Column({ type: "nvarchar", length: 64, nullable: true })
  verificationToken?: string | null;

  @ManyToOne(() => User, { eager: true, onDelete: "NO ACTION" })
  @JoinColumn({ name: "submitted_by_id" })
  submittedBy!: User;

  @ManyToOne(() => User, {
    eager: true,
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "approved_by_id" })
  approvedBy?: User | null;

  @Column({ type: "datetime2", nullable: true })
  approvedAt?: Date | null;

  @Column({ type: "nvarchar", length: 512, nullable: true })
  notes?: string | null;
}


