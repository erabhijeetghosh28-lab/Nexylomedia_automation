import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { SeoIssue } from "./SeoIssue";
import { User } from "./User";

export type SeoFixProvider = "gpt" | "gemini" | "groq" | "mock" | "manual";

@Entity({ name: "seo_fixes" })
export class SeoFix extends BaseEntity {
  @ManyToOne(() => SeoIssue, (issue) => issue.fixes, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "issue_id" })
  issue!: SeoIssue;

  @Column({ type: "nvarchar", length: 16 })
  provider!: SeoFixProvider;

  @Column("simple-json")
  content!: Record<string, unknown>;

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "created_by_id" })
  createdBy?: User | null;
}


