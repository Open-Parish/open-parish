import { Button, Group } from '@mantine/core';
import type { SettingsFormFooterProps } from './SettingsFormFooter.types';

export function SettingsFormFooter({
  isSaving = false,
  isDirty,
  isValid,
  submitLabel = 'Save changes',
  onReset,
}: SettingsFormFooterProps) {
  const isDisabled = !isValid || !isDirty || isSaving;

  return (
    <Group justify="flex-end">
      {onReset && (
        <Button type="button" variant="default" disabled={!isDirty || isSaving} onClick={onReset}>
          Reset
        </Button>
      )}
      <Button type="submit" disabled={isDisabled} loading={isSaving}>
        {submitLabel}
      </Button>
    </Group>
  );
}
