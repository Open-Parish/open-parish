import { Hono } from 'hono';
import type { Env } from '../../index';
import { getUploadFileController, uploadFileController } from '../controllers/uploads.controller';
import { requireAuth } from '../middlewares/requireAuth';
import { validateFormData } from '../middlewares/validate';
import { uploadFileSchema } from '../validators/uploads.schema';

const router = new Hono<Env>({ strict: false });

router.get('/upload/file/*', getUploadFileController);

router.use('/upload', requireAuth);
router.post('/upload', validateFormData(uploadFileSchema), uploadFileController);

export const uploadRoutes = router;
