import { deleteJson, getJson, postJson, putJson } from '@/api/client';
import type {
  CertificateConfig,
  CertificatePageResponse,
  CertificateRecord,
  CertificateTotals,
} from './certificates.types';

function buildFilters(search: string) {
  const terms = search
    .split(' ')
    .map((item) => item.trim())
    .filter(Boolean);

  return terms.flatMap((term) => [
    { key: 'firstName', value: term },
    { key: 'lastName', value: term },
  ]);
}

export async function listCertificates(config: CertificateConfig, page: number, search: string) {
  const hasSearch = config.searchEnabled && search.trim().length > 0;
  const endpoint = `/certificates/${config.apiModule}/${hasSearch ? 'search' : 'page'}`;

  const payload: Record<string, unknown> = { page };
  if (config.certificateType) payload.type = config.certificateType;
  if (hasSearch) payload.filters = buildFilters(search);

  return postJson<CertificatePageResponse>(endpoint, payload);
}

export async function getCertificate(config: CertificateConfig, id: string) {
  return getJson<CertificateRecord>(`/certificates/${config.apiModule}/${id}`);
}

export async function createCertificate(config: CertificateConfig, values: Record<string, unknown>) {
  const payload = config.certificateType ? { ...values, certificateType: config.certificateType } : values;
  return postJson<CertificateRecord>(`/certificates/${config.apiModule}`, payload);
}

export async function updateCertificate(config: CertificateConfig, id: string, values: Record<string, unknown>) {
  const payload = config.certificateType ? { ...values, certificateType: config.certificateType } : values;
  return putJson<CertificateRecord>(`/certificates/${config.apiModule}/${id}`, payload);
}

export async function removeCertificate(config: CertificateConfig, id: string) {
  return deleteJson<{ success: boolean }>(`/certificates/${config.apiModule}/${id}`);
}

export async function getCertificateTotals() {
  return getJson<CertificateTotals>('/certificates/counts');
}
