export type ConfirmDeleteModalOptions = {
  title?: React.ReactNode;
  message?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
};
