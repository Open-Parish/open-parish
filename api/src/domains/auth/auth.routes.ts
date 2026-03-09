import { Hono } from "hono";
import type { Env } from "../../index.types";
import {
  loginController,
  profileController,
  registerController,
} from "./auth.controller";
import { requireAuth } from "../../shared/middlewares/requireAuth";
import { validateJson } from "../../shared/middlewares/validate";
import { authSchema } from "./auth.schema";

export const authRoutes = new Hono<Env>({ strict: false });

authRoutes.post("/register", validateJson(authSchema), registerController);
authRoutes.post("/login", validateJson(authSchema), loginController);
authRoutes.get("/users/profile", requireAuth, profileController);
