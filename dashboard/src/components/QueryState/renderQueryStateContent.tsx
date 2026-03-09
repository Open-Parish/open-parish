import isFunction from 'lodash/isFunction';
import type { ReactNode } from 'react';

export function renderQueryStateContent(content: ReactNode | (() => ReactNode) | undefined) {
  if (!content) return null;
  return isFunction(content) ? content() : content;
}
