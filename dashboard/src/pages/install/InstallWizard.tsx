import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from '@mantine/form';
import { useAuth } from '@/context/AuthContext';
import { bootstrapSystem } from '@/features/install/installApi';
import type { BootstrapPayload } from '@/features/install/installApi.types';
import { OpenParishMark } from '@/components/OpenParishMark/OpenParishMark';
import { INSTALL_STEPS } from './install.constants';
import { AdminStep } from './components/AdminStep';
import { SampleDataStep } from './components/SampleDataStep';
import { SettingsStep } from './components/SettingsStep';
import { WelcomeStep } from './components/WelcomeStep';
import styles from './InstallWizard.module.css';

export function InstallWizard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login } = useAuth();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [usedSample, setUsedSample] = useState(false);
  const [seedSampleData, setSeedSampleData] = useState(false);

  const adminForm = useForm({
    initialValues: { email: '', password: '', repeatPassword: '' },
    validate: {
      email: (v) => (!v.trim() ? 'Required' : !/\S+@\S+\.\S+/.test(v) ? 'Enter a valid email' : null),
      password: (v) => (v.length < 8 ? 'Password must be at least 8 characters' : null),
      repeatPassword: (v, vals) => (v !== vals.password ? 'Passwords do not match' : null),
    },
  });

  const settingsForm = useForm({
    initialValues: {
      parishName: '',
      headerLine1: '',
      headerLine2: '',
      headerLine3: '',
      headerLine4: '',
      headerLine5: '',
      headerLine6: '',
      currentPriest: '',
    },
    validate: {
      parishName: (v) => (!v.trim() ? 'Required' : null),
      headerLine1: (v) => (!v.trim() ? 'Required' : null),
      headerLine2: (v) => (!v.trim() ? 'Required' : null),
      headerLine3: (v) => (!v.trim() ? 'Required' : null),
      headerLine4: (v) => (!v.trim() ? 'Required' : null),
      headerLine5: (v) => (!v.trim() ? 'Required' : null),
      headerLine6: (v) => (!v.trim() ? 'Required' : null),
      currentPriest: (v) => (!v.trim() ? 'Required' : null),
    },
  });

  const { title, subtitle } = INSTALL_STEPS[step];
  const goStep0 = useCallback(() => setStep(0), []);
  const goStep1 = useCallback(() => setStep(1), []);
  const goStep2 = useCallback(() => setStep(2), []);
  const markUsedSample = useCallback(() => setUsedSample(true), []);
  const onSeedSampleChange = useCallback((val: boolean) => setSeedSampleData(val), []);

  const handleAdminNext = useCallback(() => {
    if (adminForm.validate().hasErrors) return;
    setStep(2);
  }, [adminForm]);

  const handleSettingsNext = useCallback(() => {
    if (settingsForm.validate().hasErrors) return;
    setStep(3);
  }, [settingsForm]);

  const handleBootstrap = useCallback(async () => {
    setError(null);
    setSubmitting(true);

    const payload: BootstrapPayload = {
      sampleData: usedSample,
      seedSample: seedSampleData,
      user: {
        email: adminForm.values.email,
        password: adminForm.values.password,
        repeatPassword: adminForm.values.repeatPassword,
      },
      settings: {
        ...settingsForm.values,
        currentPriestSignature: '',
        pdfImageLeft: '',
        pdfImageRight: '',
      },
    };

    try {
      await bootstrapSystem(payload);
      queryClient.setQueryData(['install-status'], null);
      await login({ email: adminForm.values.email, password: adminForm.values.password });
      navigate('/dashboard', { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Setup failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [
    adminForm.values.email,
    adminForm.values.password,
    adminForm.values.repeatPassword,
    login,
    navigate,
    queryClient,
    seedSampleData,
    settingsForm.values,
    usedSample,
  ]);

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <div className={styles.cardHead}>
          <div className={styles.headOrb} />
          <div className={styles.headTop}>
            <div className={styles.logo}>
              <OpenParishMark className={styles.logoMark} />
              <span className={styles.logoText}>Open Parish</span>
            </div>
            <div className={styles.stepDots}>
              {INSTALL_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={[styles.dot, i === step ? styles.dotActive : '', i < step ? styles.dotDone : '']
                    .filter(Boolean)
                    .join(' ')}
                />
              ))}
            </div>
          </div>
          <h1 className={styles.headTitle}>{title}</h1>
          <p className={styles.headSub}>{subtitle}</p>
        </div>

        <div className={styles.cardBody}>
          {step === 0 && <WelcomeStep onNext={goStep1} />}
          {step === 1 && <AdminStep form={adminForm} onBack={goStep0} onNext={handleAdminNext} />}
          {step === 2 && (
            <SettingsStep
              form={settingsForm}
              usedSample={usedSample}
              onUsedSample={markUsedSample}
              onBack={goStep1}
              onNext={handleSettingsNext}
            />
          )}
          {step === 3 && (
            <SampleDataStep
              checked={seedSampleData}
              onChange={onSeedSampleChange}
              error={error}
              submitting={submitting}
              onBack={goStep2}
              onSubmit={handleBootstrap}
            />
          )}
        </div>
      </div>
    </div>
  );
}
