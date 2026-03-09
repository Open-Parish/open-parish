export function formatGroupLabel(parent: string): string {
  return parent
    .replace(/([A-Z])/g, ' $1')
    .replace(/(\d+)/, ' $1')
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
}
