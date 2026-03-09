import type { FormField } from '@/features/certificates/certificates.types';

function titleCaseWords(value: string): string {
  if (value.length === 0) return value;
  return `${value[0].toUpperCase()}${value.slice(1)}`;
}

function splitCamelCase(value: string): string {
  let output = '';
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    const isUpper = char >= 'A' && char <= 'Z';
    if (index > 0 && isUpper) {
      output += ' ';
    }
    output += char;
  }
  return output;
}

export function fieldLabel(field: FormField, inGroup: boolean): string {
  if (!inGroup) return field.label;
  const segment = field.path.split('.').pop() ?? field.path;
  return titleCaseWords(splitCamelCase(segment).trim());
}
