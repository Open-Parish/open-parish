import type { SettingsRecord } from "./types.types";
import { asString, asTrimmedString } from "../utils/normalize";
import { pickString } from "../utils/pickString";
import {
  buildCertificateTemplate,
  issueDateText,
  type TemplateBlock,
} from "./printTemplate";

function escapeHtml(value: unknown): string {
  return asString(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderTemplateBlock(block: TemplateBlock): string {
  switch (block.kind) {
    case "title":
      return `<h1 class="certificate-title">${escapeHtml(block.text)}</h1>`;
    case "title2":
      return `<h1 class="certificate-title2">${escapeHtml(block.text)}</h1>`;
    case "name":
      return `<p><span id="child-name">${escapeHtml(block.text)}</span></p>`;
    case "label":
      return `<p class="label"><i>${escapeHtml(block.text)}</i></p>`;
    case "text":
      return `<p>${escapeHtml(block.text)}</p>`;
    case "spacer":
      return `<p>&nbsp;</p>`;
  }
}

export function buildCertificateHtml(input: {
  title: string;
  certificateType: string;
  record: Record<string, unknown>;
  settings: SettingsRecord;
  baseUrl: string;
}): string {
  const { title, certificateType, record, settings, baseUrl } = input;
  const now = issueDateText();
  const body = buildCertificateTemplate(certificateType, record, title)
    .map(renderTemplateBlock)
    .join("");
  const leftImageUrl = resolveAssetUrl(settings.pdfImageLeft, baseUrl);
  const rightImageUrl = resolveAssetUrl(
    pickString(settings.pdfImageRight, settings.pdfImageLeft),
    baseUrl,
  );
  const signatureUrl = resolveAssetUrl(
    settings.currentPriestSignature,
    baseUrl,
  );
  const showLeftImage = settings.showPdfImageLeft && Boolean(leftImageUrl);
  const showRightImage = settings.showPdfImageRight && Boolean(rightImageUrl);
  const showParishSeal = settings.showParishSeal;

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
      body { margin: 0; font-family: 'Lato', sans-serif; line-height: 1.12; text-align: center; background: #ffffff; }
      .certificate-page { width: 7.65in; min-height: 10.15in; margin: 0 auto; padding: 72px 28px 28px 28px; box-sizing: border-box; }
      #header { font-weight: 300; display: flex; width: 100%; }
      #header h1 { font-size: 18px; font-weight: 700; margin-top: 4px; margin-bottom: 4px; }
      #header h2 { font-size: 14px; margin-bottom: 4px; }
      #header h3 { font-size: 12px; margin-bottom: 4px; font-weight: 300; }
      #header-wrapper { flex-grow: 1; }
      #logo, #logo2 { width: 150px; }
      #certificate-body p { margin: 7px 0; }
      .certificate-title, .certificate-title2 { font-family: 'Pinyon Script', serif; font-weight: bold; margin-top: 34px; margin-bottom: 34px; }
      .certificate-title { font-size: 48px; }
      .certificate-title2 { font-size: 22px; line-height: 26px; margin: 8px 0; }
      .label { font-size: 11px; font-style: italic; font-weight: 300; }
      #child-name { font-size: 22px; font-weight: bold; border-bottom: #333 solid 2px; padding: 0 28px 4px 28px; }
      #parents { font-size: 18px; }
      #print-wrapper { padding: 10px; position: absolute; top: 0; left: 0; right: 0; display: flex; justify-content: space-between; background-color: #fff4c2; }
      #bottom-holder { display: flex; margin-top: 12px; }
      #bottom-holder > div { width: calc(100% / 3); }
      #seal { font-size: 11px; color: #7f7f7f; text-align: left; }
      #currentPriest { font-size: 80%; }
      @media print {
        @page { size: Letter portrait; margin: 0.35in; }
        body { margin: 0; background: #ffffff; }
        .certificate-page { width: 100%; min-height: auto; padding: 0; transform: scale(0.96); transform-origin: top center; }
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
    <div class="certificate-page">
      <div id="header">
        <div id="logo">${showLeftImage ? `<img src="${escapeHtml(leftImageUrl)}" width="125" alt="PDF Header Left Image" />` : ""}</div>
        <div id="header-wrapper">
          <h1>${escapeHtml(settings.headerLine1)}</h1>
          <h1>${escapeHtml(settings.headerLine2)}</h1>
          <h2>${escapeHtml(settings.headerLine3)}</h2>
          <h2>${escapeHtml(settings.headerLine4)}</h2>
          <h3>${escapeHtml(settings.headerLine5)}</h3>
          <h3>${escapeHtml(settings.headerLine6)}</h3>
        </div>
        <div id="logo2">${showRightImage ? `<img src="${escapeHtml(rightImageUrl)}" width="110" alt="PDF Header Right Image" />` : ""}</div>
      </div>
      <div id="certificate-body">${body}</div>
      <p>&nbsp;</p>
      <p><span class="label">Date: ${escapeHtml(now)}</span></p>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <div id="bottom-holder">
        <div id="seal">${showParishSeal ? "Parish Seal" : "&nbsp;"}</div>
        <div id="signature">
          ${signatureUrl ? `<img src="${escapeHtml(signatureUrl)}" width="140" alt="Parish Priest Signature" />` : ""}
          <p id="currentPriest">${escapeHtml(settings.currentPriest)}</p>
          <p><span class="label">Parish Priest</span></p>
        </div>
        <div>&nbsp;</div>
      </div>
    </div>
    <script>
      if (new URLSearchParams(window.location.search).get('autoprint') === '1') {
        window.print();
      }
    </script>
  </body>
</html>`;
}

export function resolveAssetUrl(
  value: string,
  baseUrl: string,
): string {
  const trimmed = asTrimmedString(value);
  if (!trimmed) return "";
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }
  if (trimmed.startsWith("/")) {
    return `${baseUrl}${trimmed}`;
  }
  return `${baseUrl}/upload/file/${trimmed}`;
}
