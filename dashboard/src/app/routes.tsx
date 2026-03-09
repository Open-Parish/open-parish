import { Suspense, lazy } from 'react';
import type { ReactElement } from 'react';
import { SuspenseProgress } from '@/components/SuspenseProgress/SuspenseProgress';
import type { AppRoute } from './routes.types';

const Login = lazy(() => import('@/pages/auth/Login').then((module) => ({ default: module.Login })));
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard').then((module) => ({ default: module.Dashboard })));
const Settings = lazy(() => import('@/pages/settings/Settings').then((module) => ({ default: module.Settings })));
const CertificateListPage = lazy(() =>
  import('@/pages/certificates/CertificateListPage').then((module) => ({ default: module.CertificateListPage })),
);
const CertificateFormPage = lazy(() =>
  import('@/pages/certificates/CertificateFormPage').then((module) => ({ default: module.CertificateFormPage })),
);

function suspenseElement(element: ReactElement): ReactElement {
  return <Suspense fallback={<SuspenseProgress />}>{element}</Suspense>;
}

export const appRoutes: AppRoute[] = [
  {
    path: '/dashboard',
    element: suspenseElement(<Dashboard />),
    label: 'Dashboard',
  },
  {
    path: '/baptismal',
    element: suspenseElement(<CertificateListPage />),
    label: 'Baptismal',
  },
  {
    path: '/baptismal/new',
    element: suspenseElement(<CertificateFormPage />),
    label: 'New Baptismal',
  },
  {
    path: '/baptismal/edit/:id',
    element: suspenseElement(<CertificateFormPage />),
    label: 'Edit Baptismal',
  },
  {
    path: '/confirmation',
    element: suspenseElement(<CertificateListPage />),
    label: 'Confirmation',
  },
  {
    path: '/confirmation/new',
    element: suspenseElement(<CertificateFormPage />),
    label: 'New Confirmation',
  },
  {
    path: '/confirmation/edit/:id',
    element: suspenseElement(<CertificateFormPage />),
    label: 'Edit Confirmation',
  },
  {
    path: '/death',
    element: suspenseElement(<CertificateListPage />),
    label: 'Death',
  },
  {
    path: '/death/new',
    element: suspenseElement(<CertificateFormPage />),
    label: 'New Death',
  },
  {
    path: '/death/edit/:id',
    element: suspenseElement(<CertificateFormPage />),
    label: 'Edit Death',
  },
  {
    path: '/marriage',
    element: suspenseElement(<CertificateListPage />),
    label: 'Marriage',
  },
  {
    path: '/marriage/new',
    element: suspenseElement(<CertificateFormPage />),
    label: 'New Marriage',
  },
  {
    path: '/marriage/edit/:id',
    element: suspenseElement(<CertificateFormPage />),
    label: 'Edit Marriage',
  },
  {
    path: '/settings',
    element: suspenseElement(<Settings />),
    label: 'Settings',
  },
];

export const loginRoute = {
  path: '/login',
  element: suspenseElement(<Login />),
};
