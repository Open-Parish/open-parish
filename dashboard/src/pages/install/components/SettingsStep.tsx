import { Button, Divider, SimpleGrid, Stack, Text, TextInput } from '@mantine/core';
import { IconInfoCircle, IconWand } from '@tabler/icons-react';
import { SAMPLE_SETTINGS } from '../install.constants';
import type { SettingsStepProps } from './SettingsStep.types';
import styles from '../InstallWizard.module.css';

export function SettingsStep({ form, usedSample, onUsedSample, onBack, onNext }: SettingsStepProps) {
  function handleFillSample() {
    form.setValues(SAMPLE_SETTINGS);
    onUsedSample();
  }

  return (
    <>
      <Stack gap="md">
        <div className={styles.defaultsBar}>
          <span className={styles.defaultsLabel}>Not sure yet?</span>
          <button type="button" className={styles.defaultsBtn} onClick={handleFillSample}>
            <IconWand size={12} />
            Fill with sample data
          </button>
        </div>

        {usedSample && (
          <div className={styles.sampleWarning}>
            <IconInfoCircle size={13} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>
              These are <strong>fictional placeholder values</strong>. Please replace them with your actual parish
              details before going live.
            </span>
          </div>
        )}

        <TextInput
          label="Parish Name"
          placeholder="Our Lady of the Sacred Heart"
          {...form.getInputProps('parishName')}
        />

        <div>
          <Text size="xs" fw={700} tt="uppercase" c="dimmed" mb="xs" style={{ letterSpacing: '0.06em' }}>
            Certificate Header Lines
          </Text>
          <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="sm">
            <TextInput label="Line 1" placeholder="Archdiocese of Cebu" {...form.getInputProps('headerLine1')} />
            <TextInput label="Line 2" placeholder="Parish name" {...form.getInputProps('headerLine2')} />
            <TextInput label="Line 3" placeholder="Address" {...form.getInputProps('headerLine3')} />
            <TextInput label="Line 4" placeholder="Tel / Contact" {...form.getInputProps('headerLine4')} />
            <TextInput label="Line 5" placeholder="Canonical erection" {...form.getInputProps('headerLine5')} />
            <TextInput label="Line 6" placeholder="Feast day" {...form.getInputProps('headerLine6')} />
          </SimpleGrid>
        </div>

        <Divider />

        <TextInput
          label="Parish Priest"
          placeholder="Fr. Robert Francis Prevost"
          {...form.getInputProps('currentPriest')}
        />

        <div className={styles.infoNote}>
          <IconInfoCircle size={13} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>
            You can update all of these anytime from <strong>Settings</strong>.
          </span>
        </div>
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
