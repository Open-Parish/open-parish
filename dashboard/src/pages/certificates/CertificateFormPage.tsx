import { Box, Button, Divider, Group, Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PageShell } from '@/components/PageShell/PageShell';
import { createCertificate, getCertificate, updateCertificate } from '@/features/certificates/api';
import { getCertificateConfigByPath } from '@/features/certificates/config';
import { getByPath, setByPath } from '@/features/certificates/utils';
import { autocompletePeople } from '@/features/people/api';
import { FieldInput } from './helpers/FieldInput';
import { fieldLabel } from './helpers/fieldLabel';
import { groupFields } from './helpers/groupFields';
import { isPersonNamePath } from './helpers/isPersonNamePath';
import { normalizeText } from '@/utils/normalizeText';

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
    queryFn: () => {
      if (!config || !id) throw new Error('Missing certificate config or id');
      return getCertificate(config, id);
    },
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
    mutationFn: (values: Record<string, unknown>) => {
      if (!config) throw new Error('Missing certificate config');
      return createCertificate(config, values);
    },
    onSuccess: () => {
      if (!config) return;
      navigate(config.routePath);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: Record<string, unknown>) => {
      if (!config || !id) throw new Error('Missing certificate config or id');
      return updateCertificate(config, id, values);
    },
    onSuccess: () => {
      if (!config) return;
      navigate(config.routePath);
    },
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
                const groupKey = `${group.label ?? 'group'}-${group.fields.map((field) => field.path).join('-')}`;

                return (
                  <Stack key={groupKey} gap="xs">
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
                              if (isPersonNamePath(field.path)) {
                                setPersonQuery(normalizeText(val));
                              }
                            }}
                            onFocus={() => {
                              setActivePersonFieldPath(field.path);
                              setPersonQuery(normalizeText(getByPath(form.values, field.path)));
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
                          if (isPersonNamePath(target.path)) {
                            setPersonQuery(normalizeText(val));
                          }
                        }}
                        onFocus={() => {
                          const target = group.fields[0];
                          setActivePersonFieldPath(target.path);
                          setPersonQuery(normalizeText(getByPath(form.values, target.path)));
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
