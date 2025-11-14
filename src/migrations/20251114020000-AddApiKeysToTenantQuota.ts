import { MigrationInterface, QueryRunner } from "typeorm";

export class AddApiKeysToTenantQuota20251114020000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Use raw SQL to check and add column - avoids schema introspection timeout
    await queryRunner.query(`
      IF NOT EXISTS (
        SELECT 1 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'tenant_quotas' 
        AND COLUMN_NAME = 'apiKeys'
      )
      BEGIN
        ALTER TABLE "tenant_quotas"
        ADD "apiKeys" nvarchar(MAX) NULL
      END
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Use raw SQL to check and drop column
    await queryRunner.query(`
      IF EXISTS (
        SELECT 1 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'tenant_quotas' 
        AND COLUMN_NAME = 'apiKeys'
      )
      BEGIN
        ALTER TABLE "tenant_quotas"
        DROP COLUMN "apiKeys"
      END
    `);
  }
}

