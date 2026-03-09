import type { FilterInput } from "../../shared/lib/types.types";

export type CertificatePageResult = {
  docs: Record<string, unknown>[];
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

export type CertificateCrud = {
  page: (
    db: D1Database,
    pageInput: unknown,
    filters: FilterInput[] | undefined,
  ) => Promise<CertificatePageResult>;
  getById: (
    db: D1Database,
    id: string,
  ) => Promise<Record<string, unknown> | null>;
  create: (
    db: D1Database,
    payloadInput: unknown,
  ) => Promise<Record<string, unknown>>;
  update: (
    db: D1Database,
    id: string,
    payloadInput: unknown,
  ) => Promise<Record<string, unknown> | null>;
  softDelete: (
    db: D1Database,
    id: string,
    deletedBy: string,
  ) => Promise<boolean>;
};
