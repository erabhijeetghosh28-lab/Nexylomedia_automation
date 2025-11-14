"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const data_source_1 = require("../config/data-source");
const User_1 = require("../entities/User");
const UserTenant_1 = require("../entities/UserTenant");
const Tenant_1 = require("../entities/Tenant");
const tenantService_1 = require("./tenantService");
const password_1 = require("../utils/password");
const token_1 = require("../utils/token");
const errorHandler_1 = require("../middleware/errorHandler");
// Helper to derive scopes from plan and tenant overrides
const deriveScopesFromPlan = (tenant) => {
    if (!tenant || !tenant.plan) {
        return [];
    }
    const scopes = [];
    const plan = tenant.plan;
    // Get enabled features from plan
    if (plan.allowedFeatures) {
        for (const [feature, enabled] of Object.entries(plan.allowedFeatures)) {
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
            }
            else if (enabled === false) {
                const index = scopes.indexOf(feature);
                if (index > -1) {
                    scopes.splice(index, 1);
                }
            }
        }
    }
    return scopes;
};
const userRepository = () => data_source_1.AppDataSource.getRepository(User_1.User);
const membershipRepository = () => data_source_1.AppDataSource.getRepository(UserTenant_1.UserTenant);
const signup = async (params) => {
    const repo = userRepository();
    const existing = await repo.findOne({ where: { email: params.email } });
    if (existing) {
        throw new errorHandler_1.HttpError(409, "Email already registered");
    }
    const tenant = await (0, tenantService_1.createTenant)(params.tenantName);
    const passwordHash = await (0, password_1.hashPassword)(params.password);
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
    const tenantRepo = data_source_1.AppDataSource.getRepository(Tenant_1.Tenant);
    const fullTenant = await tenantRepo.findOne({
        where: { id: tenant.id },
        relations: ["plan"],
    });
    const payload = { userId: user.id };
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
    const token = (0, token_1.signToken)(payload);
    return {
        token,
        user,
        tenantId: tenant.id,
        role: membership.role,
    };
};
exports.signup = signup;
const login = async (params) => {
    try {
        const repo = userRepository();
        const membershipRepo = membershipRepository();
        // First find user without relations to avoid potential timeout
        const user = await repo.findOne({
            where: { email: params.email.toLowerCase() },
        });
        if (!user) {
            throw new errorHandler_1.HttpError(401, "Invalid credentials");
        }
        const valid = await (0, password_1.verifyPassword)(params.password, user.passwordHash);
        if (!valid) {
            throw new errorHandler_1.HttpError(401, "Invalid credentials");
        }
        // Then find membership separately
        const primaryMembership = await membershipRepo.findOne({
            where: { user: { id: user.id } },
            relations: ["tenant", "tenant.plan"],
            order: { createdAt: "ASC" },
        });
        if (!primaryMembership) {
            throw new errorHandler_1.HttpError(403, "User is not associated with any tenant");
        }
        const payload = { userId: user.id };
        if (primaryMembership.tenant?.id) {
            payload.tenantId = primaryMembership.tenant.id;
        }
        else if (primaryMembership.role === "individual") {
            // Individual users may not have a tenant
            payload.tenantId = null;
        }
        if (primaryMembership.role) {
            payload.role = primaryMembership.role;
        }
        // Derive scopes from plan
        if (primaryMembership.tenant) {
            payload.scopes = deriveScopesFromPlan(primaryMembership.tenant);
        }
        const token = (0, token_1.signToken)(payload);
        // Return user without passwordHash and relations
        const userResponse = {
            ...user,
            passwordHash: "", // Don't expose password hash
        };
        return {
            token,
            user: userResponse,
            ...(primaryMembership.tenant?.id
                ? { tenantId: primaryMembership.tenant.id }
                : {}),
            ...(primaryMembership.role ? { role: primaryMembership.role } : {}),
        };
    }
    catch (error) {
        if (error instanceof errorHandler_1.HttpError) {
            throw error;
        }
        // Log unexpected errors for debugging
        console.error("Login error:", error);
        throw new errorHandler_1.HttpError(500, "Internal server error during login");
    }
};
exports.login = login;
//# sourceMappingURL=authService.js.map