import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Group,
  NumberInput,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PageShell } from '@/components/PageShell/PageShell';
import { createCertificate, getCertificate, updateCertificate } from '@/features/certificates/api';
import { getCertificateConfigByPath } from '@/features/certificates/config';
import type { FormField } from '@/features/certificates/certificates.types';
import { getByPath, setByPath } from '@/features/certificates/utils';
import { autocompletePeople } from '@/features/people/api';

// ─── Field grouping ───────────────────────────────────────────

import type { FieldGroup } from './CertificateFormPage.types';

function formatGroupLabel(parent: string): string {
  return parent
    .replace(/([A-Z])/g, ' $1') // camelCase → words
    .replace(/(\d+)/, ' $1') // "parent1" → "parent 1"
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
}

/** For nested fields, use just the last path segment as the label ("firstName" → "First Name") */
function fieldLabel(field: FormField, inGroup: boolean): string {
  if (!inGroup) return field.label;
  const segment = field.path.split('.').pop() ?? field.path;
  return segment.replace(/([A-Z])/g, ' $1').replace(/^\w/, (c) => c.toUpperCase());
}

function groupFields(fields: FormField[]): FieldGroup[] {
  const groups: FieldGroup[] = [];
  let i = 0;

  while (i < fields.length) {
    const field = fields[i];
    const dotIdx = field.path.lastIndexOf('.');

    if (dotIdx >= 0) {
      // Nested field: collect all siblings with same parent
      const parent = field.path.slice(0, dotIdx);
      const siblings: FormField[] = [field];
      while (i + 1 < fields.length && fields[i + 1].path.slice(0, fields[i + 1].path.lastIndexOf('.')) === parent) {
        i += 1;
        siblings.push(fields[i]);
      }
      groups.push({ fields: siblings, label: formatGroupLabel(parent) });
    } else if (field.type === 'number') {
      // Pair consecutive root-level number fields (bookNumber + pageNumber)
      const next = fields[i + 1];
      if (next && next.type === 'number' && !next.path.includes('.')) {
        groups.push({ fields: [field, next] });
        i += 1;
      } else {
        groups.push({ fields: [field] });
      }
    } else {
      // Root-level text/date: pair firstName + lastName
      const next = fields[i + 1];
      const isNamePair = field.path === 'firstName' && next?.path === 'lastName' && !next.path.includes('.');
      if (isNamePair && next) {
        groups.push({ fields: [field, next] });
        i += 1;
      } else {
        groups.push({ fields: [field] });
      }
    }

    i += 1;
  }

  return groups;
}

// ─── Field renderer ───────────────────────────────────────────

