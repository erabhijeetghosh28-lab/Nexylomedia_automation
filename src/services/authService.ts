import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { UserTenant, TenantRole } from "../entities/UserTenant";
import { createTenant } from "./tenantService";
import { hashPassword, verifyPassword } from "../utils/password";
import { signToken } from "../utils/token";
import { HttpError } from "../middleware/errorHandler";

const userRepository = () => AppDataSource.getRepository(User);
const membershipRepository = () => AppDataSource.getRepository(UserTenant);

export type AuthResponse = {
  token: string;
  user: User;
  tenantId?: string;
  role?: TenantRole;
};

export const signup = async (params: {
  email: string;
  password: string;
  tenantName: string;
  role?: TenantRole;
}): Promise<AuthResponse> => {
  const repo = userRepository();
  const existing = await repo.findOne({ where: { email: params.email } });
  if (existing) {
    throw new HttpError(409, "Email already registered");
  }

  const tenant = await createTenant(params.tenantName);
  const passwordHash = await hashPassword(params.password);
  const user = repo.create({
    email: params.email,
    passwordHash,
  });
  await repo.save(user);

  const membership = membershipRepository().create({
    user,
    tenant,
    role: params.role ?? "org_admin",
  });
  await membershipRepository().save(membership);

  const token = signToken({
    userId: user.id,
    tenantId: tenant.id,
    role: membership.role,
  });

  return { token, user, tenantId: tenant.id, role: membership.role };
};

export const login = async (params: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const repo = userRepository();
  const user = await repo.findOne({
    where: { email: params.email },
    relations: ["memberships", "memberships.tenant"],
  });
  if (!user) {
    throw new HttpError(401, "Invalid credentials");
  }

  const valid = await verifyPassword(params.password, user.passwordHash);
  if (!valid) {
    throw new HttpError(401, "Invalid credentials");
  }

  const primaryMembership = user.memberships?.[0];
  const token = signToken({
    userId: user.id,
    tenantId: primaryMembership?.tenant.id,
    role: primaryMembership?.role,
  });

  return {
    token,
    user,
    tenantId: primaryMembership?.tenant.id,
    role: primaryMembership?.role,
  };
};

