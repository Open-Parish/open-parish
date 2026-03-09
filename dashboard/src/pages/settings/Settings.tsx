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
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useRef } from 'react';
import { resolveApiUrl } from '@/api/client';
import { PageShell } from '@/components/PageShell/PageShell';
import { getSettings, updateSettings } from '@/features/settings/settingsApi';
import { getToken } from '@/lib/session';
import type { SettingsForm } from './Settings.types';

function resolveAssetPreview(value: string, authToken?: string | null): string {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) return '';
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }
  if (trimmed.startsWith('/')) {
    return withAuthToken(resolveApiUrl(trimmed), authToken);
  }
  return withAuthToken(resolveApiUrl(`/${trimmed}`), authToken);
}

function withAuthToken(url: string, authToken?: string | null): string {
  if (!authToken) return url;
  const [path, query = ''] = url.split('?');
  const params = new URLSearchParams(query);
  params.set('auth_token', authToken);
  return `${path}?${params.toString()}`;
}

export function Settings() {
  const authToken = getToken();
  const query = useQuery({ queryKey: ['settings'], queryFn: getSettings });
  const hasHydratedFromQuery = useRef(false);

  const form = useForm<SettingsForm>({
    initialValues: {
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
    },
    validate: {
      headerLine1: (value) => (!value ? 'Required' : null),
      headerLine2: (value) => (!value ? 'Required' : null),
      currentPriest: (value) => (!value ? 'Required' : null),
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
    onSuccess: (nextSettings) => {
      form.setValues(nextSettings);
    },
  });

  const leftImageObjectUrl = useMemo(
    () => (form.values.pdfImageLeft instanceof File ? URL.createObjectURL(form.values.pdfImageLeft) : ''),
    [form.values.pdfImageLeft],
  );
  const rightImageObjectUrl = useMemo(
    () => (form.values.pdfImageRight instanceof File ? URL.createObjectURL(form.values.pdfImageRight) : ''),
    [form.values.pdfImageRight],
  );
  const signatureObjectUrl = useMemo(
    () =>
      form.values.currentPriestSignature instanceof File ? URL.createObjectURL(form.values.currentPriestSignature) : '',
    [form.values.currentPriestSignature],
  );

  const leftImagePreview = useMemo(
    () => resolveAssetPreview(leftImageObjectUrl || String(form.values.pdfImageLeft || ''), authToken),
    [authToken, form.values.pdfImageLeft, leftImageObjectUrl],
  );
  const rightImagePreview = useMemo(
    () => resolveAssetPreview(rightImageObjectUrl || String(form.values.pdfImageRight || ''), authToken),
    [authToken, form.values.pdfImageRight, rightImageObjectUrl],
  );
  const signaturePreview = useMemo(
    () => resolveAssetPreview(signatureObjectUrl || String(form.values.currentPriestSignature || ''), authToken),
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
              {/* Certificate header lines */}
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

              {/* Parish priest */}
              <Stack gap="xs">
                <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.06em' }}>
                  Parish Priest
                </Text>
                <Text size="xs" c="dimmed">
                  Name and signature used on all printed certificates.
                </Text>
                <Stack mt={4}>
                  <TextInput label="Priest Name" {...form.getInputProps('currentPriest')} />
                  <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="md">
                    <FileInput
                      label="Priest Signature"
                      placeholder="Upload signature image"
                      accept="image/*"
                      clearable
                      value={
                        form.values.currentPriestSignature instanceof File ? form.values.currentPriestSignature : null
                      }
                      onChange={(file) =>
                        form.setFieldValue('currentPriestSignature', file ?? query.data?.currentPriestSignature ?? '')
                      }
                    />
                    <FileInput
                      label="PDF Header Image (Left)"
                      placeholder="Upload left header image"
                      accept="image/*"
                      clearable
                      value={form.values.pdfImageLeft instanceof File ? form.values.pdfImageLeft : null}
                      onChange={(file) => form.setFieldValue('pdfImageLeft', file ?? query.data?.pdfImageLeft ?? '')}
                    />
                  </SimpleGrid>
                  <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="md">
                    <FileInput
                      label="PDF Header Image (Right)"
                      placeholder="Upload right header image"
                      accept="image/*"
                      clearable
                      value={form.values.pdfImageRight instanceof File ? form.values.pdfImageRight : null}
                      onChange={(file) => form.setFieldValue('pdfImageRight', file ?? query.data?.pdfImageRight ?? '')}
                    />
                  </SimpleGrid>
                  <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="md">
                    <Group>
                      {signaturePreview ? (
                        <Image src={signaturePreview} alt="Priest signature preview" mah={90} fit="contain" />
                      ) : null}
                      <Text size="sm" c="dimmed">
                        Signature preview
                      </Text>
                    </Group>
                    <Group>
                      {leftImagePreview ? (
                        <Image src={leftImagePreview} alt="PDF header left image preview" mah={90} fit="contain" />
                      ) : null}
                      <Text size="sm" c="dimmed">
                        Left image preview
                      </Text>
                    </Group>
                  </SimpleGrid>
                  <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="md">
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
