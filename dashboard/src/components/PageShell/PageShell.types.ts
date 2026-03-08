import type { ReactNode } from 'react';
import type { BreadcrumbItem } from '@/components/Breadcrumbs/Breadcrumbs.types';

export type PageShellProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  headerContent?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
};
