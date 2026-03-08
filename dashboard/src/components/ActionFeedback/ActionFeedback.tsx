import { useEffect } from 'react';
import { Text } from '@mantine/core';
import { useLocation } from 'react-router-dom';
import { useActionFeedback } from '@/hooks/useActionFeedback';

export function ActionFeedback() {
  const { error, success, clear, locationKey, setLocationKey } = useActionFeedback();
  const location = useLocation();

  useEffect(() => {
    const currentPath = `${location.pathname}${location.search}${location.hash}`;
    if (locationKey && locationKey !== currentPath) {
      clear();
    }
    if (locationKey !== currentPath) {
      setLocationKey(currentPath);
    }
  }, [location.pathname, location.search, location.hash, clear, locationKey, setLocationKey]);

  if (!error && !success) {
    return null;
  }

  return (
    <>
      {error && (
        <Text size="sm" c="red">
          {error}
        </Text>
      )}
      {success && (
        <Text size="sm" c="var(--mantine-primary-color-filled)">
          {success}
        </Text>
      )}
    </>
  );
}
