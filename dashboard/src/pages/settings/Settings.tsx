import {
  Box,
  Button,
  Divider,
  FileInput,
  Group,
  Image,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef } from 'react';
import { PageShell } from '@/components/PageShell/PageShell';
import { getSettings, updateSettings } from '@/features/settings/settingsApi';
import { getToken } from '@/lib/session';
import { createObjectUrlIfFile } from '@/utils/createObjectUrlIfFile';
import { fileValueOrNull } from '@/utils/fileValueOrNull';
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
};

export function Settings() {
  const queryClient = useQueryClient();
  const authToken = getToken();
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
    form.setFieldValue(field, file ?? query.data?.[field] ?? '');
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
    () => resolveAssetPreview(pickNormalizedString(leftImageObjectUrl, form.values.pdfImageLeft), authToken),
    [authToken, form.values.pdfImageLeft, leftImageObjectUrl],
  );
  const rightImagePreview = useMemo(
    () => resolveAssetPreview(pickNormalizedString(rightImageObjectUrl, form.values.pdfImageRight), authToken),
    [authToken, form.values.pdfImageRight, rightImageObjectUrl],
  );
  const signaturePreview = useMemo(
    () => resolveAssetPreview(pickNormalizedString(signatureObjectUrl, form.values.currentPriestSignature), authToken),
    [authToken, form.values.currentPriestSignature, signatureObjectUrl],
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
                  <FileInput
                    label="Priest Signature"
                    placeholder="Upload signature image"
                    accept="image/*"
                    clearable
                    value={fileValueOrNull(form.values.currentPriestSignature)}
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
                    <FileInput
                      label="PDF Header Image (Left)"
                      placeholder="Upload left header image"
                      accept="image/*"
                      clearable
                      value={fileValueOrNull(form.values.pdfImageLeft)}
                      onChange={(file) => updateFileField('pdfImageLeft', file)}
                    />
                    <FileInput
                      label="PDF Header Image (Right)"
                      placeholder="Upload right header image"
                      accept="image/*"
                      clearable
                      value={fileValueOrNull(form.values.pdfImageRight)}
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
