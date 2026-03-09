import type { UseFormReturnType } from '@mantine/form';

export type AdminValues = {
  email: string;
  password: string;
  repeatPassword: string;
};

export type AdminStepProps = {
  form: UseFormReturnType<AdminValues>;
  onBack: () => void;
  onNext: () => void;
};
