export type SampleDataStepProps = {
  checked: boolean;
  onChange: (val: boolean) => void;
  error: string | null;
  submitting: boolean;
  onBack: () => void;
  onSubmit: () => void;
};
