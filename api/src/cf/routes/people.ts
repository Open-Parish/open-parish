import { Hono } from 'hono';
import type { Env } from '../../index';
import { peopleAutocompleteController } from '../controllers/people.controller';
import { requireAuth } from '../middlewares/requireAuth';

const router = new Hono<Env>({ strict: false });

router.use('/people/*', requireAuth);
router.get('/people/autocomplete', peopleAutocompleteController);

export const peopleRoutes = router;
