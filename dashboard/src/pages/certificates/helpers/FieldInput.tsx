import { Autocomplete, NumberInput, Text, TextInput } from '@mantine/core';
import { normalizeText } from '@/utils/normalizeText';
import type { FieldInputProps } from './FieldInput.types';

export function FieldInput({ field, label, value, onChange, onFocus, data, loading }: FieldInputProps) {
  if (field.type === 'date') {
    return (
      <TextInput
        label={label}
        type="date"
        value={normalizeText(value).slice(0, 10)}
        onChange={(e) => onChange(e.currentTarget.value)}
      />
    );
  }

  if (field.type === 'number') {
    return <NumberInput label={label} value={Number(value ?? 0)} onChange={(next) => onChange(Number(next ?? 0))} />;
  }

  const segment = field.path.split('.').pop() ?? field.path;
  const isPersonNameField = segment === 'firstName' || segment === 'lastName';

  if (isPersonNameField) {
    return (
      <Autocomplete
        label={label}
        data={data ?? []}
        value={normalizeText(value)}
        onChange={(next) => onChange(next)}
        onFocus={onFocus}
        limit={10}
        comboboxProps={{ withinPortal: true }}
        rightSection={
          loading ? (
            <Text size="xs" c="dimmed">
              ...
            </Text>
          ) : undefined
        }
      />
    );
  }

  return (
    <TextInput
      label={label}
      value={normalizeText(value)}
      onChange={(e) => onChange(e.currentTarget.value)}
      onFocus={onFocus}
    />
  );
}
