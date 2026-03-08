import { Suspense, lazy } from 'react';

const Devtools = lazy(() =>
  import('@tanstack/react-query-devtools').then((module) => ({ default: module.ReactQueryDevtools })),
);

export function ReactQueryDevtools() {
  if (!import.meta.env.DEV) return null;
  return (
    <Suspense fallback={null}>
      <Devtools initialIsOpen={false} />
    </Suspense>
  );
}
