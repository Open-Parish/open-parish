import { Hono } from "hono";
import type { Env } from "../../index.types";
import {
  getInstallStatusController,
  markSystemInstalledController,
} from "./install.controller";
import { requireNotInstalled } from "./install.middleware";

const router = new Hono<Env>({ strict: false });

router.use("/install/*", requireNotInstalled);
router.get("/install/status", getInstallStatusController);
router.post("/install/mark-installed", markSystemInstalledController);

export const installRoutes = router;
