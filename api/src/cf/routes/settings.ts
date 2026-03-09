import { Hono } from 'hono';
import type { Env } from '../../index';
import {
  changePasswordController,
  getSettingsController,
  updateSettingsController,
} from '../controllers/settings.controller';
import { requireAuth } from '../middlewares/requireAuth';
import { validateFormData, validateJson } from '../middlewares/validate';
import { changePasswordSchema, settingsFormSchema } from '../validators/settings.schema';

const router = new Hono<Env>({ strict: false });

router.use('/settings*', requireAuth);

router.get('/settings', getSettingsController);
router.post('/settings', validateFormData(settingsFormSchema), updateSettingsController);
router.post('/settings/change-password', validateJson(changePasswordSchema), changePasswordController);

export const settingsRoutes = router;
