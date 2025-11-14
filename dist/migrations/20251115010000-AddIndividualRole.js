"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddIndividualRole20251115010000 = void 0;
class AddIndividualRole20251115010000 {
    name = "AddIndividualRole20251115010000";
    async up(queryRunner) {
        // Update user_tenants.role column to allow 'individual'
        // In SQL Server, we need to alter the column type if it's a CHECK constraint
        // Since it's nvarchar(32), we just need to ensure it accepts the new value
        // The constraint will be enforced at the application level via TypeORM enum
        // No SQL changes needed - nvarchar(32) already supports any string value
        // The enum constraint is enforced by TypeORM, not the database
    }
    async down(queryRunner) {
        // No SQL changes needed - removing enum values doesn't require DB changes
        // Just ensure no 'individual' roles exist before rolling back
    }
}
exports.AddIndividualRole20251115010000 = AddIndividualRole20251115010000;
//# sourceMappingURL=20251115010000-AddIndividualRole.js.map