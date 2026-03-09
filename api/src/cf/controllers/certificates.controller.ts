import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { Env } from '../../index';
import { ensureSettings } from '../lib/db';
import { buildCertificateHtml } from '../lib/print';
import type { FilterInput } from '../lib/types';
import { getValidatedJson } from '../middlewares/validate';
import {
  certificateMutationSchema,
  certificatesPageSchema,
  certificatesSearchSchema,
} from '../validators/certificates.schema';
import { asNumber, asPositiveInt, asRecord, asString, parseJsonObjectString } from '../utils/normalize';

type CertificateRouteType = 'baptismal' | 'confirmation' | 'death' | 'marriage';
type CertificateStorage = {
  table: 'births' | 'deaths' | 'marriages';
  certificateType: CertificateRouteType;
};

const STORAGE_MAP: Record<CertificateRouteType, CertificateStorage> = {
  baptismal: { table: 'births', certificateType: 'baptismal' },
  confirmation: { table: 'births', certificateType: 'confirmation' },
  death: { table: 'deaths', certificateType: 'death' },
  marriage: { table: 'marriages', certificateType: 'marriage' },
};

const CERTIFICATE_LABEL_MAP: Record<CertificateRouteType, string> = {
  marriage: 'Certificate of Marriage',
  confirmation: 'Certificate of Confirmation',
  death: 'Certificate of Death',
  baptismal: 'Certificate of Baptism',
};

function requiredParam(value: string | undefined, name: string): string {
  const normalized = asString(value).trim();
  if (!normalized) {
    throw new HTTPException(404, { message: `Missing ${name}` });
  }
  return normalized;
}

function resolveType(routeType: string): CertificateRouteType {
  const normalized = asString(routeType).trim() as CertificateRouteType;
  if (!(normalized in STORAGE_MAP)) {
    throw new HTTPException(404, { message: 'Unknown certificate type' });
  }
  return normalized;
}

function resolveCertificateLabel(certificateType: CertificateRouteType): string {
  return CERTIFICATE_LABEL_MAP[certificateType];
}

function buildSearchTerms(filters: FilterInput[] | undefined): string[] {
  if (!filters || filters.length === 0) return [];

  const terms: string[] = [];
  for (const filter of filters) {
    if (filter.key !== 'firstName' && filter.key !== 'lastName') continue;
    const value = asString(filter.value).trim();
    if (value) terms.push(value);
  }

  return terms;
}

