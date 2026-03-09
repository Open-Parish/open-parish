import { Hono } from "hono";
import type { Env } from "../../index.types";
import { peopleAutocompleteController } from "./people.controller";
import { requireAuth } from "../../shared/middlewares/requireAuth";

const router = new Hono<Env>({ strict: false });

router.use("/people/*", requireAuth);
router.get("/people/autocomplete", peopleAutocompleteController);

export const peopleRoutes = router;
