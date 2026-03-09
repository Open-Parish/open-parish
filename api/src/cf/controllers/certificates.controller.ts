import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { Env } from '../../index';
import { ensureSettings, mapCertificateRow, paginatedCertificates } from '../lib/db';
import { buildCertificateHtml } from '../lib/print';
import type { CertificateKind, FilterInput } from '../lib/types';
import { asRecord, asString } from '../utils/normalize';
import { getValidatedJson } from '../middlewares/validate';
import {
  certificateMutationSchema,
  certificatesPageSchema,
  certificatesSearchSchema,
} from '../validators/certificates.schema';

const KIND_MAP: Record<string, CertificateKind> = {
  baptismal: 'baptismal',
  confirmation: 'confirmation',
  death: 'death',
  marriage: 'marriage',
};

const CERTIFICATE_LABEL_MAP: Record<string, string> = {
  marriage: 'Certificate of Marriage',
  confirmation: 'Certificate of Confirmation',
  death: 'Certificate of Death',
  baptismal: 'Certificate of Baptism',
};

function resolveKind(routeType: string): CertificateKind {
  const kind = KIND_MAP[routeType];
  if (!kind) {
    throw new HTTPException(404, { message: 'Unknown certificate type' });
  }
  return kind;
}

function requiredParam(value: string | undefined, name: string): string {
  const normalized = asString(value).trim();
  if (!normalized) {
    throw new HTTPException(404, { message: `Missing ${name}` });
  }
  return normalized;
}

function resolveCertificateLabel(certificateType: string): string {
  return CERTIFICATE_LABEL_MAP[certificateType] ?? CERTIFICATE_LABEL_MAP.baptismal;
}

async function getCertificateRow(c: Context<Env>, id: string, kind: CertificateKind) {
  return c.env.DB.prepare(
    `SELECT id, kind, certificate_type, payload, created_at, updated_at
     FROM certificates WHERE id = ? AND kind = ? AND deleted_at IS NULL`
  )
    .bind(id, kind)
    .first<{
      id: string;
      kind: string;
      certificate_type: string | null;
      payload: string;
      created_at: string;
      updated_at: string;
    }>();
}

export async function certificatesPageController(c: Context<Env>) {
  const type = requiredParam(c.req.param('type'), 'type');
  const kind = resolveKind(type);
  const payload = getValidatedJson<typeof certificatesPageSchema>(c);
  const pageResult = await paginatedCertificates(c.env.DB, kind, payload.page, undefined);
  return c.json(pageResult);
}

export async function certificatesSearchController(c: Context<Env>) {
  const type = requiredParam(c.req.param('type'), 'type');
  const kind = resolveKind(type);
  const payload = getValidatedJson<typeof certificatesSearchSchema>(c);
  const pageResult = await paginatedCertificates(c.env.DB, kind, payload.page, payload.filters as FilterInput[] | undefined);
  return c.json(pageResult);
}

export async function getCertificateController(c: Context<Env>) {
  const type = requiredParam(c.req.param('type'), 'type');
  const id = requiredParam(c.req.param('id'), 'id');
  const kind = resolveKind(type);

  const row = await getCertificateRow(c, id, kind);
  if (!row) {
    throw new HTTPException(404, { message: 'Record not found' });
  }

  return c.json(mapCertificateRow(row));
}

export async function createCertificateController(c: Context<Env>) {
  const type = requiredParam(c.req.param('type'), 'type');
  const kind = resolveKind(type);
  const payload = asRecord(getValidatedJson<typeof certificateMutationSchema>(c));
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const firstName = asString(payload.firstName);
  const lastName = asString(payload.lastName);
  const certificateType = asString(payload.certificateType, type);

  await c.env.DB.prepare(
    `INSERT INTO certificates (id, kind, certificate_type, first_name, last_name, payload, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(id, kind, certificateType, firstName, lastName, JSON.stringify(payload), now, now)
    .run();

  return c.json({ ...payload, _id: id, id, createdAt: now, updatedAt: now });
}

export async function updateCertificateController(c: Context<Env>) {
  const type = requiredParam(c.req.param('type'), 'type');
  const id = requiredParam(c.req.param('id'), 'id');
  const kind = resolveKind(type);
  const payload = asRecord(getValidatedJson<typeof certificateMutationSchema>(c));
  const now = new Date().toISOString();
  const firstName = asString(payload.firstName);
  const lastName = asString(payload.lastName);
  const certificateType = asString(payload.certificateType, type);

  const update = await c.env.DB.prepare(
    `UPDATE certificates
     SET certificate_type = ?, first_name = ?, last_name = ?, payload = ?, updated_at = ?
     WHERE id = ? AND kind = ? AND deleted_at IS NULL`
  )
    .bind(certificateType, firstName, lastName, JSON.stringify(payload), now, id, kind)
    .run();

  if (!update.success || update.meta.changes < 1) {
    throw new HTTPException(404, { message: 'Record not found' });
  }

  return c.json({ ...payload, _id: id, id, updatedAt: now });
}

export async function deleteCertificateController(c: Context<Env>) {
  const type = requiredParam(c.req.param('type'), 'type');
  const id = requiredParam(c.req.param('id'), 'id');
  const kind = resolveKind(type);

  const deleted = await c.env.DB.prepare('UPDATE certificates SET deleted_at = datetime(\'now\') WHERE id = ? AND kind = ?')
    .bind(id, kind)
    .run();

  if (!deleted.success || deleted.meta.changes < 1) {
    throw new HTTPException(404, { message: 'Record not found' });
  }

  return c.json({ success: true });
}

export async function printCertificateController(c: Context<Env>) {
  const type = requiredParam(c.req.param('type'), 'type');
  const id = requiredParam(c.req.param('id'), 'id');
  const certificateType = requiredParam(c.req.param('certificateType'), 'certificateType');
  const kind = resolveKind(type);

  const row = await getCertificateRow(c, id, kind);
  if (!row) {
    throw new HTTPException(404, { message: 'Record not found' });
  }

  const settings = await ensureSettings(c.env.DB);
  const record = mapCertificateRow(row);

  const certificateLabel = resolveCertificateLabel(certificateType);

  const html = buildCertificateHtml({
    title: certificateLabel,
    certificateType,
    settings,
    record,
    baseUrl: new URL(c.req.url).origin,
  });

  const shouldDownload = c.req.query('download') === '1';
  const responseHeaders = new Headers({
    'Content-Type': 'text/html; charset=utf-8',
  });

  if (shouldDownload) {
    responseHeaders.set('Content-Disposition', `attachment; filename="${certificateType}-${id}.html"`);
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
