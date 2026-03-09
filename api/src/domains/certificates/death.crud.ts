import {
  asNumber,
  asString,
  parseJsonObjectString,
} from "../../shared/utils/normalize";
import { createCertificateCrud } from "./core/createCertificateCrud";

const CERTIFICATE_TYPE = "death";

function parseDeathRow(row: Record<string, unknown>) {
  return {
    id: asString(row.id),
    certificateType: CERTIFICATE_TYPE,
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

export const deathCrud = createCertificateCrud({
  table: "deaths",
  responseCertificateType: CERTIFICATE_TYPE,
  searchColumns: ["firstName", "lastName"],
  jsonColumns: ["survivors", "celebrantPriest"],
  numberColumns: ["bookNumber", "pageNumber"],
  insertColumns: [
    "firstName",
    "lastName",
    "address",
    "age",
    "survivors",
    "burialDate",
    "deathDate",
    "burialPlace",
    "sacraments",
    "celebrantPriest",
    "bookNumber",
    "pageNumber",
    "user",
  ],
  updateColumns: [
    "firstName",
    "lastName",
    "address",
    "age",
    "survivors",
    "burialDate",
    "deathDate",
    "burialPlace",
    "sacraments",
    "celebrantPriest",
    "bookNumber",
    "pageNumber",
    "user",
  ],
  rowMapper: parseDeathRow,
});
