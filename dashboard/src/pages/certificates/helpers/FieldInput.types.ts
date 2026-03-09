import type { FormField } from '@/features/certificates/certificates.types';

export type FieldInputProps = {
  field: FormField;
  label: string;
  value: unknown;
  onChange: (val: unknown) => void;
  onFocus?: () => void;
  data?: string[];
  loading?: boolean;
};
