import type { FilterInput } from "../../shared/lib/types.types";
import {
  asNumber,
  asPositiveInt,
  asRecord,
  asString,
  parseJsonObjectString,
} from "../../shared/utils/normalize";
import type { CertificateCrud } from "./certificates.crud.types";

function buildSearchTerms(filters: FilterInput[] | undefined): string[] {
  if (!filters || filters.length === 0) return [];

  const terms: string[] = [];
  for (const filter of filters) {
    if (filter.key !== "firstName" && filter.key !== "lastName") continue;
    const value = asString(filter.value).trim();
    if (value) terms.push(value);
  }

  return terms;
}

function jsonText(value: unknown): string {
  return JSON.stringify(asRecord(value));
}

function parseDeathRow(row: Record<string, unknown>) {
  return {
    id: asString(row.id),
    certificateType: "death",
    firstName: asString(row.firstName),
    lastName: asString(row.lastName),
    address: asString(row.address),
    age: asString(row.age),
    survivors: parseJsonObjectString(row.survivors),
    burialDate: asString(row.burialDate),
    deathDate: asString(row.deathDate),
    burialPlace: asString(row.burialPlace),
    sacraments: asString(row.sacraments),
    celebrantPriest: parseJsonObjectString(row.celebrantPriest),
    bookNumber: asNumber(row.bookNumber),
    pageNumber: asNumber(row.pageNumber),
    user: asString(row.user),
    deleted: asNumber(row.deleted),
    deletedBy: asString(row.deletedBy),
    deletedAt: asString(row.deletedAt),
    createdAt: asString(row.createdAt),
    updatedAt: asString(row.updatedAt),
  };
}

export const deathCrud: CertificateCrud = {
  async page(
    db: D1Database,
    pageInput: unknown,
    filters: FilterInput[] | undefined,
  ) {
    const page = asPositiveInt(pageInput, 1);
    const limit = 10;
    const offset = (page - 1) * limit;

    const whereParts: string[] = ["deleted = 0"];
    const bindValues: Array<string | number> = [];

    const terms = buildSearchTerms(filters);
    if (terms.length > 0) {
      const likeParts: string[] = [];
      for (const term of terms) {
        likeParts.push("LOWER(firstName) LIKE LOWER(?)");
        likeParts.push("LOWER(lastName) LIKE LOWER(?)");
        const like = `%${term}%`;
        bindValues.push(like, like);
      }
      whereParts.push(`(${likeParts.join(" OR ")})`);
    }

    const where = whereParts.join(" AND ");
    const countResult = await db
      .prepare(`SELECT COUNT(*) as count FROM deaths WHERE ${where}`)
      .bind(...bindValues)
      .first<{ count: number }>();

    const totalDocs = Number(countResult?.count ?? 0);
    const totalPages = Math.max(1, Math.ceil(totalDocs / limit));

    const rowsResult = await db
      .prepare(
        `SELECT * FROM deaths
         WHERE ${where}
         ORDER BY datetime(createdAt) DESC
         LIMIT ? OFFSET ?`,
      )
      .bind(...bindValues, limit, offset)
      .all<Record<string, unknown>>();

    const docs = (rowsResult.results ?? []).map((row) => parseDeathRow(row));

    return {
      docs,
      totalDocs,
      limit,
      totalPages,
      page,
      pagingCounter: offset + 1,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    };
  },

  async getById(db: D1Database, id: string) {
    const row = await db
      .prepare("SELECT * FROM deaths WHERE id = ? AND deleted = 0")
      .bind(id)
      .first<Record<string, unknown>>();

    return row ? parseDeathRow(row) : null;
  },

  async create(db: D1Database, payloadInput: unknown) {
    const payload = asRecord(payloadInput);
    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    await db
      .prepare(
        `INSERT INTO deaths (
          id, firstName, lastName, address, age, survivors, burialDate,
          deathDate, burialPlace, sacraments, celebrantPriest,
          bookNumber, pageNumber, user, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        asString(payload.firstName),
        asString(payload.lastName),
        asString(payload.address),
        asString(payload.age),
        jsonText(payload.survivors),
        asString(payload.burialDate),
        asString(payload.deathDate),
        asString(payload.burialPlace),
        asString(payload.sacraments),
        jsonText(payload.celebrantPriest),
        asNumber(payload.bookNumber),
        asNumber(payload.pageNumber),
        asString(payload.user),
        now,
        now,
      )
      .run();

    return {
      ...payload,
      id,
      certificateType: "death",
      createdAt: now,
      updatedAt: now,
    };
  },

  async update(db: D1Database, id: string, payloadInput: unknown) {
    const payload = asRecord(payloadInput);
    const now = new Date().toISOString();

    const update = await db
      .prepare(
        `UPDATE deaths
         SET firstName = ?, lastName = ?, address = ?, age = ?, survivors = ?,
             burialDate = ?, deathDate = ?, burialPlace = ?, sacraments = ?,
             celebrantPriest = ?, bookNumber = ?, pageNumber = ?, user = ?, updatedAt = ?
         WHERE id = ? AND deleted = 0`,
      )
      .bind(
        asString(payload.firstName),
        asString(payload.lastName),
        asString(payload.address),
        asString(payload.age),
        jsonText(payload.survivors),
        asString(payload.burialDate),
        asString(payload.deathDate),
        asString(payload.burialPlace),
        asString(payload.sacraments),
        jsonText(payload.celebrantPriest),
        asNumber(payload.bookNumber),
        asNumber(payload.pageNumber),
        asString(payload.user),
        now,
        id,
      )
      .run();

    if (!update.success || update.meta.changes < 1) {
      return null;
    }

    return {
      ...payload,
      id,
      certificateType: "death",
      updatedAt: now,
    };
  },

  async softDelete(db: D1Database, id: string, deletedBy: string) {
    const deleted = await db
      .prepare(
        "UPDATE deaths SET deleted = 1, deletedBy = ?, deletedAt = datetime('now') WHERE id = ? AND deleted = 0",
      )
      .bind(deletedBy, id)
      .run();

    return deleted.success && deleted.meta.changes > 0;
  },
};
