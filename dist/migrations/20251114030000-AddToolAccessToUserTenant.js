"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddToolAccessToUserTenant20251114030000 = void 0;
class AddToolAccessToUserTenant20251114030000 {
    async up(queryRunner) {
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
    async down(queryRunner) {
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
exports.AddToolAccessToUserTenant20251114030000 = AddToolAccessToUserTenant20251114030000;
//# sourceMappingURL=20251114030000-AddToolAccessToUserTenant.js.map