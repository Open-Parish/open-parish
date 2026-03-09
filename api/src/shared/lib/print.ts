import type { SettingsRecord } from "./types.types";

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function toRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function fullName(value: unknown): string {
  const person = toRecord(value);
  const firstName = String(person.firstName ?? "").trim();
  const lastName = String(person.lastName ?? "").trim();
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

function fullDateLine(value: unknown): string {
  if (!value) return "";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "";

  const day = date.getUTCDate();
  const month = date.toLocaleString("en-US", {
    month: "long",
    timeZone: "UTC",
  });
  const year = date.getUTCFullYear();
  const ordinal = ordinalSuffix(day);

  return `<span class="label">on the</span> ${day}<sup>${ordinal}</sup><span class="label"> day of</span> ${escapeHtml(month)}<span class="label">,</span> ${year}.`;
}

function pairNames(primary: unknown, secondary: unknown): string {
  const first = fullName(primary);
  const second = fullName(secondary);
  if (first && second)
    return `${escapeHtml(first)} &amp; ${escapeHtml(second)}`;
  return escapeHtml(first || second);
}

function birthBody(record: Record<string, unknown>, title: string) {
  return `
    <h1 class="certificate-title">${escapeHtml(title)}</h1>
    <div id="birth-child-data">
      <p><span id="child-name">${escapeHtml(record.firstName)} ${escapeHtml(record.lastName)}</span></p>
      <p>&nbsp;</p>
      <p class="label"><i>Child of</i></p>
      <p id="parents">${pairNames(record.parent1, record.parent2)}</p>
      <p>&nbsp;</p>
      <p>
        <span class="label">Born in</span> ${escapeHtml(record.address)}<br/>
        ${fullDateLine(record.birthDate)}
      </p>
    </div>
    <p>&nbsp;</p>
    <h1 class="certificate-title2">Was Solemnly ${title.includes("Confirmation") ? "Confirmed" : "Baptized"} According<br/>to the Rite of the Roman Catholic Church</h1>
    <p>${fullDateLine(record.occasionDate)}</p>
    <p>&nbsp;</p>
    <p><span class="label">By </span>${escapeHtml(fullName(record.celebrantPriest))}</p>
    <p>&nbsp;</p>
    <p><span class="label">The Sponsors being</span></p>
    <p>${pairNames(record.sponsor1, record.sponsor2)}</p>
    <p>&nbsp;</p>
    <p><span class="label">As it appears in the Register Book No: <b>${escapeHtml(record.bookNumber)}</b>, page no: ${escapeHtml(record.pageNumber)}</span></p>
  `;
}

function deathBody(record: Record<string, unknown>) {
  return `
    <h1 class="certificate-title">Certificate of Burial Rites</h1>
    <div id="birth-child-data">
      <p><span id="child-name">${escapeHtml(record.firstName)} ${escapeHtml(record.lastName)}, ${escapeHtml(record.age)}</span></p>
      <p>&nbsp;</p>
      <p><span class="label">Born in</span> ${escapeHtml(record.address)}</p>
      <p><span class="label">Departed from this life </span>${fullDateLine(record.deathDate)}</p>
    </div>
    <p>&nbsp;</p>
    <h1 class="certificate-title2">Was Solemnly Buried According<br/>to the Rite of the Roman Catholic Church</h1>
    <p><span class="label">in </span>${escapeHtml(record.burialPlace)}</p>
    <p>${fullDateLine(record.burialDate)}</p>
    <p>&nbsp;</p>
    <p><span class="label">By </span>${escapeHtml(fullName(record.celebrantPriest))}</p>
    <p>&nbsp;</p>
    <p><span class="label">As it appears in the Register Book No: <b>${escapeHtml(record.bookNumber)}</b>, page no: ${escapeHtml(record.pageNumber)}</span></p>
    <p>&nbsp;</p>
    <p><span class="label">This certification is being issued upon request for any legal purposes this may serve.</span></p>
  `;
}

function marriageBody(record: Record<string, unknown>) {
  const bride = fullName(record.bride);
  const groom = fullName(record.groom);
  return `
    <h1 class="certificate-title">Certificate of Holy Matrimony</h1>
    <div id="birth-child-data">
      <p><span id="child-name">${escapeHtml(bride)}</span></p>
      <p>&nbsp;</p>
      <p class="label"><i>and</i></p>
      <p id="parents">${escapeHtml(groom)}</p>
      <p>&nbsp;</p>
      <p>${fullDateLine(record.occasionDate)}</p>
    </div>
    <p>&nbsp;</p>
    <h1 class="certificate-title2">Were Solemnly Married According<br/>to the Rite of the Roman Catholic Church</h1>
    <p><span class="label">By </span>${escapeHtml(fullName(record.celebrantPriest))}</p>
    <p>&nbsp;</p>
    <p><span class="label">The Sponsors being</span></p>
    <p>${pairNames(record.sponsor1, record.sponsor2)}</p>
    <p>&nbsp;</p>
    <p><span class="label">As it appears in the Register Book No: <b>${escapeHtml(record.bookNumber)}</b>, page no: ${escapeHtml(record.pageNumber)}</span></p>
  `;
}

function buildBody(
  certificateType: string,
  record: Record<string, unknown>,
  title: string,
): string {
  if (certificateType === "death") return deathBody(record);
  if (certificateType === "marriage") return marriageBody(record);
  return birthBody(record, title);
}

export function buildCertificateHtml(input: {
  title: string;
  certificateType: string;
  record: Record<string, unknown>;
  settings: SettingsRecord;
  baseUrl: string;
  authToken?: string;
}): string {
  const { title, certificateType, record, settings, baseUrl, authToken } =
    input;
  const now = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const body = buildBody(certificateType, record, title);
  const leftImageUrl = resolveAssetUrl(
    settings.pdfImageLeft,
    baseUrl,
    authToken,
  );
  const rightImageUrl = resolveAssetUrl(
    settings.pdfImageRight || settings.pdfImageLeft,
    baseUrl,
    authToken,
  );
  const signatureUrl = resolveAssetUrl(
    settings.currentPriestSignature,
    baseUrl,
    authToken,
  );

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link href="https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,300;1,400&display=swap" rel="stylesheet" />
    <style>
      body { margin: 100px 40px 40px 40px; font-family: 'Lato', sans-serif; line-height: 120%; text-align: center; }
      #header { font-weight: 300; display: flex; width: 100%; }
      #header h1 { font-size: 20px; font-weight: 700; margin-top: 5px; margin-bottom: 5px; }
      #header h2 { font-size: 16px; margin-bottom: 5px; }
      #header h3 { font-size: 13px; margin-bottom: 5px; font-weight: 300; }
      #header-wrapper { flex-grow: 1; }
      #logo, #logo2 { width: 150px; }
      .certificate-title, .certificate-title2 { font-family: 'Pinyon Script', serif; font-weight: bold; margin-top: 50px; margin-bottom: 50px; }
      .certificate-title { font-size: 55px; }
      .certificate-title2 { font-size: 25px; line-height: 30px; margin: 10px 0; }
      .label { font-size: 12px; font-style: italic; font-weight: 300; }
      #child-name { font-size: 25px; font-weight: bold; border-bottom: #333 solid 2px; padding: 0 40px 4px 40px; }
      #parents { font-size: 18px; }
      #print-wrapper { padding: 10px; position: absolute; top: 0; left: 0; right: 0; display: flex; justify-content: space-between; background-color: #fff4c2; }
      #bottom-holder { display: flex; margin-top: 20px; }
      #bottom-holder > div { width: calc(100% / 3); }
      #seal { font-size: 11px; color: #7f7f7f; text-align: left; }
      #currentPriest { font-size: 80%; }
      @media print {
        @page { margin: -0.5in 0.5in; }
        body { margin: 0; }
        #print-wrapper, #print-wrapper button, #print-wrapper a { display: none; }
      }
    </style>
  </head>
  <body>
    <div id="print-wrapper">
      <button onclick="window.close()">Close</button>
      <div>
        <button onclick="window.print()">Print</button>
        <a href="?download=1">Download</a>
      </div>
    </div>
    <div id="header">
      <div id="logo">${leftImageUrl ? `<img src="${escapeHtml(leftImageUrl)}" width="125" alt="PDF Header Left Image" />` : ""}</div>
      <div id="header-wrapper">
        <h1>${escapeHtml(settings.headerLine1)}</h1>
        <h1>${escapeHtml(settings.headerLine2)}</h1>
        <h2>${escapeHtml(settings.headerLine3)}</h2>
        <h2>${escapeHtml(settings.headerLine4)}</h2>
        <h3>${escapeHtml(settings.headerLine5)}</h3>
        <h3>${escapeHtml(settings.headerLine6)}</h3>
      </div>
      <div id="logo2">${rightImageUrl ? `<img src="${escapeHtml(rightImageUrl)}" width="110" alt="PDF Header Right Image" />` : ""}</div>
    </div>
    ${body}
    <p>&nbsp;</p>
    <p><span class="label">Date: ${escapeHtml(now)}</span></p>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <div id="bottom-holder">
      <div id="seal">Parish Seal</div>
      <div id="signature">
        ${signatureUrl ? `<img src="${escapeHtml(signatureUrl)}" width="140" alt="Parish Priest Signature" />` : ""}
        <p id="currentPriest">${escapeHtml(settings.currentPriest)}</p>
        <p><span class="label">Parish Priest</span></p>
      </div>
      <div>&nbsp;</div>
    </div>
    <script>
      if (new URLSearchParams(window.location.search).get('autoprint') === '1') {
        window.print();
      }
    </script>
  </body>
</html>`;
}

function withAuthToken(url: string, authToken?: string): string {
  if (!authToken) return url;
  const [path, query = ""] = url.split("?");
  const params = new URLSearchParams(query);
  params.set("auth_token", authToken);
  return `${path}?${params.toString()}`;
}

function resolveAssetUrl(
  value: string,
  baseUrl: string,
  authToken?: string,
): string {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return "";
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }
  if (trimmed.startsWith("/")) {
    return withAuthToken(`${baseUrl}${trimmed}`, authToken);
  }
  return withAuthToken(`${baseUrl}/upload/file/${trimmed}`, authToken);
}
