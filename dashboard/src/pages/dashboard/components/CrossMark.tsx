import type { CrossMarkProps } from './CrossMark.types';

export function CrossMark({ className }: Readonly<CrossMarkProps>) {
  return (
    <svg viewBox="0 0 72 90" fill="none" className={className} aria-hidden="true">
      <rect x="26" y="0" width="20" height="90" rx="4" fill="currentColor" />
      <rect x="0" y="24" width="72" height="20" rx="4" fill="currentColor" />
    </svg>
  );
}
