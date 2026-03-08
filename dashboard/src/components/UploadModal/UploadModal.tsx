import { Button, Group, Image, Modal, Stack, Text, FileInput } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import type { UploadModalProps } from './UploadModal.types';

export function UploadModal({
  opened,
  title = 'Upload image',
  accept = 'image/*',
  isSubmitting = false,
  onClose,
  onSubmit,
}: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file]);

  useEffect(() => {
    if (!previewUrl) return undefined;
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!opened) {
      setFile(null);
    }
  }, [opened]);

  const handleClose = () => {
    setFile(null);
    onClose();
  };

  const handleSave = () => {
    if (!file) return;
    onSubmit?.(file);
  };

  return (
    <Modal opened={opened} onClose={handleClose} title={title} centered>
      <Stack gap="sm">
        <FileInput
          label="Select image"
          placeholder="Choose an image file"
          accept={accept}
          value={file}
          onChange={setFile}
          leftSection={<IconUpload size={16} />}
        />
        {previewUrl ? (
          <Image src={previewUrl} alt="Upload preview" radius="md" />
        ) : (
          <Text size="sm" c="dimmed">
            Upload an image to preview it here.
          </Text>
        )}
        <Group justify="flex-end">
          <Button variant="default" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!file || isSubmitting} loading={isSubmitting}>
            Save
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
