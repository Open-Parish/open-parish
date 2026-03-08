import type { ReactNode } from 'react';

export type DeleteButtonProps = {
  ariaLabel: string;
  onClick: () => void;
  children?: ReactNode;
};
