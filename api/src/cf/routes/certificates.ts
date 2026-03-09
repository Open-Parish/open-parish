import { Hono } from 'hono';
import type { Env } from '../../index';
import {
  certificatesPageController,
  certificatesSearchController,
  createCertificateController,
  deleteCertificateController,
  getCertificateController,
  printCertificateController,
  printPreviewController,
  updateCertificateController,
} from '../controllers/certificates.controller';
import { requireAuth } from '../middlewares/requireAuth';
import { validateJson } from '../middlewares/validate';
import {
  certificateMutationSchema,
  certificatesPageSchema,
  certificatesSearchSchema,
} from '../validators/certificates.schema';

const router = new Hono<Env>({ strict: false });

router.use('/certificates/*', requireAuth);

router.post('/certificates/:type/page', validateJson(certificatesPageSchema), certificatesPageController);
router.post('/certificates/:type/search', validateJson(certificatesSearchSchema), certificatesSearchController);
router.get('/certificates/:type/:id', getCertificateController);
router.post('/certificates/:type', validateJson(certificateMutationSchema), createCertificateController);
router.put('/certificates/:type/:id', validateJson(certificateMutationSchema), updateCertificateController);
router.delete('/certificates/:type/:id', deleteCertificateController);
router.get('/certificates/:type/print/:id/:certificateType', printCertificateController);
router.get('/certificates/:type/print-preview/:id/:certificateType', printPreviewController);

export const certificateRoutes = router;
