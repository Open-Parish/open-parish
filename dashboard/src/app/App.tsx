import { Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Center, Loader } from '@mantine/core';
import { ReactQueryDevtools } from '@/devtools/ReactQueryDevtools';
import { DashboardLayout } from '@/components/DashboardLayout/DashboardLayout';
import { InstallWizard } from '@/pages/install/InstallWizard';
import { useAuth } from '@/context/AuthContext';
import { getInstallStatus } from '@/features/install/installApi';
import { loginRoute, appRoutes } from './routes';

function InstallGate({ children }: { children: React.ReactNode }) {
  const statusQuery = useQuery({
    queryKey: ['install-status'],
    queryFn: getInstallStatus,
    retry: false,
    staleTime: Infinity,
  });

  if (statusQuery.isLoading) {
    return (
      <Center style={{ minHeight: '100vh' }}>
        <Loader size="sm" color="wine" />
      </Center>
    );
  }

  if (statusQuery.data?.requiresWizard) {
    return <InstallWizard />;
  }

  return children;
}

export function App() {
  const { authenticated } = useAuth();

  return (
    <InstallGate>
      <Routes>
        <Route
          path={loginRoute.path}
          element={authenticated ? <Navigate to="/dashboard" replace /> : loginRoute.element}
        />
        <Route element={authenticated ? <DashboardLayout /> : <Navigate to="/login" replace />}>
          {appRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
        <Route path="/" element={<Navigate to={authenticated ? '/dashboard' : '/login'} replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <ReactQueryDevtools />
    </InstallGate>
  );
}
