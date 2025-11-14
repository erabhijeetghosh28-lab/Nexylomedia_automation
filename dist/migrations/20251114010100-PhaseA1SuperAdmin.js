"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhaseA1SuperAdmin20251114010100 = void 0;
const typeorm_1 = require("typeorm");
class PhaseA1SuperAdmin20251114010100 {
    name = "PhaseA1SuperAdmin20251114010100";
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "tenant_plans",
            columns: [
                {
                    name: "id",
                    type: "uniqueidentifier",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "uuid",
                    default: "NEWID()",
                },
                {
                    name: "createdAt",
                    type: "datetime2",
                    default: "GETDATE()",
                },
                {
                    name: "updatedAt",
                    type: "datetime2",
                    default: "GETDATE()",
                },
                {
                    name: "deletedAt",
                    type: "datetime2",
                    isNullable: true,
                },
                {
                    name: "code",
                    type: "nvarchar",
                    length: "64",
                },
                {
                    name: "name",
                    type: "nvarchar",
                    length: "120",
                },
                {
                    name: "description",
                    type: "nvarchar",
                    length: "512",
                    isNullable: true,
                },
                {
                    name: "monthlyPrice",
                    type: "decimal",
                    precision: 10,
                    scale: 2,
                    default: 0,
                },
                {
                    name: "annualPrice",
                    type: "decimal",
                    precision: 10,
                    scale: 2,
                    default: 0,
                },
                {
                    name: "currency",
                    type: "nvarchar",
                    length: "8",
                    default: "'USD'",
                },
                {
                    name: "isActive",
                    type: "bit",
                    default: 1,
                },
            ],
        }));
        await queryRunner.createIndex("tenant_plans", new typeorm_1.TableIndex({
            name: "IDX_tenant_plans_code",
            columnNames: ["code"],
            isUnique: true,
        }));
        await queryRunner.createTable(new typeorm_1.Table({
            name: "tenant_quotas",
            columns: [
                {
                    name: "id",
                    type: "uniqueidentifier",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "uuid",
                    default: "NEWID()",
                },
                {
                    name: "createdAt",
                    type: "datetime2",
                    default: "GETDATE()",
                },
                {
                    name: "updatedAt",
                    type: "datetime2",
                    default: "GETDATE()",
                },
                {
                    name: "deletedAt",
                    type: "datetime2",
                    isNullable: true,
                },
                {
                    name: "tenant_id",
                    type: "uniqueidentifier",
                },
                {
                    name: "plan_id",
                    type: "uniqueidentifier",
                    isNullable: true,
                },
                { name: "maxProjects", type: "int", isNullable: true },
                { name: "maxDomains", type: "int", isNullable: true },
                { name: "maxMembers", type: "int", isNullable: true },
                { name: "maxOrgAdmins", type: "int", isNullable: true },
                {
                    name: "maxAutomationsPerMonth",
                    type: "int",
                    isNullable: true,
                },
                { name: "featureFlags", type: "nvarchar", length: "MAX", isNullable: true },
                {
                    name: "billingStatus",
                    type: "nvarchar",
                    length: "16",
                    default: "'trial'",
                },
                { name: "trialEndsAt", type: "datetime2", isNullable: true },
                {
                    name: "currentPeriodEndsAt",
                    type: "datetime2",
                    isNullable: true,
                },
                { name: "notes", type: "nvarchar", length: "MAX", isNullable: true },
            ],
            foreignKeys: [
                {
                    columnNames: ["tenant_id"],
                    referencedTableName: "tenants",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
                {
                    columnNames: ["plan_id"],
                    referencedTableName: "tenant_plans",
                    referencedColumnNames: ["id"],
                    onDelete: "SET NULL",
                },
            ],
        }));
        await queryRunner.createIndex("tenant_quotas", new typeorm_1.TableIndex({
            name: "IDX_tenant_quotas_tenant_unique",
            columnNames: ["tenant_id"],
            isUnique: true,
        }));
        await queryRunner.createTable(new typeorm_1.Table({
            name: "tenant_usages",
            columns: [
                {
                    name: "id",
                    type: "uniqueidentifier",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "uuid",
                    default: "NEWID()",
                },
                {
                    name: "createdAt",
                    type: "datetime2",
                    default: "GETDATE()",
                },
                {
                    name: "updatedAt",
                    type: "datetime2",
                    default: "GETDATE()",
                },
                {
                    name: "deletedAt",
                    type: "datetime2",
                    isNullable: true,
                },
                {
                    name: "tenant_id",
                    type: "uniqueidentifier",
                },
                { name: "projectCount", type: "int", default: 0 },
                { name: "domainCount", type: "int", default: 0 },
                { name: "memberCount", type: "int", default: 0 },
                { name: "orgAdminCount", type: "int", default: 0 },
                { name: "automationRunsThisMonth", type: "int", default: 0 },
                { name: "lastCalculatedAt", type: "datetime2", isNullable: true },
            ],
            foreignKeys: [
                {
                    columnNames: ["tenant_id"],
                    referencedTableName: "tenants",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
            ],
        }));
        await queryRunner.createIndex("tenant_usages", new typeorm_1.TableIndex({
            name: "IDX_tenant_usages_tenant_unique",
            columnNames: ["tenant_id"],
            isUnique: true,
        }));
        await queryRunner.query(`
      INSERT INTO tenant_quotas (id, tenant_id, billingStatus, createdAt, updatedAt)
      SELECT NEWID(), id, 'trial', GETDATE(), GETDATE()
      FROM tenants
    `);
        await queryRunner.query(`
      INSERT INTO tenant_usages (
        id,
        tenant_id,
        projectCount,
        domainCount,
        memberCount,
        orgAdminCount,
        automationRunsThisMonth,
        lastCalculatedAt,
        createdAt,
        updatedAt
      )
      SELECT
        NEWID(),
        t.id,
        0,
        0,
        0,
        0,
        0,
        GETDATE(),
        GETDATE(),
        GETDATE()
      FROM tenants t
    `);
        await queryRunner.query(`
      UPDATE tu
      SET
        projectCount = counts.projectCount,
        domainCount = counts.domainCount,
        memberCount = counts.memberCount,
        orgAdminCount = counts.orgAdminCount,
        lastCalculatedAt = GETDATE()
      FROM tenant_usages tu
      CROSS APPLY (
        SELECT
          (SELECT COUNT(*) FROM projects p WHERE p.tenant_id = tu.tenant_id) AS projectCount,
          (
            SELECT COUNT(*)
            FROM project_domains pd
            INNER JOIN projects p ON pd.project_id = p.id
            WHERE p.tenant_id = tu.tenant_id
          ) AS domainCount,
          (
            SELECT COUNT(*)
            FROM user_tenants ut
            WHERE ut.tenant_id = tu.tenant_id AND ut.role = 'member'
          ) AS memberCount,
          (
            SELECT COUNT(*)
            FROM user_tenants ut
            WHERE ut.tenant_id = tu.tenant_id AND ut.role = 'org_admin'
          ) AS orgAdminCount
      ) counts
    `);
    }
    async down(queryRunner) {
        await queryRunner.dropIndex("tenant_usages", "IDX_tenant_usages_tenant_unique");
        await queryRunner.dropTable("tenant_usages");
        await queryRunner.dropIndex("tenant_quotas", "IDX_tenant_quotas_tenant_unique");
        await queryRunner.dropTable("tenant_quotas");
        await queryRunner.dropIndex("tenant_plans", "IDX_tenant_plans_code");
        await queryRunner.dropTable("tenant_plans");
    }
}
exports.PhaseA1SuperAdmin20251114010100 = PhaseA1SuperAdmin20251114010100;
//# sourceMappingURL=20251114010100-PhaseA1SuperAdmin.js.map