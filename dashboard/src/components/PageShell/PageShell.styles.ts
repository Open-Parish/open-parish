import type { CSSProperties } from 'react';
import type { MantineTheme } from '@mantine/core';

export const getPageShellStyleVars = (params: {
  hasHeaderContent: boolean;
  isDark: boolean;
  theme: MantineTheme;
}): CSSProperties => {
  const { hasHeaderContent, isDark, theme } = params;
  const slate = theme.colors.slate ?? [];

  return {
    '--page-shell-justify': hasHeaderContent ? 'space-between' : 'flex-start',
    '--page-shell-muted': isDark ? slate[4] : slate[5],
  } as CSSProperties;
};
