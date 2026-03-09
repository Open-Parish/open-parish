import type { UseFormReturnType } from '@mantine/form';
import type { SettingsValues } from '../InstallWizard.types';

export type SettingsStepProps = {
  form: UseFormReturnType<SettingsValues>;
  usedSample: boolean;
  onUsedSample: () => void;
  onBack: () => void;
  onNext: () => void;
};
