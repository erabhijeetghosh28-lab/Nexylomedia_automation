"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaskedKey = exports.getIntegrationSecret = exports.testIntegration = exports.deleteIntegration = exports.updateIntegration = exports.createIntegration = exports.findIntegration = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const integrationRepository_1 = require("../repositories/integrationRepository");
const crypto_1 = __importDefault(require("crypto"));
// Simple encryption for secrets (in production, use a proper secret manager)
const ALGORITHM = "aes-256-cbc";
function getEncryptionKey() {
    const key = process.env.INTEGRATION_ENCRYPTION_KEY;
    if (!key) {
        // Generate a key if not set (for development only - not persistent!)
        const generated = crypto_1.default.randomBytes(32).toString("hex");
        console.warn("WARNING: INTEGRATION_ENCRYPTION_KEY not set. Using generated key (not persistent).");
        return Buffer.from(generated, "hex");
    }
    if (key.length < 64) {
        throw new Error("INTEGRATION_ENCRYPTION_KEY must be at least 64 hex characters (32 bytes)");
    }
    return Buffer.from(key, "hex");
}
function encryptSecret(secret) {
    const iv = crypto_1.default.randomBytes(16);
    const key = getEncryptionKey();
    const cipher = crypto_1.default.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(secret, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
}
function decryptSecret(encrypted) {
    const parts = encrypted.split(":");
    if (parts.length !== 2) {
        throw new Error("Invalid encrypted format");
    }
    const iv = Buffer.from(parts[0], "hex");
    const encryptedText = parts[1];
    const key = getEncryptionKey();
    const decipher = crypto_1.default.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}
function maskKey(key) {
    if (key.length <= 8)
        return "****";
    return key.substring(0, 4) + "****" + key.substring(key.length - 4);
}
const findIntegration = async (params) => {
    const repo = (0, integrationRepository_1.integrationRepository)();
    const where = { provider: params.provider };
    if (params.tenantId) {
        where.tenant = { id: params.tenantId };
    }
    if (params.userId) {
        where.user = { id: params.userId };
    }
    return repo.findOne({
        where,
        relations: ["tenant", "user"],
    });
};
exports.findIntegration = findIntegration;
const createIntegration = async (params) => {
    const repo = (0, integrationRepository_1.integrationRepository)();
    // Validate that either tenantId or userId is provided
    if (!params.tenantId && !params.userId) {
        throw new errorHandler_1.HttpError(400, "Either tenantId or userId must be provided");
    }
    // Check for existing integration
    const findParams = {
        provider: params.provider,
    };
    if (params.tenantId) {
        findParams.tenantId = params.tenantId;
    }
    if (params.userId) {
        findParams.userId = params.userId;
    }
    const existing = await (0, exports.findIntegration)(findParams);
    if (existing) {
        throw new errorHandler_1.HttpError(409, `Integration for provider '${params.provider}' already exists`);
    }
    // Encrypt secret
    const encryptedSecret = encryptSecret(params.secret);
    const keyMask = maskKey(params.secret);
    const integration = repo.create({
        tenant: params.tenantId ? { id: params.tenantId } : null,
        user: params.userId ? { id: params.userId } : null,
        provider: params.provider,
        keyMask,
        secretRef: encryptedSecret,
        scope: params.scope,
        status: "untested",
        configJson: params.configJson ?? null,
    });
    return repo.save(integration);
};
exports.createIntegration = createIntegration;
const updateIntegration = async (id, params) => {
    const repo = (0, integrationRepository_1.integrationRepository)();
    const integration = await repo.findOne({
        where: { id },
        relations: ["tenant", "user"],
    });
    if (!integration) {
        throw new errorHandler_1.HttpError(404, "Integration not found");
    }
    if (params.secret !== undefined) {
        integration.secretRef = encryptSecret(params.secret);
        integration.keyMask = maskKey(params.secret);
    }
    if (params.status !== undefined) {
        integration.status = params.status;
    }
    if (params.configJson !== undefined) {
        integration.configJson = params.configJson;
    }
    return repo.save(integration);
};
exports.updateIntegration = updateIntegration;
const deleteIntegration = async (id) => {
    const repo = (0, integrationRepository_1.integrationRepository)();
    const integration = await repo.findOne({
        where: { id },
    });
    if (!integration) {
        throw new errorHandler_1.HttpError(404, "Integration not found");
    }
    await repo.remove(integration);
};
exports.deleteIntegration = deleteIntegration;
const testIntegration = async (id) => {
    const repo = (0, integrationRepository_1.integrationRepository)();
    const integration = await repo.findOne({
        where: { id },
    });
    if (!integration) {
        throw new errorHandler_1.HttpError(404, "Integration not found");
    }
    try {
        const secret = decryptSecret(integration.secretRef);
        // Test based on provider
        switch (integration.provider) {
            case "pagespeed":
                // Test PageSpeed API
                const testUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://example.com&key=${secret}`;
                const response = await fetch(testUrl);
                if (!response.ok) {
                    throw new Error(`PageSpeed API returned ${response.status}`);
                }
                break;
            case "gemini":
            case "gpt":
            case "groq":
                // For AI providers, we could test with a simple API call
                // For now, just mark as tested
                break;
            default:
                // Unknown provider - mark as untested
                integration.status = "untested";
                await repo.save(integration);
                return {
                    status: "failed",
                    message: `Unknown provider: ${integration.provider}`,
                };
        }
        integration.status = "ok";
        await repo.save(integration);
        return { status: "ok" };
    }
    catch (error) {
        integration.status = "failed";
        await repo.save(integration);
        return {
            status: "failed",
            message: error instanceof Error ? error.message : "Unknown error",
        };
    }
};
exports.testIntegration = testIntegration;
const getIntegrationSecret = async (integration) => {
    return decryptSecret(integration.secretRef);
};
exports.getIntegrationSecret = getIntegrationSecret;
const getMaskedKey = (integration) => {
    return integration.keyMask;
};
exports.getMaskedKey = getMaskedKey;
//# sourceMappingURL=integrationService.js.map