function parseBirthRow(row: Record<string, unknown>) {
  return {
    id: asString(row.id),
    certificateType: asString(row.certificateType, 'baptismal'),
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

function parseDeathRow(row: Record<string, unknown>) {
  return {
    id: asString(row.id),
    certificateType: 'death',
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

function parseMarriageRow(row: Record<string, unknown>) {
  const bride = parseJsonObjectString(row.bride);

  return {
    id: asString(row.id),
    certificateType: 'marriage',
    firstName: asString(bride.firstName),
    lastName: asString(bride.lastName),
    bride,
    groom: parseJsonObjectString(row.groom),
    sponsor1: parseJsonObjectString(row.sponsor1),
    sponsor2: parseJsonObjectString(row.sponsor2),
    celebrantPriest: parseJsonObjectString(row.celebrantPriest),
    licenseNumber: asString(row.licenseNumber),
    registryNumber: asString(row.registryNumber),
    remarks: asString(row.remarks),
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

function parseRowByType(type: CertificateRouteType, row: Record<string, unknown>) {
  if (type === 'death') return parseDeathRow(row);
  if (type === 'marriage') return parseMarriageRow(row);
  return parseBirthRow(row);
}

function jsonText(value: unknown): string {
  return JSON.stringify(asRecord(value));
}

async function selectCertificateById(c: Context<Env>, type: CertificateRouteType, id: string) {
  const storage = STORAGE_MAP[type];

  if (storage.table === 'births') {
    return c.env.DB.prepare(
      `SELECT * FROM births
       WHERE id = ? AND LOWER(certificateType) = LOWER(?) AND deleted = 0`
    )
      .bind(id, storage.certificateType)
      .first<Record<string, unknown>>();
  }

  return c.env.DB.prepare(`SELECT * FROM ${storage.table} WHERE id = ? AND deleted = 0`)
    .bind(id)
    .first<Record<string, unknown>>();
}

async function paginatedRows(
  c: Context<Env>,
  type: CertificateRouteType,
  pageInput: unknown,
  filters: FilterInput[] | undefined
) {
  const storage = STORAGE_MAP[type];
  const page = asPositiveInt(pageInput, 1);
  const limit = 10;
  const offset = (page - 1) * limit;

  const whereParts: string[] = ['deleted = 0'];
  const bindValues: Array<string | number> = [];

  if (storage.table === 'births') {
    whereParts.push('LOWER(certificateType) = LOWER(?)');
    bindValues.push(storage.certificateType);
  }

  const terms = buildSearchTerms(filters);
  if (terms.length > 0) {
    const likeParts: string[] = [];
    for (const term of terms) {
      if (storage.table === 'marriages') {
        likeParts.push('LOWER(bride) LIKE LOWER(?)');
        likeParts.push('LOWER(groom) LIKE LOWER(?)');
      } else {
        likeParts.push('LOWER(firstName) LIKE LOWER(?)');
        likeParts.push('LOWER(lastName) LIKE LOWER(?)');
      }
      const likeTerm = `%${term}%`;
      bindValues.push(likeTerm, likeTerm);
    }
    whereParts.push(`(${likeParts.join(' OR ')})`);
  }

  const where = whereParts.join(' AND ');

  const countResult = await c.env.DB.prepare(`SELECT COUNT(*) as count FROM ${storage.table} WHERE ${where}`)
    .bind(...bindValues)
    .first<{ count: number }>();

  const totalDocs = Number(countResult?.count ?? 0);
  const totalPages = Math.max(1, Math.ceil(totalDocs / limit));

  const rowsResult = await c.env.DB.prepare(
    `SELECT * FROM ${storage.table}
     WHERE ${where}
     ORDER BY datetime(createdAt) DESC
     LIMIT ? OFFSET ?`
  )
    .bind(...bindValues, limit, offset)
    .all<Record<string, unknown>>();

  const docs = (rowsResult.results ?? []).map((row) => parseRowByType(type, row));

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
}

export async function certificatesPageController(c: Context<Env>) {
  const type = resolveType(requiredParam(c.req.param('type'), 'type'));
  const payload = getValidatedJson<typeof certificatesPageSchema>(c);
  const pageResult = await paginatedRows(c, type, payload.page, undefined);
  return c.json(pageResult);
}

export async function certificatesSearchController(c: Context<Env>) {
  const type = resolveType(requiredParam(c.req.param('type'), 'type'));
  const payload = getValidatedJson<typeof certificatesSearchSchema>(c);
  const pageResult = await paginatedRows(c, type, payload.page, payload.filters as FilterInput[] | undefined);
  return c.json(pageResult);
}

export async function getCertificateController(c: Context<Env>) {
  const type = resolveType(requiredParam(c.req.param('type'), 'type'));
  const id = requiredParam(c.req.param('id'), 'id');

  const row = await selectCertificateById(c, type, id);
  if (!row) {
    throw new HTTPException(404, { message: 'Record not found' });
  }

  return c.json(parseRowByType(type, row));
}

export async function createCertificateController(c: Context<Env>) {
  const type = resolveType(requiredParam(c.req.param('type'), 'type'));
  const payload = asRecord(getValidatedJson<typeof certificateMutationSchema>(c));
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const storage = STORAGE_MAP[type];

  if (storage.table === 'births') {
    await c.env.DB.prepare(
      `INSERT INTO births (
        id, certificateType, firstName, lastName, address, parent1, parent2,
        celebrantPriest, sponsor1, sponsor2, birthDate, occasionDate,
        bookNumber, pageNumber, user, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        id,
        storage.certificateType,
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
        now
      )
      .run();
  } else if (storage.table === 'deaths') {
    await c.env.DB.prepare(
      `INSERT INTO deaths (
        id, firstName, lastName, address, age, survivors, burialDate,
        deathDate, burialPlace, sacraments, celebrantPriest,
        bookNumber, pageNumber, user, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
        now
      )
      .run();
  } else {
    await c.env.DB.prepare(
      `INSERT INTO marriages (
        id, bride, groom, sponsor1, sponsor2, licenseNumber, registryNumber, remarks,
        occasionDate, celebrantPriest, bookNumber, pageNumber, user, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        id,
        jsonText(payload.bride),
        jsonText(payload.groom),
        jsonText(payload.sponsor1),
        jsonText(payload.sponsor2),
        asString(payload.licenseNumber),
        asString(payload.registryNumber),
        asString(payload.remarks),
        asString(payload.occasionDate),
        jsonText(payload.celebrantPriest),
        asNumber(payload.bookNumber),
        asNumber(payload.pageNumber),
        asString(payload.user),
        now,
        now
      )
      .run();
  }

  return c.json({ ...payload, id, certificateType: storage.certificateType, createdAt: now, updatedAt: now });
}

export async function updateCertificateController(c: Context<Env>) {
  const type = resolveType(requiredParam(c.req.param('type'), 'type'));
  const id = requiredParam(c.req.param('id'), 'id');
  const payload = asRecord(getValidatedJson<typeof certificateMutationSchema>(c));
  const now = new Date().toISOString();
  const storage = STORAGE_MAP[type];

  let update;

  if (storage.table === 'births') {
    update = await c.env.DB.prepare(
      `UPDATE births
       SET firstName = ?, lastName = ?, address = ?, parent1 = ?, parent2 = ?,
           celebrantPriest = ?, sponsor1 = ?, sponsor2 = ?, birthDate = ?, occasionDate = ?,
           bookNumber = ?, pageNumber = ?, user = ?, updatedAt = ?
       WHERE id = ? AND LOWER(certificateType) = LOWER(?) AND deleted = 0`
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
        storage.certificateType
      )
      .run();
  } else if (storage.table === 'deaths') {
    update = await c.env.DB.prepare(
      `UPDATE deaths
       SET firstName = ?, lastName = ?, address = ?, age = ?, survivors = ?,
           burialDate = ?, deathDate = ?, burialPlace = ?, sacraments = ?,
           celebrantPriest = ?, bookNumber = ?, pageNumber = ?, user = ?, updatedAt = ?
       WHERE id = ? AND deleted = 0`
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
        id
      )
      .run();
  } else {
    update = await c.env.DB.prepare(
      `UPDATE marriages
       SET bride = ?, groom = ?, sponsor1 = ?, sponsor2 = ?,
           licenseNumber = ?, registryNumber = ?, remarks = ?, occasionDate = ?, celebrantPriest = ?,
           bookNumber = ?, pageNumber = ?, user = ?, updatedAt = ?
       WHERE id = ? AND deleted = 0`
    )
      .bind(
        jsonText(payload.bride),
        jsonText(payload.groom),
        jsonText(payload.sponsor1),
        jsonText(payload.sponsor2),
        asString(payload.licenseNumber),
        asString(payload.registryNumber),
        asString(payload.remarks),
        asString(payload.occasionDate),
        jsonText(payload.celebrantPriest),
        asNumber(payload.bookNumber),
        asNumber(payload.pageNumber),
        asString(payload.user),
        now,
        id
      )
      .run();
  }

  if (!update?.success || update.meta.changes < 1) {
    throw new HTTPException(404, { message: 'Record not found' });
  }

  return c.json({ ...payload, id, certificateType: storage.certificateType, updatedAt: now });
}

export async function deleteCertificateController(c: Context<Env>) {
  const type = resolveType(requiredParam(c.req.param('type'), 'type'));
  const id = requiredParam(c.req.param('id'), 'id');
  const storage = STORAGE_MAP[type];
  const deletedBy = c.get('userId');

  let deleted;

  if (storage.table === 'births') {
    deleted = await c.env.DB.prepare(
      "UPDATE births SET deleted = 1, deletedBy = ?, deletedAt = datetime('now') WHERE id = ? AND LOWER(certificateType) = LOWER(?) AND deleted = 0"
    )
      .bind(deletedBy, id, storage.certificateType)
      .run();
  } else {
    deleted = await c.env.DB.prepare(
      `UPDATE ${storage.table} SET deleted = 1, deletedBy = ?, deletedAt = datetime('now') WHERE id = ? AND deleted = 0`
    )
      .bind(deletedBy, id)
      .run();
  }

  if (!deleted.success || deleted.meta.changes < 1) {
    throw new HTTPException(404, { message: 'Record not found' });
  }

  return c.json({ success: true });
}

export async function printCertificateController(c: Context<Env>) {
  const type = resolveType(requiredParam(c.req.param('type'), 'type'));
  const id = requiredParam(c.req.param('id'), 'id');

  const row = await selectCertificateById(c, type, id);
  if (!row) {
    throw new HTTPException(404, { message: 'Record not found' });
  }

  const settings = await ensureSettings(c.env.DB);
  const record = parseRowByType(type, row);
  const certificateLabel = resolveCertificateLabel(type);

  const html = buildCertificateHtml({
    title: certificateLabel,
    certificateType: type,
    settings,
    record,
    baseUrl: new URL(c.req.url).origin,
  });

  const shouldDownload = c.req.query('download') === '1';
  const responseHeaders = new Headers({
    'Content-Type': 'text/html; charset=utf-8',
  });

  if (shouldDownload) {
    responseHeaders.set('Content-Disposition', `attachment; filename="${type}-${id}.html"`);
  }

  return new Response(html, { headers: responseHeaders });
}

export async function printPreviewController(c: Context<Env>) {
  const url = new URL(c.req.url);
  const nextPath = url.pathname.replace('/print-preview/', '/print/');
  url.searchParams.set('autoprint', '1');
  const query = url.searchParams.toString();
  const suffix = query ? `?${query}` : '';
  return c.redirect(`${nextPath}${suffix}`);
}
