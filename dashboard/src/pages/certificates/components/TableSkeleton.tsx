import { Skeleton, Table } from '@mantine/core';

const SKELETON_KEYS = ['s1', 's2', 's3', 's4', 's5', 's6'];

export function TableSkeleton() {
  return (
    <>
      {SKELETON_KEYS.map((key) => (
        <Table.Tr key={key}>
          <Table.Td>
            <Skeleton height={14} radius="sm" w="60%" />
          </Table.Td>
          <Table.Td>
            <Skeleton height={14} radius="sm" w="80px" />
          </Table.Td>
          <Table.Td>
            <Skeleton height={14} radius="sm" w="90px" />
          </Table.Td>
          <Table.Td>
            <Skeleton height={14} radius="sm" w="90px" />
          </Table.Td>
          <Table.Td>
            <Skeleton height={14} radius="sm" w={20} />
          </Table.Td>
          <Table.Td>
            <Skeleton height={14} radius="sm" w={20} />
          </Table.Td>
        </Table.Tr>
      ))}
    </>
  );
}
