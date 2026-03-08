import { QueryClient } from '@tanstack/react-query';

const getErrorStatus = (error: unknown): number | null => {
  if (typeof error !== 'object' || error === null) return null;
  const candidate = error as { status?: unknown };
  return typeof candidate.status === 'number' ? candidate.status : null;
};

const shouldRetryQuery = (failureCount: number, error: unknown): boolean => {
  const status = getErrorStatus(error);

  // Do not retry client errors (except rate limits).
  if (status !== null && status >= 400 && status < 500 && status !== 429) {
    return false;
  }

  // Stop after multiple failures for all other errors.
  return failureCount < 2;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: shouldRetryQuery,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
    },
  },
});

export const QUERY_PERSIST_MAX_AGE = 1000 * 60 * 60 * 24 * 7;
export const QUERY_PERSIST_STORAGE_KEY = 'saas-app-react-query-cache';
const LEGACY_QUERY_PERSIST_STORAGE_KEY = 'REACT_QUERY_OFFLINE_CACHE';

export const clearPersistedQueryCache = () => {
  queryClient.clear();
  if (typeof window === 'undefined') return;

  window.localStorage.removeItem(QUERY_PERSIST_STORAGE_KEY);
  // Remove old default key as well to prevent stale data hanging around.
  window.localStorage.removeItem(LEGACY_QUERY_PERSIST_STORAGE_KEY);
};
