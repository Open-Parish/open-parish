export type SettingsFormFooterProps = {
  isSaving?: boolean;
  isDirty: boolean;
  isValid: boolean;
  submitLabel?: string;
  onReset?: () => void;
};
