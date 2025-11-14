import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { UserTenant, TenantRole } from "../entities/UserTenant";
import { Tenant } from "../entities/Tenant";
import { createTenant } from "./tenantService";
import { hashPassword, verifyPassword } from "../utils/password";
import { signToken, TokenPayload } from "../utils/token";
import { HttpError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";

// Helper to derive scopes from plan and tenant overrides
const deriveScopesFromPlan = (
  tenant: Tenant | null,
): string[] => {
  if (!tenant || !tenant.plan) {
    return [];
  }

  const scopes: string[] = [];
  const plan = tenant.plan;

  // Get enabled features from plan
  // Handle both parsed JSON objects and string values
  let allowedFeatures = plan.allowedFeatures;
  if (allowedFeatures && typeof allowedFeatures === 'string') {
    try {
      allowedFeatures = JSON.parse(allowedFeatures);
    } catch (e) {
      logger.warn("Failed to parse allowedFeatures as JSON: %s", e);
      allowedFeatures = null;
    }
  }
  
  if (allowedFeatures && typeof allowedFeatures === 'object') {
    for (const [feature, enabled] of Object.entries(allowedFeatures)) {
      if (enabled === true) {
        scopes.push(feature);
      }
    }
  }

  // Apply tenant overrides
  if (tenant.featuresJson) {
    for (const [feature, enabled] of Object.entries(tenant.featuresJson)) {
      if (enabled === true && !scopes.includes(feature)) {
        scopes.push(feature);
      } else if (enabled === false) {
        const index = scopes.indexOf(feature);
        if (index > -1) {
          scopes.splice(index, 1);
        }
      }
    }
  }

  return scopes;
};

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

  // Load tenant with plan for scopes
  const tenantRepo = AppDataSource.getRepository(Tenant);
  const fullTenant = await tenantRepo.findOne({
    where: { id: tenant.id },
    relations: ["plan"],
  });

  const payload: TokenPayload = { userId: user.id };
  if (tenant.id) {
    payload.tenantId = tenant.id;
  }
  if (membership.role) {
    payload.role = membership.role;
  }
  
  // Derive scopes from plan
  if (fullTenant) {
    payload.scopes = deriveScopesFromPlan(fullTenant);
  }

  const token = signToken(payload);

  return {
    token,
    user,
    tenantId: tenant.id,
    role: membership.role,
  };
};

