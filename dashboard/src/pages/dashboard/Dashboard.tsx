import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { PageShell } from '@/components/PageShell/PageShell';
import { getCertificateTotals } from '@/features/certificates/api';
import { CERTIFICATE_MODULES } from './data/certificateModules';
import { DashboardBanner } from './components/DashboardBanner';
import { CertificateCountsGrid } from './components/CertificateCountsGrid';
import { CertificateCardsSection } from './components/CertificateCardsSection';
import { SettingsCardSection } from './components/SettingsCardSection';
import { firstNameFromEmail } from './utils/firstNameFromEmail';

export function Dashboard() {
  const { email } = useAuth();
  const firstName = firstNameFromEmail(email);
  const totalsQuery = useQuery({
    queryKey: ['cert-totals'],
    queryFn: getCertificateTotals,
    staleTime: 60_000,
  });

  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <PageShell title="Dashboard" subtitle="Parish certificate management system.">
      <DashboardBanner dateLabel={dateStr} firstName={firstName} />
      <CertificateCountsGrid
        modules={CERTIFICATE_MODULES}
        totals={totalsQuery.data}
        isLoading={totalsQuery.isLoading}
      />
      <CertificateCardsSection modules={CERTIFICATE_MODULES} />
      <SettingsCardSection />
    </PageShell>
  );
}
