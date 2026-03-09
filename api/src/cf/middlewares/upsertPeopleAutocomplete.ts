import { createMiddleware } from 'hono/factory';
import type { Env } from '../../index';
import { asRecord, asString } from '../utils/normalize';

type PersonName = {
  firstName: string;
  lastName: string;
};

function normalizeName(firstName: string, lastName: string): string {
  return `${firstName.trim().toLowerCase()}|${lastName.trim().toLowerCase()}`;
}

function extractPeopleFromPayload(payload: Record<string, unknown>): PersonName[] {
  const people: PersonName[] = [];

  const rootFirstName = asString(payload.firstName).trim();
  const rootLastName = asString(payload.lastName).trim();
  if (rootFirstName || rootLastName) {
    people.push({ firstName: rootFirstName, lastName: rootLastName });
  }

  for (const value of Object.values(payload)) {
    const obj = asRecord(value);
    const firstName = asString(obj.firstName).trim();
    const lastName = asString(obj.lastName).trim();
    if (firstName || lastName) {
      people.push({ firstName, lastName });
    }
  }

  const unique = new Map<string, PersonName>();
  for (const person of people) {
    unique.set(normalizeName(person.firstName, person.lastName), person);
  }

  return [...unique.values()];
}

export function upsertPeopleAutocomplete() {
  return createMiddleware<Env>(async (c, next) => {
    await next();

    if (c.res.status >= 400) return;

    const payload = asRecord(c.get('validatedJson'));
    const people = extractPeopleFromPayload(payload);
    if (people.length === 0) return;

    for (const person of people) {
      const normalizedName = normalizeName(person.firstName, person.lastName);
      await c.env.DB.prepare(
        `INSERT INTO people_autocomplete (
          id, firstName, lastName, normalizedName, useCount, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, 1, datetime('now'), datetime('now'))
        ON CONFLICT(normalizedName) DO UPDATE SET
          firstName = excluded.firstName,
          lastName = excluded.lastName,
          useCount = people_autocomplete.useCount + 1,
          updatedAt = datetime('now')`
      )
        .bind(crypto.randomUUID(), person.firstName, person.lastName, normalizedName)
        .run();
    }
  });
}
