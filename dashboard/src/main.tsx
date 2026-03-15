import '@mantine/core/styles.css';
import '@mantine/nprogress/styles.css';
import '@mantine/notifications/styles.css';
import './styles/global.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { NavigationProgress } from '@mantine/nprogress';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { BrowserRouter } from 'react-router-dom';
import { App } from './app/App';
import { theme } from './styles/theme';
import { queryClient, QUERY_PERSIST_MAX_AGE, QUERY_PERSIST_STORAGE_KEY } from './queryClient';
import { AppBoundary } from './AppBoundary';
import { AuthProvider } from './context/AuthContext';
import { UiProvider, useUi } from './context/UiContext';

const persister = createSyncStoragePersister({
  storage: globalThis.localStorage,
  key: QUERY_PERSIST_STORAGE_KEY,
});

function Providers() {
  const { colorScheme } = useUi();

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister, maxAge: QUERY_PERSIST_MAX_AGE }}>
      <MantineProvider defaultColorScheme="light" forceColorScheme={colorScheme} theme={theme}>
        <NavigationProgress color="#c9a157" size={8} />
        <Notifications position="top-right" />
        <ModalsProvider>
          <AuthProvider>
            <BrowserRouter>
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
