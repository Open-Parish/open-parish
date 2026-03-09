import { QueryClient } from '@tanstack/react-query';
import { shouldRetryQuery } from '@/query/shouldRetryQuery';

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
