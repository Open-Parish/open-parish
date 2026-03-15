import { asString, asTrimmedString } from "../utils/normalize";

export type TemplateBlock =
  | { kind: "title"; text: string }
  | { kind: "title2"; text: string }
  | { kind: "name"; text: string }
  | { kind: "label"; text: string }
  | { kind: "text"; text: string }
  | { kind: "spacer"; size?: "sm" | "md" | "lg" };

function toRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

export function fullName(value: unknown): string {
  const person = toRecord(value);
  const firstName = asTrimmedString(person.firstName);
  const lastName = asTrimmedString(person.lastName);
  return `${firstName} ${lastName}`.trim();
}

function ordinalSuffix(day: number): string {
  if (day % 100 >= 11 && day % 100 <= 13) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

export function fullDateText(value: unknown): string {
  if (!value) return "";
  const date = new Date(asString(value));
  if (Number.isNaN(date.getTime())) return "";

  const day = date.getUTCDate();
  const month = date.toLocaleString("en-US", {
    month: "long",
    timeZone: "UTC",
  });
  const year = date.getUTCFullYear();
  return `on the ${day}${ordinalSuffix(day)} day of ${month}, ${year}.`;
}

export function issueDateText(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function pairNames(primary: unknown, secondary: unknown): string {
  const first = fullName(primary);
  const second = fullName(secondary);
  if (first && second) return `${first} & ${second}`;
  return first || second;
}

export function buildCertificateTemplate(
  certificateType: string,
  record: Record<string, unknown>,
  title: string,
): TemplateBlock[] {
  if (certificateType === "death") {
    return [
      { kind: "title", text: "Certificate of Burial Rites" },
      {
        kind: "name",
        text: `${asTrimmedString(record.firstName)} ${asTrimmedString(record.lastName)}, ${asTrimmedString(record.age)}`,
      },
      { kind: "spacer", size: "sm" },
      { kind: "text", text: `Born in ${asTrimmedString(record.address)}` },
      {
        kind: "text",
        text: `Departed from this life ${fullDateText(record.deathDate)}`,
      },
      { kind: "spacer", size: "md" },
      {
        kind: "title2",
        text: "Was Solemnly Buried According to the Rite of the Roman Catholic Church",
      },
      { kind: "text", text: `in ${asTrimmedString(record.burialPlace)}` },
      { kind: "text", text: fullDateText(record.burialDate) },
      { kind: "spacer", size: "sm" },
      { kind: "text", text: `By ${fullName(record.celebrantPriest)}` },
      { kind: "spacer", size: "sm" },
      {
        kind: "text",
        text: `As it appears in the Register Book No: ${asString(record.bookNumber)}, page no: ${asString(record.pageNumber)}`,
      },
      { kind: "spacer", size: "sm" },
      {
        kind: "text",
        text: "This certification is being issued upon request for any legal purposes this may serve.",
      },
    ];
  }

  if (certificateType === "marriage") {
    return [
      { kind: "title", text: "Certificate of Holy Matrimony" },
      { kind: "name", text: fullName(record.bride) },
      { kind: "spacer", size: "sm" },
      { kind: "label", text: "and" },
      { kind: "text", text: fullName(record.groom) },
      { kind: "spacer", size: "sm" },
      { kind: "text", text: fullDateText(record.occasionDate) },
      { kind: "spacer", size: "md" },
      {
        kind: "title2",
        text: "Were Solemnly Married According to the Rite of the Roman Catholic Church",
      },
      { kind: "text", text: `By ${fullName(record.celebrantPriest)}` },
      { kind: "spacer", size: "sm" },
      { kind: "label", text: "The Sponsors being" },
      { kind: "text", text: pairNames(record.sponsor1, record.sponsor2) },
      { kind: "spacer", size: "sm" },
      {
        kind: "text",
        text: `As it appears in the Register Book No: ${asString(record.bookNumber)}, page no: ${asString(record.pageNumber)}`,
      },
    ];
  }

  return [
    { kind: "title", text: title },
    {
      kind: "name",
      text: `${asTrimmedString(record.firstName)} ${asTrimmedString(record.lastName)}`,
    },
    { kind: "spacer", size: "sm" },
    { kind: "label", text: "Child of" },
    { kind: "text", text: pairNames(record.parent1, record.parent2) },
    { kind: "spacer", size: "sm" },
    { kind: "text", text: `Born in ${asTrimmedString(record.address)}` },
    { kind: "text", text: fullDateText(record.birthDate) },
    { kind: "spacer", size: "md" },
    {
      kind: "title2",
      text: `Was Solemnly ${title.includes("Confirmation") ? "Confirmed" : "Baptized"} According to the Rite of the Roman Catholic Church`,
    },
    { kind: "text", text: fullDateText(record.occasionDate) },
    { kind: "spacer", size: "sm" },
    { kind: "text", text: `By ${fullName(record.celebrantPriest)}` },
    { kind: "spacer", size: "sm" },
    { kind: "label", text: "The Sponsors being" },
    { kind: "text", text: pairNames(record.sponsor1, record.sponsor2) },
    { kind: "spacer", size: "sm" },
    {
      kind: "text",
      text: `As it appears in the Register Book No: ${asString(record.bookNumber)}, page no: ${asString(record.pageNumber)}`,
    },
  ];
}
