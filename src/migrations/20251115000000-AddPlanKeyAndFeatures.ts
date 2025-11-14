import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPlanKeyAndFeatures20251115000000 implements MigrationInterface {
  name = "AddPlanKeyAndFeatures20251115000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add key column to tenant_plans (unique identifier)
    await queryRunner.query(`
      IF NOT EXISTS (
        SELECT 1 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'tenant_plans' 
        AND COLUMN_NAME = 'key'
      )
      BEGIN
        ALTER TABLE "tenant_plans"
        ADD "key" nvarchar(64) NULL
      END
    `);

    // Add allowed_features JSON to tenant_plans
    await queryRunner.query(`
      IF NOT EXISTS (
        SELECT 1 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'tenant_plans' 
        AND COLUMN_NAME = 'allowed_features'
      )
      BEGIN
        ALTER TABLE "tenant_plans"
        ADD "allowed_features" nvarchar(MAX) NULL
      END
    `);

    // Add quotas JSON to tenant_plans
    await queryRunner.query(`
      IF NOT EXISTS (
        SELECT 1 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'tenant_plans' 
        AND COLUMN_NAME = 'quotas'
      )
      BEGIN
        ALTER TABLE "tenant_plans"
        ADD "quotas" nvarchar(MAX) NULL
      END
    `);

    // Create unique constraint on key (required for foreign key)
    await queryRunner.query(`
      IF NOT EXISTS (
        SELECT 1 
        FROM sys.indexes 
        WHERE name = 'UQ_tenant_plans_key' 
        AND object_id = OBJECT_ID('tenant_plans')
      )
      BEGIN
        CREATE UNIQUE INDEX "UQ_tenant_plans_key" ON "tenant_plans" ("key")
        WHERE "key" IS NOT NULL
      END
    `);

    // Add plan_key to tenants
    await queryRunner.query(`
      IF NOT EXISTS (
        SELECT 1 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'tenants' 
        AND COLUMN_NAME = 'plan_key'
      )
      BEGIN
        ALTER TABLE "tenants"
        ADD "plan_key" nvarchar(64) NULL
      END
    `);

    // Add features_json to tenants
    await queryRunner.query(`
      IF NOT EXISTS (
        SELECT 1 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'tenants' 
        AND COLUMN_NAME = 'features_json'
      )
      BEGIN
        ALTER TABLE "tenants"
        ADD "features_json" nvarchar(MAX) NULL
      END
    `);

    // Note: Foreign key constraint removed because SQL Server doesn't support
    // foreign keys on filtered unique indexes (WHERE key IS NOT NULL).
    // The relationship is enforced in application code via planService.
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Foreign key was not created, so nothing to drop

    // Drop columns from tenants
    await queryRunner.query(`
      IF EXISTS (
        SELECT 1 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'tenants' 
        AND COLUMN_NAME = 'features_json'
      )
      BEGIN
        ALTER TABLE "tenants"
        DROP COLUMN "features_json"
      END
    `);

    await queryRunner.query(`
      IF EXISTS (
        SELECT 1 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'tenants' 
        AND COLUMN_NAME = 'plan_key'
      )
      BEGIN
        ALTER TABLE "tenants"
        DROP COLUMN "plan_key"
      END
    `);

    // Drop index
    await queryRunner.query(`
      IF EXISTS (
        SELECT 1 
        FROM sys.indexes 
        WHERE name = 'UQ_tenant_plans_key' 
        AND object_id = OBJECT_ID('tenant_plans')
      )
      BEGIN
        DROP INDEX "UQ_tenant_plans_key" ON "tenant_plans"
      END
    `);

    // Drop columns from tenant_plans
    await queryRunner.query(`
      IF EXISTS (
        SELECT 1 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'tenant_plans' 
        AND COLUMN_NAME = 'quotas'
      )
      BEGIN
        ALTER TABLE "tenant_plans"
        DROP COLUMN "quotas"
      END
    `);

    await queryRunner.query(`
      IF EXISTS (
        SELECT 1 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'tenant_plans' 
        AND COLUMN_NAME = 'allowed_features'
      )
      BEGIN
        ALTER TABLE "tenant_plans"
        DROP COLUMN "allowed_features"
      END
    `);

    await queryRunner.query(`
      IF EXISTS (
        SELECT 1 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'tenant_plans' 
        AND COLUMN_NAME = 'key'
      )
      BEGIN
        ALTER TABLE "tenant_plans"
        DROP COLUMN "key"
      END
    `);
  }
}

