import { Hono } from "hono";
import type { Env } from "../../index.types";
import {
  changePasswordController,
  getSettingsController,
  updateSettingsController,
} from "./settings.controller";
import { requireAuth } from "../../shared/middlewares/requireAuth";
import {
  validateFormData,
  validateJson,
} from "../../shared/middlewares/validate";
import { changePasswordSchema, settingsFormSchema } from "./settings.schema";

const router = new Hono<Env>({ strict: false });

router.use("/settings*", requireAuth);

router.get("/settings", getSettingsController);
router.post(
  "/settings",
  validateFormData(settingsFormSchema),
  updateSettingsController,
);
router.post(
  "/settings/change-password",
  validateJson(changePasswordSchema),
  changePasswordController,
);

export const settingsRoutes = router;
