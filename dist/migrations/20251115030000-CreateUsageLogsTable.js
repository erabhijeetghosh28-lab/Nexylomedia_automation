"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUsageLogsTable20251115030000 = void 0;
const typeorm_1 = require("typeorm");
class CreateUsageLogsTable20251115030000 {
    name = "CreateUsageLogsTable20251115030000";
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "usage_logs",
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
                    name: "metric_key",
                    type: "nvarchar",
                    length: "128",
                },
                {
                    name: "value",
                    type: "int",
                },
                {
                    name: "period_start",
                    type: "datetime2",
                },
                {
                    name: "period_end",
                    type: "datetime2",
                },
            ],
        }));
        // Add foreign key
        await queryRunner.createForeignKey("usage_logs", new typeorm_1.TableForeignKey({
            columnNames: ["tenant_id"],
            referencedTableName: "tenants",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
        }));
        // Create indexes for efficient queries
        await queryRunner.createIndex("usage_logs", new typeorm_1.TableIndex({
            name: "IDX_usage_logs_tenant_metric_period",
            columnNames: ["tenant_id", "metric_key", "period_start"],
        }));
        await queryRunner.createIndex("usage_logs", new typeorm_1.TableIndex({
            name: "IDX_usage_logs_tenant_period",
            columnNames: ["tenant_id", "period_start", "period_end"],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropIndex("usage_logs", "IDX_usage_logs_tenant_period");
        await queryRunner.dropIndex("usage_logs", "IDX_usage_logs_tenant_metric_period");
        await queryRunner.dropTable("usage_logs");
    }
}
exports.CreateUsageLogsTable20251115030000 = CreateUsageLogsTable20251115030000;
//# sourceMappingURL=20251115030000-CreateUsageLogsTable.js.map