export type RowMapper = (
  row: Record<string, unknown>,
) => Record<string, unknown>;

export type CertificateCrudConfig = {
  table: string;
  certificateType?: string;
  responseCertificateType: string;
  searchColumns: string[];
  insertColumns: string[];
  updateColumns: string[];
  jsonColumns?: string[];
  numberColumns?: string[];
  rowMapper: RowMapper;
};
