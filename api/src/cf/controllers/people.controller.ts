import type { Context } from 'hono';
import type { Env } from '../../index';
import { asPositiveInt, asString } from '../utils/normalize';

export async function peopleAutocompleteController(c: Context<Env>) {
  const q = asString(c.req.query('q')).trim();
  const limit = Math.min(50, asPositiveInt(c.req.query('limit'), 10));

  if (!q) {
    return c.json({ items: [] });
  }

  const like = `%${q}%`;
  const rows = await c.env.DB.prepare(
    `SELECT id, firstName, lastName, useCount
     FROM people_autocomplete
     WHERE LOWER(firstName) LIKE LOWER(?) OR LOWER(lastName) LIKE LOWER(?)
     ORDER BY useCount DESC, lastName ASC, firstName ASC
     LIMIT ?`
  )
    .bind(like, like, limit)
    .all<{
      id: string;
      firstName: string;
      lastName: string;
      useCount: number;
    }>();

  return c.json({ items: rows.results ?? [] });
}
