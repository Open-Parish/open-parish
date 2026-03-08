import type { Icon } from '@tabler/icons-react';

export type AppRoute = {
  path: string;
  element: JSX.Element;
  label?: string;
  icon?: Icon;
};
