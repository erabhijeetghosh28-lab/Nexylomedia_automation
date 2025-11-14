"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootRouter = void 0;
const express_1 = require("express");
const auth_1 = require("./auth");
const projects_1 = require("./projects");
const admin_1 = require("./admin");
const seo_1 = require("./seo");
const users_1 = require("./users");
const integrations_1 = require("./integrations");
const tenant_1 = require("./tenant");
const usage_1 = require("./usage");
const router = (0, express_1.Router)();
exports.rootRouter = router;
router.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
router.use("/auth", auth_1.authRouter);
router.use("/projects", projects_1.projectRouter);
router.use("/seo", seo_1.seoRouter);
router.use("/admin", admin_1.adminRouter);
router.use("/users", users_1.userRouter);
router.use("/integrations", integrations_1.integrationRouter);
router.use("/tenant", tenant_1.tenantRouter);
router.use("/usage", usage_1.usageRouter);
//# sourceMappingURL=index.js.map