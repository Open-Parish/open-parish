import { Stack, Text, Title, useMantineTheme } from '@mantine/core';
import isEmpty from 'lodash/isEmpty';
import { useUiStore } from '@/store/useUiStore';
import { Breadcrumbs } from '@/components/Breadcrumbs/Breadcrumbs';
import type { PageShellProps } from './PageShell.types';
import { getPageShellStyleVars } from './PageShell.styles';
import styles from './PageShell.module.css';

export function PageShell({ title, subtitle, children, headerContent, breadcrumbs }: PageShellProps) {
  const theme = useMantineTheme();
  const colorScheme = useUiStore((state) => state.colorScheme);
  const compact = useUiStore((state) => state.compactMode);
  const isDark = colorScheme === 'dark';
  const styleVars = getPageShellStyleVars({
    hasHeaderContent: Boolean(headerContent),
    isDark,
    theme,
  });

  const outerGap = compact ? 'sm' : 'md';
  const titleOrder = compact ? 3 : 2;

  return (
    <Stack gap={outerGap}>
      <div style={styleVars}>
        {Array.isArray(breadcrumbs) && !isEmpty(breadcrumbs) && <Breadcrumbs items={breadcrumbs} />}
        {(title || headerContent) && (
          <div className={`${styles.headerRow}${compact ? ` ${styles.headerRowCompact}` : ''}`}>
            {title && (
              <Title order={titleOrder} className={styles.title}>
                {title}
              </Title>
            )}
            {headerContent}
          </div>
        )}
        {subtitle && (
          <Text
            size={compact ? 'sm' : undefined}
            className={`${styles.subtitle}${compact ? ` ${styles.subtitleCompact}` : ''}`}
          >
            {subtitle}
          </Text>
        )}
      </div>
      <Stack gap={outerGap}>{children}</Stack>
    </Stack>
  );
}
