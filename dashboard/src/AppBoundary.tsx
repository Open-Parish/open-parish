import React, { Component } from 'react';
import type { ErrorBoundaryProps, ErrorBoundaryState } from './AppBoundary.types';

class AppErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return <ErrorFallback />;
    }
    return children;
  }
}

function ErrorFallback() {
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
            background: '#fff3bf',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e8590c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 600, color: '#212529' }}>
          Something went wrong
        </h2>
        <p style={{ margin: '0 0 24px', fontSize: 14, color: '#868e96', lineHeight: 1.6 }}>
          The application encountered an unexpected error. This may be due to a temporary issue or an invalid URL.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 500,
              color: '#fff',
              background: '#12b886',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Reload page
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
            Go to dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export function AppBoundary({ children }: { children: React.ReactNode }) {
  return <AppErrorBoundary>{children}</AppErrorBoundary>;
}
