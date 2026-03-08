export const hasCryptoRandomUUID = (): boolean =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function';
