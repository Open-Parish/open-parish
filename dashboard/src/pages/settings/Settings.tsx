import {
  Box,
  Button,
  Checkbox,
  Divider,
  FileButton,
  Group,
  Image,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { IconPhotoUp, IconTrash } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef } from 'react';
import { PageShell } from '@/components/PageShell/PageShell';
import { getSettings, updateSettings } from '@/features/settings/settingsApi';
import { createObjectUrlIfFile } from '@/utils/createObjectUrlIfFile';
import { pickNormalizedString } from '@/utils/pickNormalizedString';
import type { SettingsForm } from './Settings.types';
import { resolveAssetPreview } from './utils/resolveAssetPreview';

const INITIAL_SETTINGS_VALUES: SettingsForm = {
  parishName: '',
  headerLine1: '',
  headerLine2: '',
  headerLine3: '',
  headerLine4: '',
  headerLine5: '',
  headerLine6: '',
  currentPriest: '',
  currentPriestSignature: '',
  pdfImageLeft: '',
  pdfImageRight: '',
  showParishSeal: true,
  showPdfImageLeft: true,
  showPdfImageRight: true,
};

type UploadFieldProps = {
  label: string;
  placeholder: string;
  value: string | File;
  onChange: (file: File | null) => void;
};

function UploadField({ label, placeholder, value, onChange }: Readonly<UploadFieldProps>) {
  const hasValue = value instanceof File || (typeof value === 'string' && value.trim().length > 0);
  const helperText = value instanceof File ? value.name : hasValue ? 'Image saved' : 'No image selected';

  return (
    <Stack gap={6}>
      <Text fw={500} size="sm">
        {label}
      </Text>
      <Group gap="sm" wrap="wrap">
        <FileButton accept="image/*" onChange={onChange}>
          {(props) => (
            <Button {...props} variant="default" leftSection={<IconPhotoUp size={16} />}>
              {placeholder}
            </Button>
          )}
        </FileButton>
        <Button
          color="red"
          variant="light"
          leftSection={<IconTrash size={16} />}
          onClick={() => onChange(null)}
          disabled={!hasValue}
        >
          Clear
        </Button>
      </Group>
      <Text size="xs" c="dimmed">
        {helperText}
      </Text>
    </Stack>
  );
}

