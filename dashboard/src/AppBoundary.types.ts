import type React from 'react';

export type ErrorBoundaryProps = {
  children: React.ReactNode;
};

export type ErrorBoundaryState = {
  hasError: boolean;
};
