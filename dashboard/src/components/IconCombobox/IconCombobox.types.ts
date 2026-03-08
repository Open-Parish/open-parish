import type { ReactNode } from 'react';

export type IconComboboxOption = {
  value: string;
  label: string;
  icon?: ReactNode;
};

export type IconComboboxProps = {
  data: IconComboboxOption[];
  label?: string;
  placeholder?: string;
  value: string | null;
  onChange: (value: string | null) => void;
};
