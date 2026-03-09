export function OpenParishMark({ className }: Readonly<{ className?: string }>) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <rect x="5" y="5" width="30" height="30" rx="8" fill="currentColor" opacity="0.15" />
      <path d="M20 9v6M17 12h6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M11 19l9-7 9 7v12H11V19z" fill="currentColor" />
      <rect x="17.5" y="22.5" width="5" height="8.5" rx="1" fill="white" />
    </svg>
  );
}
