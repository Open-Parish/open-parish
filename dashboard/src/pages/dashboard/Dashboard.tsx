import { Card, Grid, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import {
  IconArrowUpRight,
  IconCross,
  IconDroplet,
  IconFlame,
  IconHearts,
  IconSettings,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { PageShell } from '@/components/PageShell/PageShell';
import styles from './Dashboard.module.css';

const MODULES = [
  {
    path: '/baptismal',
    title: 'Baptismal Certificates',
    subtitle: 'Record and manage baptismal sacraments',
    icon: IconDroplet,
    color: 'wine',
  },
  {
    path: '/confirmation',
    title: 'Confirmation Certificates',
    subtitle: 'Track confirmation sacrament records',
    icon: IconFlame,
    color: 'orange',
  },
  {
    path: '/death',
    title: 'Death Certificates',
    subtitle: 'Maintain death and burial records',
    icon: IconCross,
    color: 'gray',
  },
  {
    path: '/marriage',
    title: 'Marriage Certificates',
    subtitle: 'Record matrimonial sacrament details',
    icon: IconHearts,
    color: 'pink',
  },
  {
    path: '/settings',
    title: 'Settings',
    subtitle: 'Parish header and print configuration',
    icon: IconSettings,
    color: 'yellow',
  },
] as const;

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function Dashboard() {
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <PageShell title="Dashboard" subtitle="Parish certificate management system.">
      {/* Welcome banner */}
      <div className={styles.banner}>
        <div className={styles.bannerOrb1} />
        <div className={styles.bannerOrb2} />
        <Stack gap={4}>
          <p className={styles.bannerEyebrow}>{dateStr}</p>
          <h2 className={styles.bannerTitle}>{getGreeting()}, Admin</h2>
          <p className={styles.bannerSub}>
            Select a module below to manage parish records and generate certificates.
          </p>
        </Stack>
      </div>

      {/* Module cards */}
      <Grid gutter="md">
        {MODULES.map(({ path, title, subtitle, icon: Icon, color }) => (
          <Grid.Col key={path} span={{ base: 12, sm: 6, lg: 4 }}>
            <Card
              component={Link}
              to={path}
              withBorder
              radius="md"
              padding="lg"
              className={styles.moduleCard}
            >
              <Group justify="space-between" mb="md" align="flex-start">
                <ThemeIcon variant="light" color={color} size={40} radius="md">
                  <Icon size={20} />
                </ThemeIcon>
                <IconArrowUpRight size={16} className={styles.cardArrow} color="var(--mantine-color-dimmed)" />
              </Group>
              <Text fw={600} size="sm" mb={4}>
                {title}
              </Text>
              <Text size="xs" c="dimmed">
                {subtitle}
              </Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </PageShell>
  );
}
