import { Hono } from "hono";
import type { Env } from "../../index.types";
import { getInstallStatusController } from "./install.controller";

const router = new Hono<Env>({ strict: false });

router.get("/install/status", getInstallStatusController);

export const installRoutes = router;
