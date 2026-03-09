import { Text } from '@mantine/core';
import isFunction from 'lodash/isFunction';
import type { QueryStateProps } from './QueryState.types';

export function QueryState<TData>({
  query,
  isEmpty,
  isNotFound = false,
  errorMessage = 'Unable to load data.',
  errorContent,
  emptyMessage = 'No results found.',
  emptyContent,
  loadingMessage = 'Loading...',
  loadingContent,
  notFoundMessage = 'Not found.',
  children,
}: QueryStateProps<TData>) {
  if (query.isError) {
    if (errorContent) {
      return isFunction(errorContent) ? errorContent() : errorContent;
    }
    return <Text c="red">{errorMessage}</Text>;
  }
  if (isNotFound) {
    return <Text c="dimmed">{notFoundMessage}</Text>;
  }
  if (query.isLoading) {
    if (loadingContent) {
      return isFunction(loadingContent) ? loadingContent() : loadingContent;
    }
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
