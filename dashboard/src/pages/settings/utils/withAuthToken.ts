export function withAuthToken(url: string, authToken?: string | null): string {
  if (!authToken) return url;
  const [path, query = ''] = url.split('?');
  const params = new URLSearchParams(query);
  params.set('auth_token', authToken);
  return `${path}?${params.toString()}`;
}
