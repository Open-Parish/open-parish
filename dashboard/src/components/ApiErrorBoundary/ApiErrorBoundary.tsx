import React, { Component } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import type { ApiErrorBoundaryInnerProps, ApiErrorBoundaryState } from './ApiErrorBoundary.types';

const MAX_RETRIES = 10;

class ApiErrorBoundaryInner extends Component<ApiErrorBoundaryInnerProps, ApiErrorBoundaryState> {
  constructor(props: ApiErrorBoundaryInnerProps) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError(): Partial<ApiErrorBoundaryState> {
    return { hasError: true };
  }

  handleRetry = () => {
    const { onReset } = this.props;
    this.setState(
      (prev) => ({ hasError: false, retryCount: prev.retryCount + 1 }),
      () => onReset(),
    );
  };

  render() {
    const { hasError, retryCount } = this.state;
    const { children } = this.props;

    if (hasError) {
      const maxReached = retryCount >= MAX_RETRIES;

      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: '#f8f9fa',
            fontFamily: "'Inter', system-ui, sans-serif",
            padding: 24,
          }}
        >
          <div
            style={{
              maxWidth: 420,
              width: '100%',
              background: '#fff',
              borderRadius: 12,
              padding: 40,
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.04)',
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: '#dbe4ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4263eb"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="1" y1="1" x2="23" y2="23" />
                <path d="M16.72 11.06A10.94 10.94 0 0119 12.55" />
                <path d="M5 12.55a10.94 10.94 0 015.17-2.39" />
                <path d="M10.71 5.05A16 16 0 0122.56 9" />
                <path d="M1.42 9a15.91 15.91 0 014.7-2.88" />
                <path d="M8.53 16.11a6 6 0 016.95 0" />
                <line x1="12" y1="20" x2="12.01" y2="20" />
              </svg>
            </div>
            <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 600, color: '#212529' }}>
              Unable to reach the server
            </h2>
            <p style={{ margin: '0 0 24px', fontSize: 14, color: '#868e96', lineHeight: 1.6 }}>
              {maxReached
                ? 'Maximum retries reached. Please try again later.'
                : 'Please check your internet connection and try again.'}
            </p>
            {retryCount > 0 && !maxReached && (
              <p style={{ margin: '0 0 16px', fontSize: 13, color: '#adb5bd' }}>
                Attempt {retryCount} of {MAX_RETRIES}
              </p>
            )}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                type="button"
                onClick={this.handleRetry}
                disabled={maxReached}
                style={{
                  padding: '10px 20px',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#fff',
                  background: maxReached ? '#adb5bd' : '#12b886',
                  border: 'none',
                  borderRadius: 8,
                  cursor: maxReached ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={() => { window.location.href = '/'; }}
                style={{
                  padding: '10px 20px',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#495057',
                  background: '#fff',
                  border: '1px solid #dee2e6',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export function ApiErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ApiErrorBoundaryInner onReset={reset}>
          {children}
        </ApiErrorBoundaryInner>
      )}
    </QueryErrorResetBoundary>
  );
}
