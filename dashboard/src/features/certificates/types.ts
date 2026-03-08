export type Person = {
  firstName: string;
  lastName: string;
};

export type CertificateRecord = {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  certificateType?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
};

export type CertificatePageResponse = {
  docs: CertificateRecord[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
};

export type FormField = {
  path: string;
  label: string;
  type?: 'text' | 'date' | 'number';
};

export type CertificateConfig = {
  key: 'baptismal' | 'confirmation' | 'death' | 'marriage';
  routePath: string;
  apiModule: 'birth' | 'death' | 'marriage';
  certificateType?: 'baptismal' | 'confirmation' | 'death' | 'marriage';
  title: string;
  subtitle: string;
  listTitle: string;
  fields: FormField[];
  defaultValues: Record<string, unknown>;
  searchEnabled?: boolean;
  nameFromRecord: (record: CertificateRecord) => string;
  secondaryFromRecord?: (record: CertificateRecord) => string;
};
