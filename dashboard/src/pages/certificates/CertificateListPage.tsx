import {
  Anchor,
  Button,
  Center,
  Group,
  Pagination,
  Paper,
  Skeleton,
  Stack,
  Table,
  Text,
  TextInput,
  ThemeIcon,
} from '@mantine/core';
import { IconFileOff, IconPrinter, IconSearch, IconTrash } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { openConfirmDeleteModal } from '@/components/ConfirmDeleteModal/ConfirmDeleteModal';
import { PageShell } from '@/components/PageShell/PageShell';
import { API_BASE_URL } from '@/config';
import { getToken } from '@/lib/session';
import { listCertificates, removeCertificate } from '@/features/certificates/api';
import { getCertificateConfigByPath } from '@/features/certificates/config';
import { friendlyDate } from '@/features/certificates/utils';

const SKELETON_ROWS = 6;

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
        <Table.Tr key={i}>
          <Table.Td><Skeleton height={14} radius="sm" w="60%" /></Table.Td>
          <Table.Td><Skeleton height={14} radius="sm" w="80px" /></Table.Td>
          <Table.Td><Skeleton height={14} radius="sm" w="90px" /></Table.Td>
          <Table.Td><Skeleton height={14} radius="sm" w="90px" /></Table.Td>
          <Table.Td><Skeleton height={14} radius="sm" w={20} /></Table.Td>
          <Table.Td><Skeleton height={14} radius="sm" w={20} /></Table.Td>
        </Table.Tr>
      ))}
    </>
  );
}

function EmptyState({ search }: { search: string }) {
  return (
    <Table.Tr>
      <Table.Td colSpan={6}>
        <Center py={64}>
          <Stack align="center" gap="sm">
            <ThemeIcon variant="light" color="gray" size={52} radius="xl">
              <IconFileOff size={26} stroke={1.5} />
            </ThemeIcon>
            <Text fw={600} size="sm" c="dimmed">
              {search ? `No results for "${search}"` : 'No records yet'}
            </Text>
            <Text size="xs" c="dimmed" maw={260} ta="center">
              {search
                ? 'Try a different name or clear the search.'
                : 'Add your first record using the button above.'}
            </Text>
          </Stack>
        </Center>
      </Table.Td>
    </Table.Tr>
  );
}

export function CertificateListPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const config = getCertificateConfigByPath(location.pathname);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  if (!config) {
    return null;
  }

  const key = useMemo(() => ['cert-list', config.key, page, search], [config.key, page, search]);

  const listQuery = useQuery({
    queryKey: key,
    queryFn: () => listCertificates(config, page, search),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => removeCertificate(config, id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cert-list', config.key] });
    },
  });

  const docs = listQuery.data?.docs ?? [];
  const token = getToken();
  const isLoading = listQuery.isLoading;
  const isEmpty = !isLoading && docs.length === 0;

  return (
    <PageShell title={config.title} subtitle={config.subtitle}>
      <Group justify="space-between">
        <TextInput
          leftSection={<IconSearch size={14} />}
          placeholder="Search first name or last name"
          value={search}
          onChange={(event) => {
            setPage(1);
            setSearch(event.currentTarget.value);
          }}
          style={{ maxWidth: 420, width: '100%' }}
        />
        <Button onClick={() => navigate(`${config.routePath}/new`)}>Add New</Button>
      </Group>

      <Paper withBorder shadow="xs" style={{ overflow: 'hidden' }}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Occasion</Table.Th>
              <Table.Th>Created</Table.Th>
              <Table.Th>Updated</Table.Th>
              <Table.Th>Print</Table.Th>
              <Table.Th>Delete</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading ? (
              <TableSkeleton />
            ) : isEmpty ? (
              <EmptyState search={search} />
            ) : (
              docs.map((row) => {
                const id = String(row._id ?? row.id ?? '');
                const printType = config.certificateType ?? config.apiModule;
                const printLink = `${API_BASE_URL}/certificates/${config.apiModule}/print/${id}/${printType}?auth_token=${token ?? ''}`;

                return (
                  <Table.Tr key={id}>
                    <Table.Td>
                      <Anchor component={Link} to={`${config.routePath}/edit/${id}`}>
                        {config.nameFromRecord(row)}
                      </Anchor>
                    </Table.Td>
                    <Table.Td>{friendlyDate(config.secondaryFromRecord?.(row) ?? row.occasionDate)}</Table.Td>
                    <Table.Td>{friendlyDate(row.createdAt)}</Table.Td>
                    <Table.Td>{friendlyDate(row.updatedAt)}</Table.Td>
                    <Table.Td>
                      <Anchor href={printLink} target="_blank">
                        <IconPrinter size={16} />
                      </Anchor>
                    </Table.Td>
                    <Table.Td>
                      <Anchor
                        c="red"
                        onClick={() =>
                          openConfirmDeleteModal({
                            onConfirm: () => deleteMutation.mutate(id),
                          })
                        }
                      >
                        <IconTrash size={16} />
                      </Anchor>
                    </Table.Td>
                  </Table.Tr>
                );
              })
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      {!isLoading && !isEmpty && (
        <Pagination value={page} onChange={setPage} total={listQuery.data?.totalPages ?? 1} />
      )}
    </PageShell>
  );
}
