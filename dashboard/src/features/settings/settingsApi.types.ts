export type SettingsPayload = {
  parishName: string;
  headerLine1: string;
  headerLine2: string;
  headerLine3: string;
  headerLine4: string;
  headerLine5: string;
  headerLine6: string;
  currentPriest: string;
  currentPriestSignature: string | File;
  pdfImageLeft: string | File;
  pdfImageRight: string | File;
  showParishSeal: boolean;
  showPdfImageLeft: boolean;
  showPdfImageRight: boolean;
};
