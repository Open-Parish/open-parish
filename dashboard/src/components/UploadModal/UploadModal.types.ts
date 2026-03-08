export type UploadModalProps = {
  opened: boolean;
  title?: string;
  accept?: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit?: (file: File) => void;
};
