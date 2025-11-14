import "reflect-metadata";
import path from "path";
import { config as loadEnv } from "dotenv";
import { AppDataSource } from "../src/config/data-source";
import { User } from "../src/entities/User";
import { Tenant } from "../src/entities/Tenant";
import { UserTenant } from "../src/entities/UserTenant";
import { ensureQuotaAndUsage } from "../src/services/quotaService";
import { hashPassword } from "../src/utils/password";

loadEnv({
  path: path.resolve(process.cwd(), ".env"),
});

const email = process.env.SUPER_ADMIN_EMAIL ?? "owner@nexylomedia.com";
const password =
  process.env.SUPER_ADMIN_PASSWORD ?? "SuperAdmin@25";
const tenantSlug = process.env.SUPER_ADMIN_TENANT_SLUG ?? "platform-hq";
const tenantName = process.env.SUPER_ADMIN_TENANT_NAME ?? "Platform HQ";

async function main() {
  await AppDataSource.initialize();
  const userRepo = AppDataSource.getRepository(User);
  const tenantRepo = AppDataSource.getRepository(Tenant);
  const membershipRepo = AppDataSource.getRepository(UserTenant);

  let user = await userRepo.findOne({ where: { email } });
  const passwordHash = await hashPassword(password);

  if (!user) {
    user = userRepo.create({ email, passwordHash });
  } else {
    user.passwordHash = passwordHash;
  }
  await userRepo.save(user);

  let tenant = await tenantRepo.findOne({ where: { slug: tenantSlug } });
  if (!tenant) {
    tenant = tenantRepo.create({ name: tenantName, slug: tenantSlug });
    tenant = await tenantRepo.save(tenant);
  }

  await ensureQuotaAndUsage(tenant);

  let membership = await membershipRepo.findOne({
    where: { user: { id: user.id }, tenant: { id: tenant.id } },
  });
  if (!membership) {
    membership = membershipRepo.create({
      user,
      tenant,
      role: "super_admin",
    });
  } else {
    membership.role = "super_admin";
  }
  await membershipRepo.save(membership);

  console.log("Super admin ready");
  console.log("Email:", email);
  console.log("Password:", password);
  console.log("Tenant:", tenant.slug);

  await AppDataSource.destroy();
}

main().catch((error) => {
  console.error("Failed to create super admin:", error);
  process.exit(1);
});



