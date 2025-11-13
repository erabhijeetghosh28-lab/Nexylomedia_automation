import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { UserTenant } from "./UserTenant";

@Entity({ name: "tenants" })
export class Tenant extends BaseEntity {
  @Column({ unique: true })
  slug!: string;

  @Column()
  name!: string;

  @OneToMany(() => UserTenant, (membership) => membership.tenant)
  memberships!: UserTenant[];
}

