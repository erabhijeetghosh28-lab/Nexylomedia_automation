import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from "typeorm";

export class CreateFeatureFlagAuditTable20251115040000
  implements MigrationInterface
{
  name = "CreateFeatureFlagAuditTable20251115040000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
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
      }),
    );

    // Add foreign keys
    await queryRunner.createForeignKey(
      "feature_flag_audit",
      new TableForeignKey({
        columnNames: ["tenant_id"],
        referencedTableName: "tenants",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "feature_flag_audit",
      new TableForeignKey({
        columnNames: ["enabled_by_user_id"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
      }),
    );

    // Create indexes
    await queryRunner.createIndex(
      "feature_flag_audit",
      new TableIndex({
        name: "IDX_feature_flag_audit_tenant_flag",
        columnNames: ["tenant_id", "flag_key"],
      }),
    );

    await queryRunner.createIndex(
      "feature_flag_audit",
      new TableIndex({
        name: "IDX_feature_flag_audit_enabled_at",
        columnNames: ["enabled_at"],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      "feature_flag_audit",
      "IDX_feature_flag_audit_enabled_at",
    );
    await queryRunner.dropIndex(
      "feature_flag_audit",
      "IDX_feature_flag_audit_tenant_flag",
    );
    await queryRunner.dropTable("feature_flag_audit");
  }
}

