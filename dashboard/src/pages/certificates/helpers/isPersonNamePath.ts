export function isPersonNamePath(path: string): boolean {
  return path.endsWith('.firstName') || path.endsWith('.lastName') || path === 'firstName' || path === 'lastName';
}
