"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddApiKeysToTenantQuota20251114020000 = void 0;
class AddApiKeysToTenantQuota20251114020000 {
    async up(queryRunner) {
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
    async down(queryRunner) {
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
exports.AddApiKeysToTenantQuota20251114020000 = AddApiKeysToTenantQuota20251114020000;
//# sourceMappingURL=20251114020000-AddApiKeysToTenantQuota.js.map