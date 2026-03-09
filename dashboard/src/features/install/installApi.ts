import { API_BASE_URL } from '@/config';

import type { BootstrapPayload, InstallStatus } from './installApi.types';

export async function getInstallStatus(): Promise<InstallStatus | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/install/status`);
    if (!res.ok) return null;
    return res.json() as Promise<InstallStatus>;
  } catch {
    return null;
  }
}

export async function bootstrapSystem(payload: BootstrapPayload): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/install/bootstrap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = 'Bootstrap failed. Please try again.';
    try {
      const data = (await res.json()) as { message?: string };
      if (data?.message) message = data.message;
    } catch {
      message = 'Bootstrap failed. Please try again.';
    }
    throw new Error(message);
  }
}
