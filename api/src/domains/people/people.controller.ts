import type { Context } from "hono";
import type { Env } from "../../index.types";
import { autocompletePeople } from "./people.service";

export async function peopleAutocompleteController(c: Context<Env>) {
  const result = await autocompletePeople(
    c.env.DB,
    c.req.query("q"),
    c.req.query("limit"),
  );

  return c.json(result);
}