export function Settings() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ['settings'], queryFn: getSettings });
  const hasHydratedFromQuery = useRef(false);

  const form = useForm<SettingsForm>({
    initialValues: INITIAL_SETTINGS_VALUES,
    validate: {
      parishName: (value) => (value.length === 0 ? 'Required' : null),
      headerLine1: (value) => (value.length === 0 ? 'Required' : null),
      headerLine2: (value) => (value.length === 0 ? 'Required' : null),
      currentPriest: (value) => (value.length === 0 ? 'Required' : null),
    },
  });

  useEffect(() => {
    if (query.data && !hasHydratedFromQuery.current) {
      form.setValues(query.data);
      hasHydratedFromQuery.current = true;
    }
  }, [form, query.data]);

  const mutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: async (nextSettings) => {
      form.setValues(nextSettings);
      await queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  const updateFileField = (field: 'currentPriestSignature' | 'pdfImageLeft' | 'pdfImageRight', file: File | null) => {
    form.setFieldValue(field, file ?? '');
  };

  const leftImageObjectUrl = useMemo(() => createObjectUrlIfFile(form.values.pdfImageLeft), [form.values.pdfImageLeft]);
  const rightImageObjectUrl = useMemo(
    () => createObjectUrlIfFile(form.values.pdfImageRight),
    [form.values.pdfImageRight],
  );
  const signatureObjectUrl = useMemo(
    () => createObjectUrlIfFile(form.values.currentPriestSignature),
    [form.values.currentPriestSignature],
  );

  const leftImagePreview = useMemo(
    () => resolveAssetPreview(pickNormalizedString(leftImageObjectUrl, form.values.pdfImageLeft)),
    [form.values.pdfImageLeft, leftImageObjectUrl],
  );
  const rightImagePreview = useMemo(
    () => resolveAssetPreview(pickNormalizedString(rightImageObjectUrl, form.values.pdfImageRight)),
    [form.values.pdfImageRight, rightImageObjectUrl],
  );
  const signaturePreview = useMemo(
    () => resolveAssetPreview(pickNormalizedString(signatureObjectUrl, form.values.currentPriestSignature)),
    [form.values.currentPriestSignature, signatureObjectUrl],
  );

  useEffect(() => {
    if (leftImageObjectUrl) {
      return () => {
        URL.revokeObjectURL(leftImageObjectUrl);
      };
    }
    return undefined;
  }, [leftImageObjectUrl]);

  useEffect(() => {
    if (rightImageObjectUrl) {
      return () => {
        URL.revokeObjectURL(rightImageObjectUrl);
      };
    }
    return undefined;
  }, [rightImageObjectUrl]);

  useEffect(() => {
    if (signatureObjectUrl) {
      return () => {
        URL.revokeObjectURL(signatureObjectUrl);
      };
    }
    return undefined;
  }, [signatureObjectUrl]);

  return (
    <PageShell title="Settings" subtitle="Parish header and print settings.">
      <Box maw={740}>
        <Paper withBorder shadow="xs" p={{ base: 'md', sm: 'xl' }}>
          <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
            <Stack gap="lg">
              <Stack gap="xs">
                <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.06em' }}>
                  Parish Profile
                </Text>
                <Text size="xs" c="dimmed">
                  Name used in the sidebar header.
                </Text>
                <TextInput label="Parish Name" {...form.getInputProps('parishName')} />
              </Stack>

              <Divider />

              <Stack gap="xs">
                <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.06em' }}>
                  Certificate Header
                </Text>
                <Text size="xs" c="dimmed">
                  These lines appear at the top of every printed certificate.
                </Text>
                <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="md" mt={4}>
                  <TextInput label="Header Line 1" {...form.getInputProps('headerLine1')} />
                  <TextInput label="Header Line 2" {...form.getInputProps('headerLine2')} />
                  <TextInput label="Header Line 3" {...form.getInputProps('headerLine3')} />
                  <TextInput label="Header Line 4" {...form.getInputProps('headerLine4')} />
                  <TextInput label="Header Line 5" {...form.getInputProps('headerLine5')} />
                  <TextInput label="Header Line 6" {...form.getInputProps('headerLine6')} />
                </SimpleGrid>
              </Stack>

              <Divider />

              <Stack gap="xs">
                <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.06em' }}>
                  Parish Priest
                </Text>
                <Text size="xs" c="dimmed">
                  Name and signature used on all printed certificates.
                </Text>
                <Stack mt={4}>
                  <TextInput label="Priest Name" {...form.getInputProps('currentPriest')} />
                  <UploadField
                    label="Priest Signature"
                    placeholder="Upload signature image"
                    value={form.values.currentPriestSignature}
                    onChange={(file) => updateFileField('currentPriestSignature', file)}
                  />
                  <Group>
                    {signaturePreview ? (
                      <Image src={signaturePreview} alt="Priest signature preview" mah={90} fit="contain" />
                    ) : null}
                    <Text size="sm" c="dimmed">
                      Signature preview
                    </Text>
                  </Group>
                </Stack>
              </Stack>

              <Divider />

              <Stack gap="xs">
                <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.06em' }}>
                  PDF Header Images
                </Text>
                <Text size="xs" c="dimmed">
                  Upload the left and right images shown in printed certificate headers.
                </Text>
                <Stack mt={4}>
                  <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="md">
                    <Checkbox
                      label="Show left header image in preview/PDF"
                      checked={form.values.showPdfImageLeft}
                      onChange={(event) => form.setFieldValue('showPdfImageLeft', event.currentTarget.checked)}
                    />
                    <Checkbox
                      label="Show right header image in preview/PDF"
                      checked={form.values.showPdfImageRight}
                      onChange={(event) => form.setFieldValue('showPdfImageRight', event.currentTarget.checked)}
                    />
                  </SimpleGrid>
                  <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="md">
                    <UploadField
                      label="PDF Header Image (Left)"
                      placeholder="Upload left header image"
                      value={form.values.pdfImageLeft}
                      onChange={(file) => updateFileField('pdfImageLeft', file)}
                    />
                    <UploadField
                      label="PDF Header Image (Right)"
                      placeholder="Upload right header image"
                      value={form.values.pdfImageRight}
                      onChange={(file) => updateFileField('pdfImageRight', file)}
                    />
                  </SimpleGrid>
                  <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="md">
                    <Group>
                      {leftImagePreview ? (
                        <Image src={leftImagePreview} alt="PDF header left image preview" mah={90} fit="contain" />
                      ) : null}
                      <Text size="sm" c="dimmed">
                        Left image preview
                      </Text>
                    </Group>
                    <Group>
                      {rightImagePreview ? (
                        <Image src={rightImagePreview} alt="PDF header right image preview" mah={90} fit="contain" />
                      ) : null}
                      <Text size="sm" c="dimmed">
                        Right image preview
                      </Text>
                    </Group>
                  </SimpleGrid>
                </Stack>
              </Stack>

              <Divider />

              <Stack gap="xs">
                <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.06em' }}>
                  Preview Options
                </Text>
                <Text size="xs" c="dimmed">
                  Control optional visual elements shown in the certificate preview/PDF.
                </Text>
                <Checkbox
                  mt={4}
                  label="Show parish seal label in preview/PDF"
                  checked={form.values.showParishSeal}
                  onChange={(event) => form.setFieldValue('showParishSeal', event.currentTarget.checked)}
                />
              </Stack>

              <Divider />

              <Box>
                <Button type="submit" loading={mutation.isPending}>
                  Save Settings
                </Button>
              </Box>
            </Stack>
          </form>
        </Paper>
      </Box>
    </PageShell>
  );
}
