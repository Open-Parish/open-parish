# List Page

Use the Training page as the reference implementation for list pages. Follow these practices:

- Keep the page component minimal: it should mostly compose page-level building blocks (shell, header, primary sections, modals).
- Move data fetching and list rendering into a dedicated list component (e.g., `TrainingTable`).
- Wrap list views with `QueryState` and show empty states based on `isEmpty`.
- Use `TableBase` with a separate `columns` module to keep rendering logic modular.
- Place list content inside a `Card` in the list component, not the page component.
- Avoid prop drilling for create flows; move create logic into the create modal component.
- Use a shared form hook/store so header actions (e.g., "Add") and the modal stay in sync.
- Prefer more files with less code per file; keep hooks and logic inside the owning component rather than passing them as props.

## File Structure and File List

Recommended folder layout for a list page:

```
src/pages/list/
  ListPage.tsx
  components/
    ListHeader/
      ListHeader.tsx
    ListTable/
      ListTable.tsx
      columns.ts
    ListCreateModal/
      ListCreateModal.tsx
  hooks/
    useListForm.ts
    useListQuery.ts
    useListMutations.ts
  services/
    listApi.ts
```

File responsibilities:

| File                                                            | Responsibility                                                                   |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `src/pages/list/ListPage.tsx`                                   | Page composition only: shell, header, list table, and create modal.              |
| `src/pages/list/components/ListHeader/ListHeader.tsx`           | Header actions; opens the create modal.                                          |
| `src/pages/list/components/ListTable/ListTable.tsx`             | Fetches list data and renders `QueryState`, `TableBase`, and the `Card` wrapper. |
| `src/pages/list/components/ListTable/columns.ts`                | Column definitions and cell renderers for the table.                             |
| `src/pages/list/components/ListCreateModal/ListCreateModal.tsx` | Create form UI and mutation wiring; owns open/close handling.                    |
| `src/pages/list/hooks/useListForm.ts`                           | Shared form state and open/close actions (store-backed).                         |
| `src/pages/list/hooks/useListQuery.ts`                          | List query hook (fetches list data).                                             |
| `src/pages/list/hooks/useListMutations.ts`                      | Create/delete/update mutations for list items.                                   |
| `src/pages/list/services/listApi.ts`                            | API client functions and type definitions.                                       |

## Example ListPage

```tsx
import { PageShell } from '@/components/PageShell/PageShell';
import { ListHeader } from './components/ListHeader/ListHeader';
import { ListCreateModal } from './components/ListCreateModal/ListCreateModal';
import { ListTable } from './components/ListTable/ListTable';

export function ListPage() {
  return (
    <PageShell
      title="Items"
      subtitle="Create and manage items."
      headerContent={<ListHeader />}
      breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Items' }]}
    >
      <ListTable />
      <ListCreateModal />
    </PageShell>
  );
}
```

## Detailed Breakdown

This pattern splits list pages into small, focused components. The page is only a shell, while list behavior and create flows live in their own components.

- `ListPage`
  - Purpose: Layout and composition only.
  - Responsibilities: Page title/subtitle, breadcrumbs, header, and placement of list + create modal.
  - Dependencies: `PageShell`, `ListHeader`, `ListTable`, `ListCreateModal`.

- `ListHeader`
  - Purpose: Top-right action(s) for the list page.
  - Responsibilities: Trigger opening the create modal (e.g., "Add item").
  - Dependencies: A shared form store/hook for `openCreate`.

- `ListTable`
  - Purpose: Own list data and rendering.
  - Responsibilities:
    - Fetch list data (`useListQuery`).
    - Compute `isEmpty` for empty state handling.
    - Render list inside a `Card`.
    - Wrap with `QueryState`.
    - Render `TableBase` with `columns`.
  - Dependencies: `QueryState`, `TableBase`, `columns`, list query hook.

- `ListCreateModal`
  - Purpose: Own create form state and create mutation.
  - Responsibilities:
    - Control modal open/close.
    - Manage form input state.
    - Validate `canCreate` and prevent double submits.
    - Call the create mutation and close/reset on success.
  - Dependencies: shared form store/hook, create mutation hook.

- `columns`
  - Purpose: Table column definitions.
  - Responsibilities: Define column headers and cell renderers.
  - Dependencies: Table row actions such as `ConfirmDelete`, if needed.

## Component Skeletons

```tsx
// ListHeader.tsx
import { Button, Group } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useListForm } from '@/pages/list/hooks/useListForm';

export function ListHeader() {
  const { openCreate } = useListForm();

  return (
    <Group justify="flex-end" align="center">
      <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
        Add item
      </Button>
    </Group>
  );
}
```

```tsx
// ListTable.tsx
import { Card } from '@mantine/core';
import { QueryState } from '@/components/QueryState/QueryState';
import { TableBase } from '@/components/TableBase/TableBase';
import { useListQuery } from '@/pages/list/hooks/useListQuery';
import { columns } from './columns';

export function ListTable() {
  const listQuery = useListQuery();
  const items = listQuery.data ?? [];
  const isEmpty = items.length === 0;

  return (
    <Card withBorder radius="md" padding="lg">
      <QueryState query={listQuery} isEmpty={isEmpty}>
        <TableBase data={items} columns={columns} />
      </QueryState>
    </Card>
  );
}
```

```tsx
// ListCreateModal.tsx
import { Button, Group, Modal, Stack, TextInput } from '@mantine/core';
import { useListForm } from '@/pages/list/hooks/useListForm';
import { useListMutations } from '@/pages/list/hooks/useListMutations';

export function ListCreateModal() {
  const { name, setName, createOpen, closeCreate, canCreate } = useListForm();
  const { createMutation } = useListMutations();

  const handleClose = () => {
    setName('');
    closeCreate();
  };

  const handleCreate = () => {
    if (!canCreate || createMutation.isPending) return;
    createMutation.mutate(name.trim(), {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  return (
    <Modal opened={createOpen} onClose={handleClose} title="Add item" centered>
      <Stack>
        <TextInput
          label="Name"
          placeholder="e.g. Example item"
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
          required
          autoFocus
        />
        <Group justify="flex-end">
          <Button variant="default" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!canCreate || createMutation.isPending}
            loading={createMutation.isPending}
          >
            Add item
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
```

```ts
// useListForm.ts
import { useMemo, useState } from 'react';

export const useListForm = () => {
  const [name, setName] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const openCreate = () => setCreateOpen(true);
  const closeCreate = () => setCreateOpen(false);
  const canCreate = name.trim().length > 0;

  const values = useMemo(
    () => ({
      name,
      createOpen,
      canCreate,
      setName,
      openCreate,
      closeCreate,
    }),
    [name, createOpen, canCreate],
  );

  return values;
};
```

```ts
// columns.ts
import type { ColumnDef } from '@tanstack/react-table';
import type { ListItem } from '../services/listApi';

export const columns: ColumnDef<ListItem>[] = [{ accessorKey: 'name', header: 'Name' }];
```
