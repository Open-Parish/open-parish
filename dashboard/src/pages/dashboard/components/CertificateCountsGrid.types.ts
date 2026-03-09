import type { CertificateTotals } from '@/features/certificates/certificates.types';
import type { CertificateModule } from '../dashboard.types';

export type CertificateCountsGridProps = {
  modules: CertificateModule[];
  totals?: CertificateTotals;
  isLoading: boolean;
};
