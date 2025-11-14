"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFeatureFlagAuditTable20251115040000 = void 0;
const typeorm_1 = require("typeorm");
class CreateFeatureFlagAuditTable20251115040000 {
    name = "CreateFeatureFlagAuditTable20251115040000";
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "feature_flag_audit",
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
                    name: "flag_key",
                    type: "nvarchar",
                    length: "128",
                },
                {
                    name: "enabled_by_user_id",
                    type: "uniqueidentifier",
                    isNullable: true,
                },
                {
                    name: "enabled_at",
                    type: "datetime2",
                    default: "GETDATE()",
                },
                {
                    name: "reason",
                    type: "nvarchar",
                    length: "MAX",
                    isNullable: true,
                },
            ],
        }));
        // Add foreign keys
        await queryRunner.createForeignKey("feature_flag_audit", new typeorm_1.TableForeignKey({
            columnNames: ["tenant_id"],
            referencedTableName: "tenants",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
        }));
        await queryRunner.createForeignKey("feature_flag_audit", new typeorm_1.TableForeignKey({
            columnNames: ["enabled_by_user_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "SET NULL",
        }));
        // Create indexes
        await queryRunner.createIndex("feature_flag_audit", new typeorm_1.TableIndex({
            name: "IDX_feature_flag_audit_tenant_flag",
            columnNames: ["tenant_id", "flag_key"],
        }));
        await queryRunner.createIndex("feature_flag_audit", new typeorm_1.TableIndex({
            name: "IDX_feature_flag_audit_enabled_at",
            columnNames: ["enabled_at"],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropIndex("feature_flag_audit", "IDX_feature_flag_audit_enabled_at");
        await queryRunner.dropIndex("feature_flag_audit", "IDX_feature_flag_audit_tenant_flag");
        await queryRunner.dropTable("feature_flag_audit");
    }
}
exports.CreateFeatureFlagAuditTable20251115040000 = CreateFeatureFlagAuditTable20251115040000;
//# sourceMappingURL=20251115040000-CreateFeatureFlagAuditTable.js.map