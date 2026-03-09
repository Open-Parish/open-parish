import type { FilterInput } from "../../shared/lib/types.types";
import {
  asNumber,
  asPositiveInt,
  asRecord,
  asString,
  parseJsonObjectString,
} from "../../shared/utils/normalize";
import type { CertificateCrud } from "./certificates.crud.types";

const CERTIFICATE_TYPE = "baptismal";

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

function parseBirthRow(row: Record<string, unknown>) {
  return {
    id: asString(row.id),
    certificateType: asString(row.certificateType, CERTIFICATE_TYPE),
    firstName: asString(row.firstName),
    lastName: asString(row.lastName),
    address: asString(row.address),
    parent1: parseJsonObjectString(row.parent1),
    parent2: parseJsonObjectString(row.parent2),
    celebrantPriest: parseJsonObjectString(row.celebrantPriest),
    sponsor1: parseJsonObjectString(row.sponsor1),
    sponsor2: parseJsonObjectString(row.sponsor2),
    birthDate: asString(row.birthDate),
    occasionDate: asString(row.occasionDate),
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

export const baptismalCrud: CertificateCrud = {
  async page(
    db: D1Database,
    pageInput: unknown,
    filters: FilterInput[] | undefined,
  ) {
    const page = asPositiveInt(pageInput, 1);
    const limit = 10;
    const offset = (page - 1) * limit;

    const whereParts: string[] = [
      "LOWER(certificateType) = LOWER(?)",
      "deleted = 0",
    ];
    const bindValues: Array<string | number> = [CERTIFICATE_TYPE];

    const terms = buildSearchTerms(filters);
    if (terms.length > 0) {
      const likeParts: string[] = [];
      for (const term of terms) {
        likeParts.push(
          "LOWER(firstName) LIKE LOWER(?)",
          "LOWER(lastName) LIKE LOWER(?)",
        );
        const like = `%${term}%`;
        bindValues.push(like, like);
      }
      whereParts.push(`(${likeParts.join(" OR ")})`);
    }

    const where = whereParts.join(" AND ");
    const countResult = await db
      .prepare(`SELECT COUNT(*) as count FROM births WHERE ${where}`)
      .bind(...bindValues)
      .first<{ count: number }>();

    const totalDocs = Number(countResult?.count ?? 0);
    const totalPages = Math.max(1, Math.ceil(totalDocs / limit));

    const rowsResult = await db
      .prepare(
        `SELECT * FROM births
         WHERE ${where}
         ORDER BY datetime(createdAt) DESC
         LIMIT ? OFFSET ?`,
      )
      .bind(...bindValues, limit, offset)
      .all<Record<string, unknown>>();

    const docs = (rowsResult.results ?? []).map((row) => parseBirthRow(row));

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
      .prepare(
        `SELECT * FROM births
         WHERE id = ? AND LOWER(certificateType) = LOWER(?) AND deleted = 0`,
      )
      .bind(id, CERTIFICATE_TYPE)
      .first<Record<string, unknown>>();

    return row ? parseBirthRow(row) : null;
  },

  async create(db: D1Database, payloadInput: unknown) {
    const payload = asRecord(payloadInput);
    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    await db
      .prepare(
        `INSERT INTO births (
          id, certificateType, firstName, lastName, address, parent1, parent2,
          celebrantPriest, sponsor1, sponsor2, birthDate, occasionDate,
          bookNumber, pageNumber, user, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        CERTIFICATE_TYPE,
        asString(payload.firstName),
        asString(payload.lastName),
        asString(payload.address),
        jsonText(payload.parent1),
        jsonText(payload.parent2),
        jsonText(payload.celebrantPriest),
        jsonText(payload.sponsor1),
        jsonText(payload.sponsor2),
        asString(payload.birthDate),
        asString(payload.occasionDate),
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
      certificateType: CERTIFICATE_TYPE,
      createdAt: now,
      updatedAt: now,
    };
  },

  async update(db: D1Database, id: string, payloadInput: unknown) {
    const payload = asRecord(payloadInput);
    const now = new Date().toISOString();

    const update = await db
      .prepare(
        `UPDATE births
         SET firstName = ?, lastName = ?, address = ?, parent1 = ?, parent2 = ?,
             celebrantPriest = ?, sponsor1 = ?, sponsor2 = ?, birthDate = ?, occasionDate = ?,
             bookNumber = ?, pageNumber = ?, user = ?, updatedAt = ?
         WHERE id = ? AND LOWER(certificateType) = LOWER(?) AND deleted = 0`,
      )
      .bind(
        asString(payload.firstName),
        asString(payload.lastName),
        asString(payload.address),
        jsonText(payload.parent1),
        jsonText(payload.parent2),
        jsonText(payload.celebrantPriest),
        jsonText(payload.sponsor1),
        jsonText(payload.sponsor2),
        asString(payload.birthDate),
        asString(payload.occasionDate),
        asNumber(payload.bookNumber),
        asNumber(payload.pageNumber),
        asString(payload.user),
        now,
        id,
        CERTIFICATE_TYPE,
      )
      .run();

    if (!update.success || update.meta.changes < 1) {
      return null;
    }

    return {
      ...payload,
      id,
      certificateType: CERTIFICATE_TYPE,
      updatedAt: now,
    };
  },

  async softDelete(db: D1Database, id: string, deletedBy: string) {
    const deleted = await db
      .prepare(
        "UPDATE births SET deleted = 1, deletedBy = ?, deletedAt = datetime('now') WHERE id = ? AND LOWER(certificateType) = LOWER(?) AND deleted = 0",
      )
      .bind(deletedBy, id, CERTIFICATE_TYPE)
      .run();

    return deleted.success && deleted.meta.changes > 0;
  },
};
