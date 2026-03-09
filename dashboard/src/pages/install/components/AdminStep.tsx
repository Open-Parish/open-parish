import { useState } from 'react';
import { Button, PasswordInput, Stack, TextInput } from '@mantine/core';
import { IconCheck, IconCopy, IconRefresh } from '@tabler/icons-react';
import { generatePassword } from '../utils/generatePassword';
import type { AdminStepProps } from './AdminStep.types';
import styles from '../InstallWizard.module.css';

export function AdminStep({ form, onBack, onNext }: AdminStepProps) {
  const [copied, setCopied] = useState(false);

  function handleGenerate() {
    const pwd = generatePassword();
    form.setValues({ password: pwd, repeatPassword: pwd });
    setCopied(false);
  }

  function handleCopy() {
    navigator.clipboard.writeText(form.values.password).catch(() => null);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const hasGenerated = form.values.password.length > 0;

  return (
    <>
      <Stack gap="md">
        <TextInput label="Email address" placeholder="admin@yourparish.org" {...form.getInputProps('email')} />

        <div>
          <div className={styles.passwordLabelRow}>
            <span className={styles.passwordLabel}>Password</span>
            <button type="button" className={styles.generateBtn} onClick={handleGenerate}>
              <IconRefresh size={12} />
              Generate secure password
            </button>
          </div>
          <PasswordInput placeholder="Min. 8 characters" {...form.getInputProps('password')} />
          {hasGenerated && (
            <button type="button" className={styles.copyBtn} onClick={handleCopy}>
              {copied ? <IconCheck size={12} /> : <IconCopy size={12} />}
              {copied ? 'Copied!' : 'Copy password'}
            </button>
          )}
        </div>

        <PasswordInput
          label="Confirm password"
          placeholder="Repeat password"
          {...form.getInputProps('repeatPassword')}
        />
      </Stack>
      <div className={styles.actions}>
        <Button variant="default" className={styles.btnBack} onClick={onBack}>
          Back
        </Button>
        <Button className={styles.btnPrimary} onClick={onNext}>
          Continue →
        </Button>
      </div>
    </>
  );
}