export const login = async (params: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  try {
    logger.info("Login attempt for email: %s", params.email);
    const repo = userRepository();
    const membershipRepo = membershipRepository();
    
    // First find user without relations to avoid potential timeout
    const user = await repo.findOne({
      where: { email: params.email.toLowerCase() },
    });
    if (!user) {
      logger.warn("Login failed: User not found for email: %s", params.email);
      throw new HttpError(401, "Invalid credentials");
    }

    logger.info("User found: %s", user.id);
    const valid = await verifyPassword(params.password, user.passwordHash);
    if (!valid) {
      logger.warn("Login failed: Invalid password for user: %s", user.id);
      throw new HttpError(401, "Invalid credentials");
    }
    logger.info("Password verified for user: %s", user.id);

    // Then find membership separately
    // Note: UserTenant has eager:true on user and tenant which can cause circular loading
    // Get membership data using raw query to avoid eager loading, then load tenant separately
    logger.info("Querying membership for user: %s", user.id);
    let membershipResult: any;
    let membershipRole: TenantRole;
    let tenantId: string | null;
    
    try {
      membershipResult = await membershipRepo
        .createQueryBuilder("membership")
        .select("membership.id", "id")
        .addSelect("membership.role", "role")
        .addSelect("membership.tenant_id", "tenant_id")
        .where("membership.user_id = :userId", { userId: user.id })
        .orderBy("membership.createdAt", "ASC")
        .getRawOne();

      if (!membershipResult) {
        logger.warn("No membership found for user: %s", user.id);
        throw new HttpError(403, "User is not associated with any tenant");
      }

      logger.info("Membership found: %j", membershipResult);
      
      // Extract data from raw result (using the aliases we defined)
      // TypeORM getRawOne returns columns with the alias names we specified
      membershipRole = membershipResult.role as TenantRole;
      tenantId = membershipResult.tenant_id as string | null;
      
      logger.info("Extracted membership data: role=%s, tenantId=%s", membershipRole, tenantId);
    } catch (queryError) {
      logger.error("Error querying membership: %s", (queryError as Error).message, {
        error: queryError instanceof Error ? queryError.stack : queryError,
        userId: user.id,
      });
      // Re-throw HttpError, but wrap other errors
      if (queryError instanceof HttpError) {
        throw queryError;
      }
      throw new HttpError(500, "Failed to retrieve user membership");
    }

    // Load tenant with plan separately using the tenant_id to avoid circular loading
    let tenantWithPlan: Tenant | null = null;
    
    if (tenantId) {
      try {
        // Load the tenant entity - use findOne which should work now that we fixed column mappings
        const tenantRepo = AppDataSource.getRepository(Tenant);
        tenantWithPlan = await tenantRepo.findOne({
          where: { id: tenantId },
        });
        
        if (!tenantWithPlan) {
          throw new HttpError(404, "Tenant not found");
        }
        
        // Load plan relation separately to avoid eager loading issues
        // The plan relation uses plan_key as the foreign key column
        try {
          const tenantWithPlanRelation = await tenantRepo
            .createQueryBuilder("tenant")
            .leftJoinAndSelect("tenant.plan", "plan")
            .where("tenant.id = :tenantId", { tenantId })
            .getOne();
          
          if (tenantWithPlanRelation?.plan) {
            // Assign the plan to tenantWithPlan
            (tenantWithPlan as any).plan = tenantWithPlanRelation.plan;
            logger.info("Plan loaded for tenant: %s, plan key: %s", tenantId, tenantWithPlanRelation.plan.key);
          } else {
            logger.info("No plan found for tenant: %s", tenantId);
          }
        } catch (planError) {
          logger.error("Error loading plan relation: %s", (planError as Error).message, {
            error: planError instanceof Error ? planError.stack : planError,
            tenantId,
          });
          // Continue without plan if loading fails
        }
      } catch (tenantError) {
        logger.error("Error loading tenant: %s", (tenantError as Error).message, {
          error: tenantError instanceof Error ? tenantError.stack : tenantError,
          tenantId,
        });
        throw new HttpError(500, "Failed to load tenant information");
      }
    }

    const payload: TokenPayload = { userId: user.id };
    if (tenantWithPlan?.id) {
      payload.tenantId = tenantWithPlan.id;
    } else if (membershipRole === "individual") {
      // Individual users may not have a tenant
      payload.tenantId = null;
    }
    if (membershipRole) {
      payload.role = membershipRole;
    }

    // Derive scopes from plan
    if (tenantWithPlan) {
      try {
        payload.scopes = deriveScopesFromPlan(tenantWithPlan);
      } catch (scopeError) {
        logger.error("Error deriving scopes from plan: %s", (scopeError as Error).message, {
          error: scopeError instanceof Error ? scopeError.stack : scopeError,
          tenantId: tenantWithPlan.id,
        });
        // Continue without scopes if derivation fails
        payload.scopes = [];
      }
    }

    logger.info("Creating token for user: %s, tenant: %s, role: %s", user.id, payload.tenantId, payload.role);
    const token = signToken(payload);

    // Return user without passwordHash and relations
    // Create a clean user object to avoid serialization issues
    const userResponse: User = {
      id: user.id,
      email: user.email,
      displayName: user.displayName || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      passwordHash: "", // Don't expose password hash
    };

    logger.info("Login successful for user: %s", user.id);
    return {
      token,
      user: userResponse,
      ...(tenantWithPlan?.id
        ? { tenantId: tenantWithPlan.id }
        : {}),
      ...(membershipRole ? { role: membershipRole } : {}),
    };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    // Log unexpected errors for debugging
    logger.error("Login error: %s", error instanceof Error ? error.message : String(error), {
      error: error instanceof Error ? error.stack : error,
    });
    throw new HttpError(500, "Internal server error during login");
  }
};

