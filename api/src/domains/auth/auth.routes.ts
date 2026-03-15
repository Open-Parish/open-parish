import { Hono } from "hono";
import type { Env } from "../../index.types";
import {
  changePasswordController,
  loginController,
  logoutController,
  profileController,
  registerController,
} from "./auth.controller";
import { requireAuth } from "../../shared/middlewares/requireAuth";
import { validateJson } from "../../shared/middlewares/validate";
import { authSchema, changePasswordSchema } from "./auth.schema";

export const authRoutes = new Hono<Env>({ strict: false });

authRoutes.post("/register", validateJson(authSchema), registerController);
authRoutes.post("/login", validateJson(authSchema), loginController);
authRoutes.post("/logout", logoutController);
authRoutes.get("/users/profile", requireAuth, profileController);
authRoutes.put(
  "/users/password",
  requireAuth,
  validateJson(changePasswordSchema),
  changePasswordController,
);
