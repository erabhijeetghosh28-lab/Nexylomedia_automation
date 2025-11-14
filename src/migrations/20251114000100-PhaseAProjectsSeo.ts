import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
} from "typeorm";

export class PhaseAProjectsSeo20251114000100 implements MigrationInterface {
  name = "PhaseAProjectsSeo20251114000100";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTenants = await queryRunner.hasTable("tenants");
    if (!hasTenants) {
      await queryRunner.createTable(
        new Table({
          name: "tenants",
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
              name: "slug",
              type: "nvarchar",
              length: "255",
              isUnique: true,
            },
            {
              name: "name",
              type: "nvarchar",
              length: "255",
            },
          ],
        }),
      );
    }

    const hasUsers = await queryRunner.hasTable("users");
    if (!hasUsers) {
      await queryRunner.createTable(
        new Table({
          name: "users",
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
              name: "email",
              type: "nvarchar",
              length: "320",
            },
            {
              name: "passwordHash",
              type: "nvarchar",
              length: "255",
            },
            {
              name: "displayName",
              type: "nvarchar",
              length: "255",
              isNullable: true,
            },
          ],
          uniques: [
            {
              name: "UQ_users_email",
              columnNames: ["email"],
            },
          ],
        }),
      );
    }

    const hasUserTenants = await queryRunner.hasTable("user_tenants");
    if (!hasUserTenants) {
      await queryRunner.createTable(
        new Table({
          name: "user_tenants",
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
              name: "user_id",
              type: "uniqueidentifier",
            },
            {
              name: "tenant_id",
              type: "uniqueidentifier",
            },
            {
              name: "role",
              type: "nvarchar",
              length: "32",
            },
          ],
          uniques: [
            {
              name: "UQ_user_tenant_user_tenant",
              columnNames: ["user_id", "tenant_id"],
            },
          ],
          foreignKeys: [
            {
              columnNames: ["user_id"],
              referencedTableName: "users",
              referencedColumnNames: ["id"],
              onDelete: "CASCADE",
            },
            {
              columnNames: ["tenant_id"],
              referencedTableName: "tenants",
              referencedColumnNames: ["id"],
              onDelete: "CASCADE",
            },
          ],
        }),
      );
    }

    await queryRunner.createTable(
      new Table({
        name: "projects",
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
            name: "created_by_id",
            type: "uniqueidentifier",
          },
          {
            name: "name",
            type: "nvarchar",
            length: "120",
          },
          {
            name: "slug",
            type: "nvarchar",
            length: "160",
          },
          {
            name: "status",
            type: "nvarchar",
            length: "20",
            default: "'active'",
          },
          {
            name: "description",
            type: "nvarchar",
            length: "512",
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ["tenant_id"],
            referencedTableName: "tenants",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
          {
            columnNames: ["created_by_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "NO ACTION",
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      "projects",
      new TableIndex({
        name: "IDX_projects_tenant_slug",
        columnNames: ["tenant_id", "slug"],
        isUnique: true,
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: "project_domains",
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
            name: "project_id",
            type: "uniqueidentifier",
          },
          {
            name: "host",
            type: "nvarchar",
            length: "255",
          },
          {
            name: "status",
            type: "nvarchar",
            length: "20",
            default: "'pending'",
          },
          {
            name: "isPrimary",
            type: "bit",
            default: 0,
          },
          {
            name: "verificationToken",
            type: "nvarchar",
            length: "64",
            isNullable: true,
          },
          {
            name: "submitted_by_id",
            type: "uniqueidentifier",
          },
          {
            name: "approved_by_id",
            type: "uniqueidentifier",
            isNullable: true,
          },
          {
            name: "approvedAt",
            type: "datetime2",
            isNullable: true,
          },
          {
            name: "notes",
            type: "nvarchar",
            length: "512",
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ["project_id"],
            referencedTableName: "projects",
            referencedColumnNames: ["id"],
            onDelete: "NO ACTION",
          },
          {
            columnNames: ["submitted_by_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "NO ACTION",
          },
          {
            columnNames: ["approved_by_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "SET NULL",
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      "project_domains",
      new TableIndex({
        name: "IDX_project_domains_project_host",
        columnNames: ["project_id", "host"],
        isUnique: true,
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: "site_pages",
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
            name: "project_id",
            type: "uniqueidentifier",
          },
          {
            name: "domain_id",
            type: "uniqueidentifier",
            isNullable: true,
          },
          {
            name: "fullUrl",
            type: "nvarchar",
            length: "2048",
          },
          {
            name: "urlPath",
            type: "nvarchar",
            length: "1024",
          },
          {
            name: "status",
            type: "nvarchar",
            length: "16",
            default: "'discovered'",
          },
          {
            name: "origin",
            type: "nvarchar",
            length: "16",
            default: "'sitemap'",
          },
          {
            name: "httpStatus",
            type: "int",
            isNullable: true,
          },
          {
            name: "checksum",
            type: "nvarchar",
            length: "64",
            isNullable: true,
          },
          {
            name: "lastDiscoveredAt",
            type: "datetime2",
            isNullable: true,
          },
          {
            name: "lastCrawledAt",
            type: "datetime2",
            isNullable: true,
          },
          {
            name: "isIndexed",
            type: "bit",
            default: 1,
          },
          {
            name: "metadata",
            type: "nvarchar",
            length: "MAX",
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ["project_id"],
            referencedTableName: "projects",
            referencedColumnNames: ["id"],
            onDelete: "NO ACTION",
          },
          {
            columnNames: ["domain_id"],
            referencedTableName: "project_domains",
            referencedColumnNames: ["id"],
            onDelete: "SET NULL",
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      "site_pages",
      new TableIndex({
        name: "IDX_site_pages_project_full_url",
        columnNames: ["project_id", "fullUrl"],
        isUnique: true,
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: "seo_audits",
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
            name: "project_id",
            type: "uniqueidentifier",
          },
          {
            name: "page_id",
            type: "uniqueidentifier",
            isNullable: true,
          },
          {
            name: "type",
            type: "nvarchar",
            length: "20",
          },
          {
            name: "status",
            type: "nvarchar",
            length: "20",
            default: "'pending'",
          },
          {
            name: "trigger",
            type: "nvarchar",
            length: "20",
            default: "'manual'",
          },
          {
            name: "runner",
            type: "nvarchar",
            length: "10",
            default: "'mock'",
          },
          {
            name: "score",
            type: "decimal",
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: "summary",
            type: "nvarchar",
            length: "512",
            isNullable: true,
          },
          {
            name: "rawResult",
            type: "nvarchar",
            length: "MAX",
            isNullable: true,
          },
          {
            name: "jobId",
            type: "nvarchar",
            length: "128",
            isNullable: true,
          },
          {
            name: "startedAt",
            type: "datetime2",
            isNullable: true,
          },
          {
            name: "completedAt",
            type: "datetime2",
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ["project_id"],
            referencedTableName: "projects",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
          {
            columnNames: ["page_id"],
            referencedTableName: "site_pages",
            referencedColumnNames: ["id"],
            onDelete: "SET NULL",
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      "seo_audits",
      new TableIndex({
        name: "IDX_seo_audits_project_type_status",
        columnNames: ["project_id", "type", "status"],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: "seo_issues",
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
            name: "audit_id",
            type: "uniqueidentifier",
          },
          {
            name: "code",
            type: "nvarchar",
            length: "128",
          },
          {
            name: "severity",
            type: "nvarchar",
            length: "16",
            default: "'medium'",
          },
          {
            name: "category",
            type: "nvarchar",
            length: "20",
            default: "'performance'",
          },
          {
            name: "description",
            type: "nvarchar",
            length: "512",
          },
          {
            name: "metricValue",
            type: "decimal",
            precision: 10,
            scale: 4,
            isNullable: true,
          },
          {
            name: "threshold",
            type: "decimal",
            precision: 10,
            scale: 4,
            isNullable: true,
          },
          {
            name: "recommendation",
            type: "nvarchar",
            length: "1024",
            isNullable: true,
          },
          {
            name: "status",
            type: "nvarchar",
            length: "16",
            default: "'open'",
          },
          {
            name: "resolvedAt",
            type: "datetime2",
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ["audit_id"],
            referencedTableName: "seo_audits",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      "seo_issues",
      new TableIndex({
        name: "IDX_seo_issues_audit_code",
        columnNames: ["audit_id", "code"],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: "seo_fixes",
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
            name: "issue_id",
            type: "uniqueidentifier",
          },
          {
            name: "provider",
            type: "nvarchar",
            length: "16",
          },
          {
            name: "content",
            type: "nvarchar",
            length: "MAX",
          },
          {
            name: "created_by_id",
            type: "uniqueidentifier",
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ["issue_id"],
            referencedTableName: "seo_issues",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
          {
            columnNames: ["created_by_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "SET NULL",
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("seo_fixes");
    await queryRunner.dropIndex("seo_issues", "IDX_seo_issues_audit_code");
    await queryRunner.dropTable("seo_issues");
    await queryRunner.dropIndex(
      "seo_audits",
      "IDX_seo_audits_project_type_status",
    );
    await queryRunner.dropTable("seo_audits");
    await queryRunner.dropIndex(
      "site_pages",
      "IDX_site_pages_project_full_url",
    );
    await queryRunner.dropTable("site_pages");
    await queryRunner.dropIndex(
      "project_domains",
      "IDX_project_domains_project_host",
    );
    await queryRunner.dropTable("project_domains");
    await queryRunner.dropIndex("projects", "IDX_projects_tenant_slug");
    await queryRunner.dropTable("projects");
  }
}


