import { MigrationInterface, QueryRunner } from "typeorm";

export class AddToolAccessToUserTenant20251114030000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      IF NOT EXISTS (
        SELECT 1 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'user_tenants' 
        AND COLUMN_NAME = 'toolAccess'
      )
      BEGIN
        ALTER TABLE "user_tenants"
        ADD "toolAccess" nvarchar(MAX) NULL
      END
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      IF EXISTS (
        SELECT 1 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'user_tenants' 
        AND COLUMN_NAME = 'toolAccess'
      )
      BEGIN
        ALTER TABLE "user_tenants"
        DROP COLUMN "toolAccess"
      END
    `);
  }
}


