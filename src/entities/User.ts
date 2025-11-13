import { Entity, Column, OneToMany, Index } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { UserTenant } from "./UserTenant";

@Entity({ name: "users" })
export class User extends BaseEntity {
  @Index({ unique: true })
  @Column()
  email!: string;

  @Column()
  passwordHash!: string;

  @Column({ nullable: true })
  displayName?: string;

  @OneToMany(() => UserTenant, (membership) => membership.user)
  memberships!: UserTenant[];
}

