"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateIntegrationsTable20251115020000 = void 0;
const typeorm_1 = require("typeorm");
class CreateIntegrationsTable20251115020000 {
    name = "CreateIntegrationsTable20251115020000";
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "integrations",
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
                    isNullable: true,
                },
                {
                    name: "user_id",
                    type: "uniqueidentifier",
                    isNullable: true,
                },
                {
                    name: "provider",
                    type: "nvarchar",
                    length: "64",
                },
                {
                    name: "key_mask",
                    type: "nvarchar",
                    length: "128",
                },
                {
                    name: "secret_ref",
                    type: "nvarchar",
                    length: "512",
                },
                {
                    name: "scope",
                    type: "nvarchar",
                    length: "16",
                },
                {
                    name: "status",
                    type: "nvarchar",
                    length: "16",
                    default: "'untested'",
                },
                {
                    name: "config_json",
                    type: "nvarchar",
                    length: "MAX",
                    isNullable: true,
                },
            ],
        }));
        // Add foreign keys
        await queryRunner.createForeignKey("integrations", new typeorm_1.TableForeignKey({
            columnNames: ["tenant_id"],
            referencedTableName: "tenants",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
        }));
        await queryRunner.createForeignKey("integrations", new typeorm_1.TableForeignKey({
            columnNames: ["user_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
        }));
        // Create indexes
        await queryRunner.createIndex("integrations", new typeorm_1.TableIndex({
            name: "IDX_integrations_tenant_provider",
            columnNames: ["tenant_id", "provider"],
        }));
        await queryRunner.createIndex("integrations", new typeorm_1.TableIndex({
            name: "IDX_integrations_user_provider",
            columnNames: ["user_id", "provider"],
        }));
        // Ensure at least one of tenant_id or user_id is set
        await queryRunner.query(`
      ALTER TABLE "integrations"
      ADD CONSTRAINT "CK_integrations_tenant_or_user"
      CHECK (tenant_id IS NOT NULL OR user_id IS NOT NULL)
    `);
    }
    async down(queryRunner) {
        await queryRunner.dropIndex("integrations", "IDX_integrations_user_provider");
        await queryRunner.dropIndex("integrations", "IDX_integrations_tenant_provider");
        await queryRunner.query(`
      IF EXISTS (
        SELECT 1 
        FROM sys.check_constraints 
        WHERE name = 'CK_integrations_tenant_or_user'
      )
      BEGIN
        ALTER TABLE "integrations"
        DROP CONSTRAINT "CK_integrations_tenant_or_user"
      END
    `);
        await queryRunner.dropTable("integrations");
    }
}
exports.CreateIntegrationsTable20251115020000 = CreateIntegrationsTable20251115020000;
//# sourceMappingURL=20251115020000-CreateIntegrationsTable.js.map