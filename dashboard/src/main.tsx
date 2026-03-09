import '@mantine/core/styles.css';
import '@mantine/nprogress/styles.css';
import '@mantine/notifications/styles.css';
import './styles/global.css';

import React, { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { NavigationProgress } from '@mantine/nprogress';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { BrowserRouter } from 'react-router-dom';
import { generateColors } from '@mantine/colors-generator';
import { App } from './app/App';
import { theme } from './styles/theme';
import { queryClient, QUERY_PERSIST_MAX_AGE, QUERY_PERSIST_STORAGE_KEY } from './queryClient';
import { AppBoundary } from './AppBoundary';
import { AuthProvider } from './context/AuthContext';
import { UiProvider, useUi } from './context/UiContext';

const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: QUERY_PERSIST_STORAGE_KEY,
});

function Providers() {
  const { colorScheme, primaryColor } = useUi();

  const dynamicTheme = useMemo(() => {
    if (!primaryColor) return theme;
    return createTheme({
      ...theme,
      colors: { ...theme.colors, custom: generateColors(primaryColor) },
      primaryColor: 'custom',
    });
  }, [primaryColor]);

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister, maxAge: QUERY_PERSIST_MAX_AGE }}>
      <MantineProvider defaultColorScheme="light" forceColorScheme={colorScheme} theme={dynamicTheme}>
        <NavigationProgress />
        <Notifications position="top-right" />
        <ModalsProvider>
          <AuthProvider>
            <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
              <AppBoundary>
                <App />
              </AppBoundary>
            </BrowserRouter>
          </AuthProvider>
        </ModalsProvider>
      </MantineProvider>
    </PersistQueryClientProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UiProvider>
      <Providers />
    </UiProvider>
  </React.StrictMode>,
);
