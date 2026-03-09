export function OpenParishMark({ className }: Readonly<{ className?: string }>) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <rect x="4" y="4" width="32" height="32" rx="9" fill="currentColor" opacity="0.15" />
      <path d="M20 8v6M17 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 18.5l10-7 10 7v12a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 10 30.5v-12z" fill="currentColor" />
      <path d="M14 23.5a6 6 0 1 1 12 0v8h-12v-8z" fill="white" />
      <path d="M20 22.5v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.18" />
      <circle cx="20" cy="26.8" r="0.8" fill="currentColor" opacity="0.55" />
    </svg>
  );
}
