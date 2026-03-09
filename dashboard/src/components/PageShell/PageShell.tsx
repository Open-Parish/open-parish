import { Stack, Text, Title, useMantineTheme } from '@mantine/core';
import isEmpty from 'lodash/isEmpty';
import { useUi } from '@/context/UiContext';
import { Breadcrumbs } from '@/components/Breadcrumbs/Breadcrumbs';
import type { PageShellProps } from './PageShell.types';
import { getPageShellStyleVars } from './PageShell.styles';
import styles from './PageShell.module.css';

export function PageShell({ title, subtitle, children, headerContent, breadcrumbs }: PageShellProps) {
  const theme = useMantineTheme();
  const { colorScheme, compactMode: compact } = useUi();
  const isDark = colorScheme === 'dark';
  const styleVars = getPageShellStyleVars({
    hasHeaderContent: Boolean(headerContent),
    isDark,
    theme,
  });

  const outerGap = compact ? 'sm' : 'md';
  const titleOrder = compact ? 3 : 2;
  const headerRowClassName = compact ? `${styles.headerRow} ${styles.headerRowCompact}` : styles.headerRow;
  const subtitleClassName = compact ? `${styles.subtitle} ${styles.subtitleCompact}` : styles.subtitle;

  return (
    <Stack gap={outerGap}>
      <div style={styleVars}>
        {Array.isArray(breadcrumbs) && !isEmpty(breadcrumbs) && <Breadcrumbs items={breadcrumbs} />}
        {(title || headerContent) && (
          <div className={headerRowClassName}>
            {title && (
              <Title order={titleOrder} className={styles.title}>
                {title}
              </Title>
            )}
            {headerContent}
          </div>
        )}
        {subtitle && (
          <Text size={compact ? 'sm' : undefined} className={subtitleClassName}>
            {subtitle}
          </Text>
        )}
      </div>
      <Stack gap={outerGap}>{children}</Stack>
    </Stack>
  );
}
