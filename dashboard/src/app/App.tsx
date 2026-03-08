import { Routes, Route, Navigate } from 'react-router-dom';
import { ReactQueryDevtools } from '@/devtools/ReactQueryDevtools';
import { DashboardLayout } from '@/components/DashboardLayout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { loginRoute, appRoutes } from './routes';

export function App() {
  const { authenticated } = useAuth();

  return (
    <>
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
    </>
  );
}
