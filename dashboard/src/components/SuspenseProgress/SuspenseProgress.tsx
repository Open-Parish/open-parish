import { useEffect } from 'react';
import { nprogress } from '@mantine/nprogress';

export function SuspenseProgress() {
  useEffect(() => {
    nprogress.start();
    return () => {
      nprogress.complete();
    };
  }, []);

  return null;
}
