import type { ReactNode } from 'react';
import type { UseQueryResult } from '@tanstack/react-query';

export type QueryStateValue<TData> = UseQueryResult<TData> | { isLoading: boolean; isError: boolean };

export type QueryStateProps<TData> = {
  query: QueryStateValue<TData>;
  isEmpty: boolean;
  isNotFound?: boolean;
  errorMessage?: string;
  emptyMessage?: string;
  emptyContent?: ReactNode | (() => ReactNode);
  loadingMessage?: string;
  notFoundMessage?: string;
  children: ReactNode;
};
