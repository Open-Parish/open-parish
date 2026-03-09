import type { KeyboardEvent } from 'react';
import { Button, Checkbox, Stack } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import type { SampleDataStepProps } from './SampleDataStep.types';
import styles from '../InstallWizard.module.css';

export function SampleDataStep({ checked, onChange, error, submitting, onBack, onSubmit }: SampleDataStepProps) {
  function handleToggle() {
    onChange(!checked);
  }

  function handleCardKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter') {
      onChange(!checked);
    }
  }

  return (
    <>
      {error && <div className={styles.errorBox}>{error}</div>}
      <Stack gap="md">
        <div
          className={`${styles.seedCard} ${checked ? styles.seedCardActive : ''}`}
          onClick={handleToggle}
          role="button"
          tabIndex={0}
          onKeyDown={handleCardKeyDown}
        >
          <div className={styles.seedCardTop}>
            <Checkbox
              checked={checked}
              onChange={(e) => onChange(e.currentTarget.checked)}
              color="wine"
              onClick={(e) => e.stopPropagation()}
              label={<span className={styles.seedCardTitle}>Seed sample certificate records</span>}
            />
          </div>
          <p className={styles.seedCardDesc}>
            Adds <strong>5 sample records</strong> for each certificate type — baptismal, confirmation, marriage, and
            death. Useful for exploring the system before entering real data.
          </p>
          <ul className={styles.seedList}>
            <li>5 × Baptismal</li>
            <li>5 × Confirmation</li>
            <li>5 × Marriage</li>
            <li>5 × Death</li>
          </ul>
        </div>

        <div className={styles.infoNote}>
          <IconInfoCircle size={13} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>Sample records can be deleted individually from the certificate list at any time.</span>
        </div>
      </Stack>
      <div className={styles.actions}>
        <Button variant="default" className={styles.btnBack} onClick={onBack}>
          Back
        </Button>
        <Button className={styles.btnPrimary} onClick={onSubmit} loading={submitting}>
          Finish setup →
        </Button>
      </div>
    </>
  );
}
