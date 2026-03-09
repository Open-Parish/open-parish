import { asPositiveInt, asString } from "../../shared/utils/normalize";

export async function autocompletePeople(
  db: D1Database,
  queryInput: string | undefined,
  limitInput: string | undefined,
) {
  const q = asString(queryInput).trim();
  const limit = Math.min(50, asPositiveInt(limitInput, 10));

  if (!q) {
    return { items: [] };
  }

  const like = `%${q}%`;
  const rows = await db
    .prepare(
      `SELECT id, firstName, lastName, useCount
       FROM people_autocomplete
       WHERE LOWER(firstName) LIKE LOWER(?) OR LOWER(lastName) LIKE LOWER(?)
       ORDER BY useCount DESC, lastName ASC, firstName ASC
       LIMIT ?`,
    )
    .bind(like, like, limit)
    .all<{
      id: string;
      firstName: string;
      lastName: string;
      useCount: number;
    }>();

  return { items: rows.results ?? [] };
}
