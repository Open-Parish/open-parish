import { Grid, Skeleton } from '@mantine/core';
import type { CSSProperties } from 'react';
import type { CertificateCountsGridProps } from './CertificateCountsGrid.types';
import { formatCount } from '../utils/formatCount';
import styles from '../Dashboard.module.css';

export function CertificateCountsGrid({ modules, totals, isLoading }: Readonly<CertificateCountsGridProps>) {
  return (
    <Grid gutter="sm">
      {modules.map((module) => {
        const Icon = module.icon;
        const count = totals?.[module.key];
        return (
          <Grid.Col key={module.key} span={{ base: 6, sm: 3 }}>
            <div className={styles.statCard} style={{ '--accent': module.accent } as CSSProperties}>
              <div className={styles.statIconWrap}>
                <Icon size={16} />
              </div>
              <div className={styles.statCount}>
                {isLoading ? <Skeleton height={22} width={40} radius="sm" /> : formatCount(count ?? 0)}
              </div>
              <div className={styles.statLabel}>{module.title.replace(' Certificates', '')}</div>
            </div>
          </Grid.Col>
        );
      })}
    </Grid>
  );
}