function FieldInput({
  field,
  label,
  value,
  onChange,
  onFocus,
  data,
  loading,
}: {
  field: FormField;
  label: string;
  value: unknown;
  onChange: (val: unknown) => void;
  onFocus?: () => void;
  data?: string[];
  loading?: boolean;
}) {
  if (field.type === 'date') {
    return (
      <TextInput
        label={label}
        type="date"
        value={value ? String(value).slice(0, 10) : ''}
        onChange={(e) => onChange(e.currentTarget.value)}
      />
    );
  }

  if (field.type === 'number') {
    return <NumberInput label={label} value={Number(value ?? 0)} onChange={(next) => onChange(Number(next ?? 0))} />;
  }

  const segment = field.path.split('.').pop() ?? field.path;
  const isPersonNameField = segment === 'firstName' || segment === 'lastName';

  if (isPersonNameField) {
    return (
      <Autocomplete
        label={label}
        data={data ?? []}
        value={String(value ?? '')}
        onChange={(next) => onChange(next)}
        onFocus={onFocus}
        limit={10}
        comboboxProps={{ withinPortal: true }}
        rightSection={
          loading ? (
            <Text size="xs" c="dimmed">
              ...
            </Text>
          ) : undefined
        }
      />
    );
  }

  return (
    <TextInput
      label={label}
      value={String(value ?? '')}
      onChange={(e) => onChange(e.currentTarget.value)}
      onFocus={onFocus}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────

export function CertificateFormPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const config = getCertificateConfigByPath(location.pathname);
  const isEdit = Boolean(id);
  const [activePersonFieldPath, setActivePersonFieldPath] = useState<string | null>(null);
  const [personQuery, setPersonQuery] = useState('');

  const detailQuery = useQuery({
    queryKey: ['cert-detail', config?.key, id],
    queryFn: () => getCertificate(config!, id!),
    enabled: Boolean(config && id),
  });

  const autocompleteQuery = useQuery({
    queryKey: ['people-autocomplete', personQuery],
    queryFn: () => autocompletePeople(personQuery, 12),
    enabled: personQuery.trim().length > 0,
  });

  const form = useForm<Record<string, unknown>>({
    initialValues: config?.defaultValues ?? {},
    validate: {
      ...(config?.fields.some((field) => field.path === 'firstName')
        ? {
            firstName: (value: unknown) => (typeof value === 'string' && value.trim().length > 0 ? null : 'Required'),
          }
        : {}),
      ...(config?.fields.some((field) => field.path === 'lastName')
        ? {
            lastName: (value: unknown) => (typeof value === 'string' && value.trim().length > 0 ? null : 'Required'),
          }
        : {}),
    },
  });

  useEffect(() => {
    if (config) form.setValues(config.defaultValues);
  }, [config, form]);

  useEffect(() => {
    if (isEdit && detailQuery.data) {
      form.setValues(detailQuery.data as Record<string, unknown>);
    }
  }, [detailQuery.data, form, isEdit]);

  const createMutation = useMutation({
    mutationFn: (values: Record<string, unknown>) => createCertificate(config!, values),
    onSuccess: () => navigate(config!.routePath),
  });

  const updateMutation = useMutation({
    mutationFn: (values: Record<string, unknown>) => updateCertificate(config!, id!, values),
    onSuccess: () => navigate(config!.routePath),
  });

  const groups = useMemo(() => groupFields(config?.fields ?? []), [config?.fields]);
  const activeSegment = activePersonFieldPath?.split('.').pop() ?? '';

  const personSuggestions = useMemo(() => {
    const items = autocompleteQuery.data ?? [];
    const values =
      activeSegment === 'lastName' ? items.map((item) => item.lastName) : items.map((item) => item.firstName);
    return [...new Set(values.filter(Boolean))];
  }, [activeSegment, autocompleteQuery.data]);

  if (!config) return null;

  return (
    <PageShell title={`${isEdit ? 'Edit' : 'New'} ${config.listTitle}`} subtitle={config.subtitle}>
      <Box maw={740}>
        <Paper withBorder shadow="xs" p={{ base: 'md', sm: 'xl' }}>
          <form
            onSubmit={form.onSubmit((values) => {
              if (isEdit) updateMutation.mutate(values);
              else createMutation.mutate(values);
            })}
          >
            <Stack gap="lg">
              {groups.map((group, gi) => {
                const isPair = group.fields.length === 2;

                return (
                  <Stack key={gi} gap="xs">
                    {group.label && (
                      <>
                        {gi > 0 && <Divider mt="xs" />}
                        <Text
                          size="xs"
                          fw={700}
                          tt="uppercase"
                          c="dimmed"
                          mt={gi > 0 ? 'xs' : 0}
                          style={{ letterSpacing: '0.06em' }}
                        >
                          {group.label}
                        </Text>
                      </>
                    )}
                    {isPair ? (
                      <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="md">
                        {group.fields.map((field) => (
                          <FieldInput
                            key={field.path}
                            field={field}
                            label={fieldLabel(field, Boolean(group.label))}
                            value={getByPath(form.values, field.path)}
                            onChange={(val) => {
                              const nextValues = setByPath(form.values, field.path, val);
                              form.setValues(nextValues);
                              if (
                                field.path.endsWith('.firstName') ||
                                field.path.endsWith('.lastName') ||
                                field.path === 'firstName' ||
                                field.path === 'lastName'
                              ) {
                                setPersonQuery(String(val ?? ''));
                              }
                            }}
                            onFocus={() => {
                              setActivePersonFieldPath(field.path);
                              setPersonQuery(String(getByPath(form.values, field.path) ?? ''));
                            }}
                            data={activePersonFieldPath === field.path ? personSuggestions : []}
                            loading={activePersonFieldPath === field.path && autocompleteQuery.isFetching}
                          />
                        ))}
                      </SimpleGrid>
                    ) : (
                      <FieldInput
                        key={group.fields[0].path}
                        field={group.fields[0]}
                        label={fieldLabel(group.fields[0], Boolean(group.label))}
                        value={getByPath(form.values, group.fields[0].path)}
                        onChange={(val) => {
                          const target = group.fields[0];
                          const nextValues = setByPath(form.values, target.path, val);
                          form.setValues(nextValues);
                          if (
                            target.path.endsWith('.firstName') ||
                            target.path.endsWith('.lastName') ||
                            target.path === 'firstName' ||
                            target.path === 'lastName'
                          ) {
                            setPersonQuery(String(val ?? ''));
                          }
                        }}
                        onFocus={() => {
                          const target = group.fields[0];
                          setActivePersonFieldPath(target.path);
                          setPersonQuery(String(getByPath(form.values, target.path) ?? ''));
                        }}
                        data={activePersonFieldPath === group.fields[0].path ? personSuggestions : []}
                        loading={activePersonFieldPath === group.fields[0].path && autocompleteQuery.isFetching}
                      />
                    )}
                  </Stack>
                );
              })}

              <Divider mt="xs" />

              <Group>
                <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>
                  {isEdit ? 'Save Changes' : 'Create Record'}
                </Button>
                <Button variant="default" onClick={() => navigate(config.routePath)}>
                  Cancel
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>
      </Box>
    </PageShell>
  );
}
