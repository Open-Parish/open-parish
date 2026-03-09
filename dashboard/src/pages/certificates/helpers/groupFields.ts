import type { FormField } from '@/features/certificates/certificates.types';
import type { FieldGroup } from '../CertificateFormPage.types';
import { formatGroupLabel } from './formatGroupLabel';

export function groupFields(fields: FormField[]): FieldGroup[] {
  const groups: FieldGroup[] = [];
  let i = 0;

  while (i < fields.length) {
    const field = fields[i];
    const dotIdx = field.path.lastIndexOf('.');

    if (dotIdx >= 0) {
      const parent = field.path.slice(0, dotIdx);
      const siblings: FormField[] = [field];
      while (i + 1 < fields.length && fields[i + 1].path.slice(0, fields[i + 1].path.lastIndexOf('.')) === parent) {
        i += 1;
        siblings.push(fields[i]);
      }
      groups.push({ fields: siblings, label: formatGroupLabel(parent) });
    } else if (field.type === 'number') {
      const next = fields[i + 1];
      if (next && next.type === 'number' && !next.path.includes('.')) {
        groups.push({ fields: [field, next] });
        i += 1;
      } else {
        groups.push({ fields: [field] });
      }
    } else {
      const next = fields[i + 1];
      const isNamePair = field.path === 'firstName' && next?.path === 'lastName' && !next.path.includes('.');
      if (isNamePair && next) {
        groups.push({ fields: [field, next] });
        i += 1;
      } else {
        groups.push({ fields: [field] });
      }
    }

    i += 1;
  }

  return groups;
}
