import type { FilterInput } from "../../../shared/lib/types.types";
import {
  asNumber,
  asPositiveInt,
  asRecord,
  asString,
} from "../../../shared/utils/normalize";
import type { CertificateCrud } from "../certificates.crud.types";
import type { CertificateCrudConfig } from "./createCertificateCrud.types";

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

function toSqlValue(
  column: string,
  payload: Record<string, unknown>,
  jsonColumns: Set<string>,
  numberColumns: Set<string>,
): string | number {
  const value = payload[column];

  if (jsonColumns.has(column)) {
    return JSON.stringify(asRecord(value));
  }
  if (numberColumns.has(column)) {
    return asNumber(value);
  }
  return asString(value);
}

function buildWhereClause(config: CertificateCrudConfig): {
  whereSql: string;
  whereBindValues: Array<string | number>;
} {
  const whereParts: string[] = ["deleted = 0"];
  const whereBindValues: Array<string | number> = [];

  if (config.certificateType) {
    whereParts.push("LOWER(certificateType) = LOWER(?)");
    whereBindValues.push(config.certificateType);
  }

  return { whereSql: whereParts.join(" AND "), whereBindValues };
}

function buildSearchClause(
  config: CertificateCrudConfig,
  terms: string[],
): { searchSql: string; searchBindValues: string[] } {
  if (terms.length === 0) {
    return { searchSql: "", searchBindValues: [] };
  }

  const likeParts: string[] = [];
  const searchBindValues: string[] = [];

  for (const term of terms) {
    const like = `%${term}%`;
    for (const column of config.searchColumns) {
      likeParts.push(`LOWER(${column}) LIKE LOWER(?)`);
      searchBindValues.push(like);
    }
  }

  return {
    searchSql: `(${likeParts.join(" OR ")})`,
    searchBindValues,
  };
}

export function createCertificateCrud(
  config: CertificateCrudConfig,
): CertificateCrud {
  const jsonColumns = new Set(config.jsonColumns ?? []);
  const numberColumns = new Set(config.numberColumns ?? []);

  return {
    async page(
      db: D1Database,
      pageInput: unknown,
      filters: FilterInput[] | undefined,
    ) {
      const page = asPositiveInt(pageInput, 1);
      const limit = 10;
      const offset = (page - 1) * limit;

      const terms = buildSearchTerms(filters);
      const { whereSql, whereBindValues } = buildWhereClause(config);
      const { searchSql, searchBindValues } = buildSearchClause(config, terms);
      const where = searchSql ? `${whereSql} AND ${searchSql}` : whereSql;
      const bindValues = [...whereBindValues, ...searchBindValues];

      const countResult = await db
        .prepare(`SELECT COUNT(*) as count FROM ${config.table} WHERE ${where}`)
        .bind(...bindValues)
        .first<{ count: number }>();

      const totalDocs = Number(countResult?.count ?? 0);
      const totalPages = Math.max(1, Math.ceil(totalDocs / limit));

      const rowsResult = await db
        .prepare(
          `SELECT * FROM ${config.table}
           WHERE ${where}
           ORDER BY datetime(createdAt) DESC
           LIMIT ? OFFSET ?`,
        )
        .bind(...bindValues, limit, offset)
        .all<Record<string, unknown>>();

      const docs = (rowsResult.results ?? []).map((row) =>
        config.rowMapper(row),
      );

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
      const { whereSql, whereBindValues } = buildWhereClause(config);
      const row = await db
        .prepare(`SELECT * FROM ${config.table} WHERE id = ? AND ${whereSql}`)
        .bind(id, ...whereBindValues)
        .first<Record<string, unknown>>();

      return row ? config.rowMapper(row) : null;
    },

    async create(db: D1Database, payloadInput: unknown) {
      const payload = asRecord(payloadInput);
      const now = new Date().toISOString();
      const id = crypto.randomUUID();

      const insertColumns = [
        "id",
        ...(config.certificateType ? ["certificateType"] : []),
        ...config.insertColumns,
        "createdAt",
        "updatedAt",
      ];
      const placeholders = insertColumns.map(() => "?").join(", ");
      const values: Array<string | number> = [
        id,
        ...(config.certificateType ? [config.certificateType] : []),
        ...config.insertColumns.map((column) =>
          toSqlValue(column, payload, jsonColumns, numberColumns),
        ),
        now,
        now,
      ];

      await db
        .prepare(
          `INSERT INTO ${config.table} (${insertColumns.join(", ")})
           VALUES (${placeholders})`,
        )
        .bind(...values)
        .run();

      return {
        ...payload,
        id,
        certificateType: config.responseCertificateType,
        createdAt: now,
        updatedAt: now,
      };
    },

    async update(db: D1Database, id: string, payloadInput: unknown) {
      const payload = asRecord(payloadInput);
      const now = new Date().toISOString();
      const { whereSql, whereBindValues } = buildWhereClause(config);
      const setSql = [
        ...config.updateColumns.map((column) => `${column} = ?`),
        "updatedAt = ?",
      ].join(", ");
      const values: Array<string | number> = [
        ...config.updateColumns.map((column) =>
          toSqlValue(column, payload, jsonColumns, numberColumns),
        ),
        now,
        id,
        ...whereBindValues,
      ];

      const update = await db
        .prepare(
          `UPDATE ${config.table}
           SET ${setSql}
           WHERE id = ? AND ${whereSql}`,
        )
        .bind(...values)
        .run();

      if (!update.success || update.meta.changes < 1) {
        return null;
      }

      return {
        ...payload,
        id,
        certificateType: config.responseCertificateType,
        updatedAt: now,
      };
    },

    async softDelete(db: D1Database, id: string, deletedBy: string) {
      const { whereSql, whereBindValues } = buildWhereClause(config);
      const deleted = await db
        .prepare(
          `UPDATE ${config.table}
           SET deleted = 1, deletedBy = ?, deletedAt = datetime('now')
           WHERE id = ? AND ${whereSql}`,
        )
        .bind(deletedBy, id, ...whereBindValues)
        .run();

      return deleted.success && deleted.meta.changes > 0;
    },
  };
}
