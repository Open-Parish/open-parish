export const diffFields = <T extends Record<string, unknown>>(next: T, prev: T, keys: (keyof T)[]) =>
  keys.reduce<Partial<T>>((acc, key) => {
    if (next[key] !== prev[key]) acc[key] = next[key];
    return acc;
  }, {});

export const diffFieldsMapped = <
  TSource extends Record<string, unknown>,
  TTarget extends Record<string, unknown>,
  TKey extends keyof TSource,
>(
  next: TSource,
  prev: TSource,
  map: Record<TKey, keyof TTarget>,
) =>
  (Object.keys(map) as TKey[]).reduce<Partial<TTarget>>((acc, key) => {
    if (next[key] !== prev[key]) {
      const targetKey = map[key];
      acc[targetKey] = next[key] as unknown as TTarget[typeof targetKey];
    }
    return acc;
  }, {});
