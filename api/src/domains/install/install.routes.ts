import { Hono } from "hono";
import type { Env } from "../../index.types";
import { validateJson } from "../../shared/middlewares/validate";
import {
  bootstrapInstallController,
  getInstallStatusController,
  markSystemInstalledController,
} from "./install.controller";
import { requireNotInstalled } from "./install.middleware";
import { installBootstrapSchema } from "./install.schema";

const router = new Hono<Env>({ strict: false });

router.use("/install/*", requireNotInstalled);
router.get("/install/status", getInstallStatusController);
router.post(
  "/install/bootstrap",
  validateJson(installBootstrapSchema),
  bootstrapInstallController,
);
router.post("/install/mark-installed", markSystemInstalledController);

export const installRoutes = router;
