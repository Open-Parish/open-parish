import { IconCross, IconDroplet, IconFlame, IconHearts } from '@tabler/icons-react';
import type { CertificateModule } from '../dashboard.types';

export const CERTIFICATE_MODULES: CertificateModule[] = [
  {
    path: '/baptismal',
    key: 'baptismal',
    title: 'Baptismal Certificates',
    subtitle: 'Water of life and spiritual rebirth',
    icon: IconDroplet,
    accent: '#3b82f6',
  },
  {
    path: '/confirmation',
    key: 'confirmation',
    title: 'Confirmation Certificates',
    subtitle: 'Gifts of the Holy Spirit',
    icon: IconFlame,
    accent: '#f97316',
  },
  {
    path: '/death',
    key: 'death',
    title: 'Death Certificates',
    subtitle: 'Eternal rest and burial records',
    icon: IconCross,
    accent: '#64748b',
  },
  {
    path: '/marriage',
    key: 'marriage',
    title: 'Marriage Certificates',
    subtitle: 'Sacred union and matrimonial records',
    icon: IconHearts,
    accent: '#a21a3a',
  },
];
