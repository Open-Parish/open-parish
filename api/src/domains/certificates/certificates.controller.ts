import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { Env } from "../../index.types";
import type { FilterInput } from "../../shared/lib/types.types";
import { getValidatedJson } from "../../shared/middlewares/validate";
import { asString } from "../../shared/utils/normalize";
import type { CertificateRouteType } from "./certificates.controller.types";
import {
  certificateMutationSchema,
  certificatesPageSchema,
  certificatesSearchSchema,
} from "./certificates.schema";
import {
  buildCertificatePrintHtml,
  createCertificate,
  getCertificateById,
  getCertificatesPage,
  resolveCertificateType,
  softDeleteCertificate,
  updateCertificate,
} from "./certificates.service";

function requiredParam(value: string | undefined, name: string): string {
  const normalized = asString(value).trim();
  if (!normalized) {
    throw new HTTPException(404, { message: `Missing ${name}` });
  }
  return normalized;
}

function getCertificateType(c: Context<Env>): CertificateRouteType {
  return resolveCertificateType(requiredParam(c.req.param("type"), "type"));
}

export async function certificatesPageController(c: Context<Env>) {
  const type = getCertificateType(c);
  const payload = getValidatedJson<typeof certificatesPageSchema>(c);
  const pageResult = await getCertificatesPage(
    c.env.DB,
    type,
    payload.page,
    undefined,
  );
  return c.json(pageResult);
}

export async function certificatesSearchController(c: Context<Env>) {
  const type = getCertificateType(c);
  const payload = getValidatedJson<typeof certificatesSearchSchema>(c);
  const pageResult = await getCertificatesPage(
    c.env.DB,
    type,
    payload.page,
    payload.filters as FilterInput[] | undefined,
  );
  return c.json(pageResult);
}

export async function getCertificateController(c: Context<Env>) {
  const type = getCertificateType(c);
  const id = requiredParam(c.req.param("id"), "id");
  const record = await getCertificateById(c.env.DB, type, id);
  return c.json(record);
}

export async function createCertificateController(c: Context<Env>) {
  const type = getCertificateType(c);
  const payload = getValidatedJson<typeof certificateMutationSchema>(c);
  const created = await createCertificate(c.env.DB, type, payload);
  return c.json(created);
}

export async function updateCertificateController(c: Context<Env>) {
  const type = getCertificateType(c);
  const id = requiredParam(c.req.param("id"), "id");
  const payload = getValidatedJson<typeof certificateMutationSchema>(c);
  const updated = await updateCertificate(c.env.DB, type, id, payload);
  return c.json(updated);
}

export async function deleteCertificateController(c: Context<Env>) {
  const type = getCertificateType(c);
  const id = requiredParam(c.req.param("id"), "id");
  await softDeleteCertificate(c.env.DB, type, id, c.get("userId"));
  return c.json({ success: true });
}

export async function printCertificateController(c: Context<Env>) {
  const type = getCertificateType(c);
  const id = requiredParam(c.req.param("id"), "id");

  const bearer = c.req.header("Authorization");
  const authHeaderToken = bearer?.startsWith("Bearer ") ? bearer.slice(7) : "";
  const authToken = asString(c.req.query("auth_token") || authHeaderToken);

  const html = await buildCertificatePrintHtml(
    c.env.DB,
    type,
    id,
    new URL(c.req.url).origin,
    authToken,
  );

  const shouldDownload = c.req.query("download") === "1";
  const responseHeaders = new Headers({
    "Content-Type": "text/html; charset=utf-8",
  });

  if (shouldDownload) {
    responseHeaders.set(
      "Content-Disposition",
      `attachment; filename="${type}-${id}.html"`,
    );
  }

  return new Response(html, { headers: responseHeaders });
}

export async function printPreviewController(c: Context<Env>) {
  const url = new URL(c.req.url);
  const nextPath = url.pathname.replace("/print-preview/", "/print/");
  url.searchParams.set("autoprint", "1");
  const query = url.searchParams.toString();
  const suffix = query ? `?${query}` : "";
  return c.redirect(`${nextPath}${suffix}`);
}
