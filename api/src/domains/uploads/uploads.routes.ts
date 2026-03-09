import { Hono } from "hono";
import type { Env } from "../../index.types";
import {
  getUploadFileController,
  uploadFileController,
} from "./uploads.controller";
import { requireAuth } from "../../shared/middlewares/requireAuth";
import { validateFormData } from "../../shared/middlewares/validate";
import { uploadFileSchema } from "./uploads.schema";

const router = new Hono<Env>({ strict: false });

router.use("/upload/file/*", requireAuth);
router.get("/upload/file/*", getUploadFileController);

router.use("/upload", requireAuth);
router.post(
  "/upload",
  validateFormData(uploadFileSchema),
  uploadFileController,
);

export const uploadRoutes = router;
