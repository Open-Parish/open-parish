import { getJson } from '@/api/client';
import type { PeopleAutocompleteResponse } from './people.types';

export async function autocompletePeople(query: string, limit = 10) {
  const q = query.trim();
  if (!q) return [];

  const response = await getJson<PeopleAutocompleteResponse>(
    `/people/autocomplete?q=${encodeURIComponent(q)}&limit=${Math.max(1, Math.min(50, limit))}`,
  );

  return response.items ?? [];
}
