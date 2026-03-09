export type CertificateKind = 'baptismal' | 'confirmation' | 'death' | 'marriage';

export type FilterInput = {
  key: string;
  value: string;
};

export type PaginatedResponse<T> = {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
};

export type SettingsRecord = {
  headerLine1: string;
  headerLine2: string;
  headerLine3: string;
  headerLine4: string;
  headerLine5: string;
  headerLine6: string;
  currentPriest: string;
  currentPriestSignature: string;
  pdfImageLeft: string;
  pdfImageRight: string;
};
