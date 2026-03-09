import { Center, Stack, Table, Text, ThemeIcon } from '@mantine/core';
import { IconFileOff } from '@tabler/icons-react';

export function EmptyState({ search }: Readonly<{ search: string }>) {
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
              {search ? 'Try a different name or clear the search.' : 'Add your first record using the button above.'}
            </Text>
          </Stack>
        </Center>
      </Table.Td>
    </Table.Tr>
  );
}
