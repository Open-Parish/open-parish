import type { ColumnDef, TableMeta } from '@tanstack/react-table';

export type TableAlign = 'left' | 'center' | 'right';

export type TableColumnMeta = {
  align?: TableAlign;
  width?: number | string;
  className?: string;
};

export type TableColumnDef<T> = ColumnDef<T, unknown> & {
  meta?: TableColumnMeta;
};

export type TableBaseProps<T> = {
  columns: TableColumnDef<T>[];
  data: T[];
  minWidth?: number;
  getRowId?: (row: T, index: number) => string;
  meta?: TableMeta<T>;
  onRowClick?: (row: T) => void;
  className?: string;
  tableClassName?: string;
};
