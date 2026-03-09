import {
  asNumber,
  asString,
  parseJsonObjectString,
} from "../../shared/utils/normalize";
import { createCertificateCrud } from "./core/createCertificateCrud";

const CERTIFICATE_TYPE = "confirmation";

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

export const confirmationCrud = createCertificateCrud({
  table: "births",
  certificateType: CERTIFICATE_TYPE,
  responseCertificateType: CERTIFICATE_TYPE,
  searchColumns: ["firstName", "lastName"],
  jsonColumns: [
    "parent1",
    "parent2",
    "celebrantPriest",
    "sponsor1",
    "sponsor2",
  ],
  numberColumns: ["bookNumber", "pageNumber"],
  insertColumns: [
    "firstName",
    "lastName",
    "address",
    "parent1",
    "parent2",
    "celebrantPriest",
    "sponsor1",
    "sponsor2",
    "birthDate",
    "occasionDate",
    "bookNumber",
    "pageNumber",
    "user",
  ],
  updateColumns: [
    "firstName",
    "lastName",
    "address",
    "parent1",
    "parent2",
    "celebrantPriest",
    "sponsor1",
    "sponsor2",
    "birthDate",
    "occasionDate",
    "bookNumber",
    "pageNumber",
    "user",
  ],
  rowMapper: parseBirthRow,
});
