import "reflect-metadata";
import { AppDataSource, initializeDatabase } from "../src/config/data-source";
import { logger } from "../src/utils/logger";

async function checkDatabase() {
  try {
    console.log("🔍 Checking database connection...");
    await initializeDatabase();
    console.log("✅ Database connection successful!");

    // Check if tables exist
    console.log("\n📊 Checking tables...");
    const queryRunner = AppDataSource.createQueryRunner();
    
    const tables = [
      "users",
      "tenants",
      "user_tenants",
      "tenant_plans",
    ];

    for (const table of tables) {
      const exists = await queryRunner.hasTable(table);
      console.log(`  ${exists ? "✅" : "❌"} Table '${table}': ${exists ? "EXISTS" : "MISSING"}`);
    }

    // Check tenant_plans columns
    console.log("\n🔍 Checking tenant_plans columns...");
    const planColumns = await queryRunner.query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'tenant_plans'
      ORDER BY COLUMN_NAME
    `);
    
    console.log("  Columns in tenant_plans:");
    for (const col of planColumns) {
      const isImportant = ["allowed_features", "quotas", "key"].includes(col.COLUMN_NAME);
      const marker = isImportant ? "⭐" : "  ";
      console.log(`  ${marker} ${col.COLUMN_NAME} (${col.DATA_TYPE}, nullable: ${col.IS_NULLABLE})`);
    }

    // Check if allowed_features column exists
    const hasAllowedFeatures = planColumns.some((c: any) => c.COLUMN_NAME === "allowed_features");
    console.log(`\n  ${hasAllowedFeatures ? "✅" : "❌"} Column 'allowed_features': ${hasAllowedFeatures ? "EXISTS" : "MISSING"}`);

    // Check user_tenants structure
    console.log("\n🔍 Checking user_tenants columns...");
    const userTenantColumns = await queryRunner.query(`
      SELECT COLUMN_NAME, DATA_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'user_tenants'
      AND COLUMN_NAME IN ('user_id', 'tenant_id', 'role')
      ORDER BY COLUMN_NAME
    `);
    
    console.log("  Key columns in user_tenants:");
    for (const col of userTenantColumns) {
      console.log(`  ✅ ${col.COLUMN_NAME} (${col.DATA_TYPE})`);
    }

    // Check for sample data
    console.log("\n📦 Checking for data...");
    const userCount = await queryRunner.query("SELECT COUNT(*) as count FROM users");
    const tenantCount = await queryRunner.query("SELECT COUNT(*) as count FROM tenants");
    const membershipCount = await queryRunner.query("SELECT COUNT(*) as count FROM user_tenants");
    const planCount = await queryRunner.query("SELECT COUNT(*) as count FROM tenant_plans");

    console.log(`  Users: ${userCount[0].count}`);
    console.log(`  Tenants: ${tenantCount[0].count}`);
    console.log(`  User-Tenant memberships: ${membershipCount[0].count}`);
    console.log(`  Plans: ${planCount[0].count}`);

    // Check a sample user with membership
    console.log("\n👤 Checking sample user data...");
    const sampleUser = await queryRunner.query(`
      SELECT TOP 1 
        u.id, u.email,
        ut.role, ut.tenant_id,
        t.id as tenant_id, t.name as tenant_name, t.plan_key
      FROM users u
      LEFT JOIN user_tenants ut ON u.id = ut.user_id
      LEFT JOIN tenants t ON ut.tenant_id = t.id
      ORDER BY u.createdAt
    `);

    if (sampleUser.length > 0) {
      const user = sampleUser[0];
      console.log(`  ✅ Found user: ${user.email}`);
      console.log(`     Role: ${user.role || "N/A"}`);
      console.log(`     Tenant: ${user.tenant_name || "N/A"} (${user.tenant_id || "N/A"})`);
      console.log(`     Plan Key: ${user.plan_key || "N/A"}`);
      
      // Check if plan exists for this tenant
      if (user.plan_key) {
        const plan = await queryRunner.query(`
          SELECT id, key, name, allowed_features
          FROM tenant_plans
          WHERE key = @p0
        `, [user.plan_key]);
        
        if (plan.length > 0) {
          console.log(`     ✅ Plan found: ${plan[0].name}`);
          const allowedFeatures = plan[0].allowed_features;
          if (allowedFeatures) {
            try {
              const parsed = typeof allowedFeatures === 'string' ? JSON.parse(allowedFeatures) : allowedFeatures;
              console.log(`     ✅ allowed_features is valid JSON with ${Object.keys(parsed).length} features`);
            } catch (e) {
              console.log(`     ⚠️  allowed_features exists but is not valid JSON`);
            }
          } else {
            console.log(`     ⚠️  allowed_features is NULL`);
          }
        } else {
          console.log(`     ❌ Plan with key '${user.plan_key}' NOT FOUND`);
        }
      }
    } else {
      console.log("  ⚠️  No users found in database");
    }

    await queryRunner.release();
    console.log("\n✅ Database check complete!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Database check failed:");
    console.error(error);
    if (error instanceof Error) {
      console.error("Stack:", error.stack);
    }
    process.exit(1);
  }
}

checkDatabase();

