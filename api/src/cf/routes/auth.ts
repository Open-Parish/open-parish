import { Hono } from 'hono';
import type { Env } from '../../index';
import { loginController, profileController, registerController } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/requireAuth';
import { validateJson } from '../middlewares/validate';
import { authSchema } from '../validators/auth.schema';

export const authRoutes = new Hono<Env>({ strict: false });

authRoutes.post('/register', validateJson(authSchema), registerController);
authRoutes.post('/login', validateJson(authSchema), loginController);
authRoutes.get('/users/profile', requireAuth, profileController);
