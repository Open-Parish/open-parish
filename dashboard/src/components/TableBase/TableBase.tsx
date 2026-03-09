import { Table } from '@mantine/core';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { cx } from '@/utils/cx';
import type { CSSProperties } from 'react';
import type { TableBaseProps } from './TableBase.types';
import styles from './TableBase.module.css';

export function TableBase<T>({ columns, data, minWidth, className, tableClassName }: Readonly<TableBaseProps<T>>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div
      className={cx(styles.tableWrapper, className)}
      style={minWidth ? ({ '--table-min-width': `${minWidth}px` } as CSSProperties) : undefined}
    >
      <Table verticalSpacing="sm" highlightOnHover className={cx(styles.table, tableClassName)}>
        <Table.Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.Th key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </Table.Th>
              ))}
            </Table.Tr>
          ))}
        </Table.Thead>
        <Table.Tbody>
          {table.getRowModel().rows.map((row) => (
            <Table.Tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Table.Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
}
