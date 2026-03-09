import { Hono } from "hono";
import type { Env } from "../../index.types";
import {
  certificatesPageController,
  certificatesSearchController,
  createCertificateController,
  deleteCertificateController,
  getCertificateController,
  printCertificateController,
  printPreviewController,
  updateCertificateController,
} from "./certificates.controller";
import { requireAuth } from "../../shared/middlewares/requireAuth";
import { upsertPeopleAutocomplete } from "./upsertPeopleAutocomplete";
import { validateJson } from "../../shared/middlewares/validate";
import {
  certificateMutationSchema,
  certificatesPageSchema,
  certificatesSearchSchema,
} from "./certificates.schema";

const router = new Hono<Env>({ strict: false });

router.use("/certificates/*", requireAuth);

router.post(
  "/certificates/:type/page",
  validateJson(certificatesPageSchema),
  certificatesPageController,
);
router.post(
  "/certificates/:type/search",
  validateJson(certificatesSearchSchema),
  certificatesSearchController,
);
router.get("/certificates/:type/:id", getCertificateController);
router.post(
  "/certificates/:type",
  validateJson(certificateMutationSchema),
  upsertPeopleAutocomplete(),
  createCertificateController,
);
router.put(
  "/certificates/:type/:id",
  validateJson(certificateMutationSchema),
  upsertPeopleAutocomplete(),
  updateCertificateController,
);
router.delete("/certificates/:type/:id", deleteCertificateController);
router.get(
  "/certificates/:type/print/:id/:certificateType",
  printCertificateController,
);
router.get(
  "/certificates/:type/print-preview/:id/:certificateType",
  printPreviewController,
);

export const certificateRoutes = router;
