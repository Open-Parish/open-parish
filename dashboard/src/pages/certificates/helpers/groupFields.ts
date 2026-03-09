import type { FormField } from '@/features/certificates/certificates.types';
import type { FieldGroup } from '../CertificateFormPage.types';
import { formatGroupLabel } from './formatGroupLabel';

function isNestedField(field: FormField): boolean {
  return field.path.lastIndexOf('.') >= 0;
}

function parentPath(field: FormField): string {
  const dotIdx = field.path.lastIndexOf('.');
  return dotIdx >= 0 ? field.path.slice(0, dotIdx) : '';
}

function canPairNumberFields(current: FormField, next: FormField | undefined): next is FormField {
  return Boolean(next?.type === 'number' && !next.path.includes('.')) && current.type === 'number';
}

function canPairRootNames(current: FormField, next: FormField | undefined): next is FormField {
  return Boolean(next && current.path === 'firstName' && next.path === 'lastName' && !next.path.includes('.'));
}

function consumeNestedGroup(fields: FormField[], startIndex: number): { group: FieldGroup; nextIndex: number } {
  const first = fields[startIndex];
  const parent = parentPath(first);
  const siblings: FormField[] = [first];

  let i = startIndex + 1;
  while (i < fields.length) {
    const candidate = fields[i];
    if (parentPath(candidate) !== parent) break;
    siblings.push(candidate);
    i += 1;
  }

  return {
    group: { fields: siblings, label: formatGroupLabel(parent) },
    nextIndex: i,
  };
}

function consumeFlatGroup(fields: FormField[], startIndex: number): { group: FieldGroup; nextIndex: number } {
  const current = fields[startIndex];
  const next = fields[startIndex + 1];

  if (canPairNumberFields(current, next) || canPairRootNames(current, next)) {
    return { group: { fields: [current, next] }, nextIndex: startIndex + 2 };
  }

  return { group: { fields: [current] }, nextIndex: startIndex + 1 };
}

export function groupFields(fields: FormField[]): FieldGroup[] {
  const groups: FieldGroup[] = [];
  let index = 0;

  while (index < fields.length) {
    const consumed = isNestedField(fields[index]) ? consumeNestedGroup(fields, index) : consumeFlatGroup(fields, index);

    groups.push(consumed.group);
    index = consumed.nextIndex;
  }

  return groups;
}
