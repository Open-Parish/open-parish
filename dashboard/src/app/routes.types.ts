import type { Icon } from '@tabler/icons-react';
import type { ReactElement } from 'react';

export type AppRoute = {
  path: string;
  element: ReactElement;
  label?: string;
  icon?: Icon;
};
