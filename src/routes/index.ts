import { Router } from "express";
import { authRouter } from "./auth";
import { projectRouter } from "./projects";
import { adminRouter } from "./admin";
import { seoRouter } from "./seo";
import { userRouter } from "./users";
import { integrationRouter } from "./integrations";
import { tenantRouter } from "./tenant";
import { usageRouter } from "./usage";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.use("/auth", authRouter);
router.use("/projects", projectRouter);
router.use("/seo", seoRouter);
router.use("/admin", adminRouter);
router.use("/users", userRouter);
router.use("/integrations", integrationRouter);
router.use("/tenant", tenantRouter);
router.use("/usage", usageRouter);

export { router as rootRouter };

