import { Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import type { ConfirmDeleteModalOptions } from './ConfirmDeleteModal.types';

export const openConfirmDeleteModal = ({
  title = (
    <Text fw={600} size="md">
      Confirm delete
    </Text>
  ),
  message = 'Are you sure you want to delete this item? This item will not be undone.',
  onConfirm,
  onCancel,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
}: ConfirmDeleteModalOptions) =>
  modals.openConfirmModal({
    title,
    children: <Text>{message}</Text>,
    labels: { confirm: confirmLabel, cancel: cancelLabel },
    confirmProps: { color: 'red' },
    onConfirm,
    onCancel,
    centered: true,
  });
