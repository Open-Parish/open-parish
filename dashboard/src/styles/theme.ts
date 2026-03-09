import { createTheme } from '@mantine/core';

export const theme = createTheme({
  fontFamily: 'Inter, system-ui, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  primaryColor: 'wine',
  primaryShade: { light: 6, dark: 7 },
  defaultRadius: 'md',
  components: {
    ActionIcon: {
      defaultProps: {
        radius: 'md',
      },
    },
    Badge: {
      defaultProps: {
        radius: 'md',
        variant: 'light',
      },
    },
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
        withBorder: true,
      },
    },
    Drawer: {
      defaultProps: {
        radius: 'md',
      },
    },
    Modal: {
      defaultProps: {
        radius: 'md',
      },
    },
    Paper: {
      defaultProps: {
        radius: 'md',
      },
    },
    Text: {
      defaultProps: {
        size: 'sm',
      },
    },
  },
  colors: {
    slate: [
      '#f8fafc',
      '#f1f5f9',
      '#e2e8f0',
      '#cbd5e1',
      '#94a3b8',
      '#64748b',
      '#475569',
      '#334155',
      '#1e293b',
      '#0f172a',
    ],
    wine: [
      '#fdf2f4',
      '#f8d5de',
      '#f0aebb',
      '#e47f95',
      '#d64f6d',
      '#c42349',
      '#a21a3a', // 6 — light primary
      '#850f2e', // 7 — dark primary
      '#690923',
      '#4e0618',
    ],
  },
});
