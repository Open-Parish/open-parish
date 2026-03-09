import { HTTPException } from "hono/http-exception";
import { ensureSettings } from "../../shared/lib/db";
import { buildCertificateHtml } from "../../shared/lib/print";
import type { FilterInput } from "../../shared/lib/types.types";
import { asString } from "../../shared/utils/normalize";
import { baptismalCrud } from "./baptismal.crud";
import { confirmationCrud } from "./confirmation.crud";
import type { CertificateCrud } from "./certificates.crud.types";
import type { CertificateRouteType } from "./certificates.controller.types";
import { deathCrud } from "./death.crud";
import { marriageCrud } from "./marriage.crud";

const CERTIFICATE_LABEL_MAP: Record<CertificateRouteType, string> = {
  marriage: "Certificate of Marriage",
  confirmation: "Certificate of Confirmation",
  death: "Certificate of Death",
  baptismal: "Certificate of Baptism",
};

const CRUD_BY_TYPE: Record<CertificateRouteType, CertificateCrud> = {
  baptismal: baptismalCrud,
  confirmation: confirmationCrud,
  death: deathCrud,
  marriage: marriageCrud,
};

function getCrud(type: CertificateRouteType): CertificateCrud {
  return CRUD_BY_TYPE[type];
}

export function resolveCertificateType(
  routeType: string,
): CertificateRouteType {
  const normalized = asString(routeType).trim() as CertificateRouteType;
  if (!(normalized in CRUD_BY_TYPE)) {
    throw new HTTPException(404, { message: "Unknown certificate type" });
  }
  return normalized;
}

export async function getCertificatesPage(
  db: D1Database,
  type: CertificateRouteType,
  pageInput: unknown,
  filters: FilterInput[] | undefined,
) {
  return getCrud(type).page(db, pageInput, filters);
}

export async function getCertificateById(
  db: D1Database,
  type: CertificateRouteType,
  id: string,
) {
  const row = await getCrud(type).getById(db, id);
  if (!row) {
    throw new HTTPException(404, { message: "Record not found" });
  }

  return row;
}

export async function createCertificate(
  db: D1Database,
  type: CertificateRouteType,
  payloadInput: unknown,
) {
  return getCrud(type).create(db, payloadInput);
}

export async function updateCertificate(
  db: D1Database,
  type: CertificateRouteType,
  id: string,
  payloadInput: unknown,
) {
  const updated = await getCrud(type).update(db, id, payloadInput);
  if (!updated) {
    throw new HTTPException(404, { message: "Record not found" });
  }

  return updated;
}

export async function softDeleteCertificate(
  db: D1Database,
  type: CertificateRouteType,
  id: string,
  deletedBy: string,
) {
  const success = await getCrud(type).softDelete(db, id, deletedBy);
  if (!success) {
    throw new HTTPException(404, { message: "Record not found" });
  }
}

export async function buildCertificatePrintHtml(
  db: D1Database,
  type: CertificateRouteType,
  id: string,
  baseUrl: string,
  authToken: string,
) {
  const record = await getCrud(type).getById(db, id);
  if (!record) {
    throw new HTTPException(404, { message: "Record not found" });
  }

  const settings = await ensureSettings(db);

  return buildCertificateHtml({
    title: CERTIFICATE_LABEL_MAP[type],
    certificateType: type,
    settings,
    record,
    baseUrl,
    authToken,
  });
}
