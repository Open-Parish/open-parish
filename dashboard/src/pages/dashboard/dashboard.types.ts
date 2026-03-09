import type { Icon } from '@tabler/icons-react';

export type CertificateModule = {
  path: string;
  key: 'baptismal' | 'confirmation' | 'death' | 'marriage';
  title: string;
  subtitle: string;
  icon: Icon;
  accent: string;
};
