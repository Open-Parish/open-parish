export function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  let status: number | null = null;
  if (typeof error === 'object' && error !== null) {
    const candidate = error as { status?: unknown };
    status = typeof candidate.status === 'number' ? candidate.status : null;
  }

  if (status !== null && status >= 400 && status < 500 && status !== 429) {
    return false;
  }

  return failureCount < 2;
}
