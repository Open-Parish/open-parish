import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { Env } from '../../index';
import { requireAuth } from '../lib/auth';
import { ensureSettings, mapCertificateRow, paginatedCertificates } from '../lib/db';
import { buildCertificateHtml } from '../lib/print';
import type { CertificateKind, FilterInput } from '../lib/types';

const router = new Hono<Env>({ strict: false });

const KIND_MAP: Record<string, CertificateKind> = {
  birth: 'birth',
  baptismal: 'birth',
  confirmation: 'birth',
  death: 'death',
  marriage: 'marriage',
};

function resolveKind(routeType: string): CertificateKind {
  const kind = KIND_MAP[routeType];
  if (!kind) {
    throw new HTTPException(404, { message: 'Unknown certificate type' });
  }
  return kind;
}

router.use('/certificates/*', requireAuth);

router.post('/certificates/:type/page', async (c) => {
  const type = c.req.param('type');
  const kind = resolveKind(type);
  const payload = await c.req.json<{ page?: number }>();
  const pageResult = await paginatedCertificates(c.env.DB, kind, payload.page, undefined);
  return c.json(pageResult);
});

router.post('/certificates/:type/search', async (c) => {
  const type = c.req.param('type');
  const kind = resolveKind(type);
  const payload = await c.req.json<{ page?: number; filters?: FilterInput[] }>();
  const pageResult = await paginatedCertificates(c.env.DB, kind, payload.page, payload.filters ?? []);
  return c.json(pageResult);
});

router.get('/certificates/:type/:id', async (c) => {
  const type = c.req.param('type');
  const id = c.req.param('id');
  const kind = resolveKind(type);

  const row = await c.env.DB.prepare(
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

  if (!row) {
    throw new HTTPException(404, { message: 'Record not found' });
  }

  return c.json(mapCertificateRow(row));
});

router.post('/certificates/:type', async (c) => {
  const type = c.req.param('type');
  const kind = resolveKind(type);
  const payload = await c.req.json<Record<string, unknown>>();
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const firstName = String(payload.firstName ?? '');
  const lastName = String(payload.lastName ?? '');
  const certificateType = String(payload.certificateType ?? type);

  await c.env.DB.prepare(
    `INSERT INTO certificates (id, kind, certificate_type, first_name, last_name, payload, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(id, kind, certificateType, firstName, lastName, JSON.stringify(payload), now, now)
    .run();

  return c.json({ ...payload, _id: id, id, createdAt: now, updatedAt: now });
});

router.put('/certificates/:type/:id', async (c) => {
  const type = c.req.param('type');
  const id = c.req.param('id');
  const kind = resolveKind(type);
  const payload = await c.req.json<Record<string, unknown>>();
  const now = new Date().toISOString();
  const firstName = String(payload.firstName ?? '');
  const lastName = String(payload.lastName ?? '');
  const certificateType = String(payload.certificateType ?? type);

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
});

router.delete('/certificates/:type/:id', async (c) => {
  const type = c.req.param('type');
  const id = c.req.param('id');
  const kind = resolveKind(type);

  const deleted = await c.env.DB.prepare(`UPDATE certificates SET deleted_at = datetime('now') WHERE id = ? AND kind = ?`)
    .bind(id, kind)
    .run();

  if (!deleted.success || deleted.meta.changes < 1) {
    throw new HTTPException(404, { message: 'Record not found' });
  }

  return c.json({ success: true });
});

router.get('/certificates/:type/print/:id/:certificateType', async (c) => {
  const type = c.req.param('type');
  const id = c.req.param('id');
  const certificateType = c.req.param('certificateType');
  const kind = resolveKind(type);

  const row = await c.env.DB.prepare(
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

  if (!row) {
    throw new HTTPException(404, { message: 'Record not found' });
  }

  const settings = await ensureSettings(c.env.DB);
  const record = mapCertificateRow(row);

  const certificateLabel =
    certificateType === 'marriage'
      ? 'Certificate of Marriage'
      : certificateType === 'confirmation'
        ? 'Certificate of Confirmation'
        : certificateType === 'death'
          ? 'Certificate of Death'
          : 'Certificate of Baptism';

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
});

router.get('/certificates/:type/print-preview/:id/:certificateType', async (c) => {
  const url = new URL(c.req.url);
  const nextPath = url.pathname.replace('/print-preview/', '/print/');
  url.searchParams.set('autoprint', '1');
  const query = url.searchParams.toString();
  const suffix = query ? `?${query}` : '';
  return c.redirect(`${nextPath}${suffix}`);
});

export const certificateRoutes = router;
