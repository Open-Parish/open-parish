import { Text } from '@mantine/core';
import isFunction from 'lodash/isFunction';
import type { QueryStateProps } from './QueryState.types';

export function QueryState<TData>({
  query,
  isEmpty,
  isNotFound = false,
  errorMessage = 'Unable to load data.',
  emptyMessage = 'No results found.',
  emptyContent,
  loadingMessage = 'Loading...',
  notFoundMessage = 'Not found.',
  children,
}: QueryStateProps<TData>) {
  if (query.isError) {
    return <Text c="red">{errorMessage}</Text>;
  }
  if (isNotFound) {
    return <Text c="dimmed">{notFoundMessage}</Text>;
  }
  if (query.isLoading) {
    return <Text c="dimmed">{loadingMessage}</Text>;
  }
  if (isEmpty) {
    if (emptyContent) {
      return isFunction(emptyContent) ? emptyContent() : emptyContent;
    }
    return <Text c="dimmed">{emptyMessage}</Text>;
  }
  return children;
}
