# QueryState

`QueryState` standardizes loading, error, empty, and not-found rendering so list/detail views stay consistent.

## Responsibilities

- Render loading and error states based on the query object.
- Render empty or not-found messages when explicitly signaled.
- Render children only when data is ready.

## Inputs

- `query`: A React Query result object (`useQuery`).
- `isEmpty`: Boolean, typically `data.length === 0`.
- `isNotFound`: Boolean, usually `!id` or a 404 mapped flag.
- `errorMessage`: Optional custom error text.
- `emptyMessage`: Optional empty text.
- `loadingMessage`: Optional loading text.
- `notFoundMessage`: Optional not-found text.

## Usage

```tsx
import { Card } from '@mantine/core';
import { QueryState } from '@/components/QueryState/QueryState';
import { TableBase } from '@/components/TableBase/TableBase';
import { useItemsQuery } from '@/pages/items/hooks/useItemsQuery';
import { columns } from './columns';

export function ItemsTable() {
  const itemsQuery = useItemsQuery();
  const items = itemsQuery.data ?? [];
  const isEmpty = items.length === 0;

  return (
    <Card withBorder radius="md" padding="lg">
      <QueryState query={itemsQuery} isEmpty={isEmpty} emptyMessage="No items found.">
        <TableBase data={items} columns={columns} />
      </QueryState>
    </Card>
  );
}
```

## Not Found Example

```tsx
import { Card } from '@mantine/core';
import { QueryState } from '@/components/QueryState/QueryState';
import { useParams } from 'react-router-dom';
import { useItemQuery } from '@/pages/items/hooks/useItemQuery';

export function ItemDetails() {
  const { itemId } = useParams();
  const itemQuery = useItemQuery(itemId);
  const isNotFound = !itemId;

  return (
    <Card withBorder radius="md" padding="lg">
      <QueryState query={itemQuery} isEmpty={false} isNotFound={isNotFound} notFoundMessage="Resource not found.">
        <div>Details...</div>
      </QueryState>
    </Card>
  );
}
```
