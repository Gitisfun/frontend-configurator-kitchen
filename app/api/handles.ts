import type { HandleOption } from '../models/handle';

export type { HandleOption } from '../models/handle';

export const HANDLES_PATH = '/api/handles' as const;

export function defaultHandlesResponse(): HandleOption[] {
  return [];
}
