import { Card, Grid } from '@mantine/core';
import { IconArrowUpRight } from '@tabler/icons-react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import type { CertificateCardsSectionProps } from './CertificateCardsSection.types';
import styles from '../Dashboard.module.css';

export function CertificateCardsSection({ modules }: Readonly<CertificateCardsSectionProps>) {
  return (
    <div>
      <p className={styles.sectionLabel}>Sacramental Records</p>
      <Grid gutter="sm">
        {modules.map(({ path, title, subtitle, icon: Icon, accent }) => (
          <Grid.Col key={path} span={{ base: 12, sm: 6 }}>
            <Card
              component={Link}
              to={path}
              padding="md"
              className={styles.certCard}
              style={{ '--accent': accent } as CSSProperties}
            >
              <div className={styles.certCardInner}>
                <div className={styles.certIconWrap}>
                  <Icon size={20} />
                </div>
                <div className={styles.certText}>
                  <p className={styles.certTitle}>{title}</p>
                  <p className={styles.certSub}>{subtitle}</p>
                </div>
                <IconArrowUpRight size={15} className={styles.certArrow} />
              </div>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
}
