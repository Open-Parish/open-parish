import { Skeleton, Table } from '@mantine/core';

const SKELETON_ROWS = 6;

export function TableSkeleton() {
  return (
    <>
      {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
        <Table.Tr key={i}>
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
