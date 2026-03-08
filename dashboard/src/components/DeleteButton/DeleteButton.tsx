import { Button, Group } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import type { DeleteButtonProps } from './DeleteButton.types';

export function DeleteButton({ ariaLabel, onClick, children = 'Delete' }: DeleteButtonProps) {
  return (
    <Group gap="xs">
      <Button
        color="red"
        variant="filled"
        aria-label={ariaLabel}
        leftSection={<IconTrash size={16} />}
        onClick={onClick}
      >
        {children}
      </Button>
    </Group>
  );
}
