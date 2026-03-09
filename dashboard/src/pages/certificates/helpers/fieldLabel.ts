import type { FormField } from '@/features/certificates/certificates.types';

export function fieldLabel(field: FormField, inGroup: boolean): string {
  if (!inGroup) return field.label;
  const segment = field.path.split('.').pop() ?? field.path;
  return segment.replace(/([A-Z])/g, ' $1').replace(/^\w/, (c) => c.toUpperCase());
}
