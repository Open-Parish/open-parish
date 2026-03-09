import { Text } from '@mantine/core';
import type { QueryStateProps } from './QueryState.types';
import { renderQueryStateContent } from './renderQueryStateContent';

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
}: Readonly<QueryStateProps<TData>>) {
  if (query.isError) {
    const content = renderQueryStateContent(errorContent);
    if (content) return content;
    return <Text c="red">{errorMessage}</Text>;
  }

  if (isNotFound) {
    return <Text c="dimmed">{notFoundMessage}</Text>;
  }

  if (query.isLoading) {
    const content = renderQueryStateContent(loadingContent);
    if (content) return content;
    return <Text c="dimmed">{loadingMessage}</Text>;
  }

  if (isEmpty) {
    const content = renderQueryStateContent(emptyContent);
    if (content) return content;
    return <Text c="dimmed">{emptyMessage}</Text>;
  }

  return children;
}
