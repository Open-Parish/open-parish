import { Box, Button, Divider, Paper, Stack, Text, TextInput, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { PageShell } from '@/components/PageShell/PageShell';
import { changePassword, getProfile } from '@/features/auth/authApi';

export function AccountPage() {
  const profileQuery = useQuery({ queryKey: ['profile'], queryFn: getProfile });

  const form = useForm({
    initialValues: { currentPassword: '', newPassword: '', repeatPassword: '' },
    validate: {
      currentPassword: (v) => (!v ? 'Required' : null),
      newPassword: (v) => (v.length < 8 ? 'At least 8 characters' : null),
      repeatPassword: (v, vals) => (v !== vals.newPassword ? 'Passwords do not match' : null),
    },
  });

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      notifications.show({ message: 'Password updated successfully', color: 'green' });
      form.reset();
    },
  });

  return (
    <PageShell title="Account" subtitle="Manage your login credentials.">
      <Box maw={480}>
        <Paper withBorder shadow="xs" p={{ base: 'md', sm: 'xl' }}>
          <Stack gap="lg">
            {/* Profile info */}
            <Stack gap="xs">
              <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.06em' }}>
                Profile
              </Text>
              <TextInput
                label="Email address"
                value={profileQuery.data?.user.email ?? ''}
                readOnly
              />
            </Stack>

            <Divider />

            {/* Change password */}
            <Stack gap="xs">
              <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.06em' }}>
                Change Password
              </Text>
              <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
                <Stack gap="md">
                  <PasswordInput
                    label="Current password"
                    placeholder="Enter current password"
                    {...form.getInputProps('currentPassword')}
                  />
                  <PasswordInput
                    label="New password"
                    placeholder="Min. 8 characters"
                    {...form.getInputProps('newPassword')}
                  />
                  <PasswordInput
                    label="Confirm new password"
                    placeholder="Repeat new password"
                    {...form.getInputProps('repeatPassword')}
                  />
                  <Box>
                    <Button type="submit" loading={mutation.isPending}>
                      Update password
                    </Button>
                  </Box>
                </Stack>
              </form>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </PageShell>
  );
}
