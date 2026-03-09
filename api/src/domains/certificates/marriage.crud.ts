import {
  asNumber,
  asString,
  parseJsonObjectString,
} from "../../shared/utils/normalize";
import { createCertificateCrud } from "./core/createCertificateCrud";

const CERTIFICATE_TYPE = "marriage";

function parseMarriageRow(row: Record<string, unknown>) {
  const bride = parseJsonObjectString(row.bride);

  return {
    id: asString(row.id),
    certificateType: CERTIFICATE_TYPE,
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

export const marriageCrud = createCertificateCrud({
  table: "marriages",
  responseCertificateType: CERTIFICATE_TYPE,
  searchColumns: ["bride", "groom"],
  jsonColumns: ["bride", "groom", "sponsor1", "sponsor2", "celebrantPriest"],
  numberColumns: ["bookNumber", "pageNumber"],
  insertColumns: [
    "bride",
    "groom",
    "sponsor1",
    "sponsor2",
    "licenseNumber",
    "registryNumber",
    "remarks",
    "occasionDate",
    "celebrantPriest",
    "bookNumber",
    "pageNumber",
    "user",
  ],
  updateColumns: [
    "bride",
    "groom",
    "sponsor1",
    "sponsor2",
    "licenseNumber",
    "registryNumber",
    "remarks",
    "occasionDate",
    "celebrantPriest",
    "bookNumber",
    "pageNumber",
    "user",
  ],
  rowMapper: parseMarriageRow,
});
