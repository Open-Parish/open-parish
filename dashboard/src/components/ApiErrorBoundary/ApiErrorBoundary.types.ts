import type React from 'react';

export interface ApiErrorBoundaryState {
  hasError: boolean;
  retryCount: number;
}

export interface ApiErrorBoundaryInnerProps {
  children: React.ReactNode;
  onReset: () => void;
}
