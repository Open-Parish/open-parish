import { Anchor, Button, Group, Pagination, Paper, Table, TextInput } from '@mantine/core';
import { IconPrinter, IconSearch, IconTrash } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { openConfirmDeleteModal } from '@/components/ConfirmDeleteModal/ConfirmDeleteModal';
import { PageShell } from '@/components/PageShell/PageShell';
import { QueryState } from '@/components/QueryState/QueryState';
import { API_BASE_URL } from '@/config';
import { getToken } from '@/lib/session';
import { normalizeText } from '@/utils/normalizeText';
import { listCertificates, removeCertificate } from '@/features/certificates/api';
import { getCertificateConfigByPath } from '@/features/certificates/config';
import { friendlyDate } from '@/features/certificates/utils';
import { EmptyState } from './components/EmptyState';
import { TableSkeleton } from './components/TableSkeleton';

export function CertificateListPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const config = getCertificateConfigByPath(location.pathname);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const key = useMemo(() => ['cert-list', config?.key ?? 'unknown', page, search], [config?.key, page, search]);

  const listQuery = useQuery({
    queryKey: key,
    queryFn: () => {
      if (!config) {
        return Promise.resolve({
          docs: [],
          totalDocs: 0,
          limit: 10,
          totalPages: 1,
          page,
          hasPrevPage: false,
          hasNextPage: false,
          prevPage: null,
          nextPage: null,
        });
      }
      return listCertificates(config, page, search);
    },
    enabled: Boolean(config),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      if (!config) {
        throw new Error('Certificate config is missing');
      }
      return removeCertificate(config, id);
    },
    onSuccess: async () => {
      if (config) {
        await queryClient.invalidateQueries({ queryKey: ['cert-list', config.key] });
      }
    },
  });

  if (!config) {
    return null;
  }

  const { data } = listQuery;
  const docs = data?.docs ?? [];
  const token = getToken();
  const isEmpty = !listQuery.isLoading && docs.length === 0;

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
            <QueryState
              query={listQuery}
              isEmpty={isEmpty}
              emptyContent={<EmptyState search={search} />}
              loadingContent={<TableSkeleton />}
              errorContent={<EmptyState search={search} />}
            >
              {docs.map((row) => {
                const { id: rawId, occasionDate, createdAt, updatedAt } = row;
                const id = normalizeText(rawId);
                const printType = config.certificateType ?? config.apiModule;
                const printLink = `${API_BASE_URL}/certificates/${config.apiModule}/print/${id}/${printType}?auth_token=${token ?? ''}`;

                return (
                  <Table.Tr key={id}>
                    <Table.Td>
                      <Anchor component={Link} to={`${config.routePath}/edit/${id}`}>
                        {config.nameFromRecord(row)}
                      </Anchor>
                    </Table.Td>
                    <Table.Td>{friendlyDate(config.secondaryFromRecord?.(row) ?? occasionDate)}</Table.Td>
                    <Table.Td>{friendlyDate(createdAt)}</Table.Td>
                    <Table.Td>{friendlyDate(updatedAt)}</Table.Td>
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
              })}
            </QueryState>
          </Table.Tbody>
        </Table>
      </Paper>

      {!listQuery.isLoading && !isEmpty && <Pagination value={page} onChange={setPage} total={data?.totalPages ?? 1} />}
    </PageShell>
  );
}
