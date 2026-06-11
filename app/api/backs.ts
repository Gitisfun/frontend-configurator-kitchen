import type { BackOption } from '../models/back';

export type { BackOption } from '../models/back';

export const BACKS_PATH = '/api/backs' as const;

export function defaultBacksResponse(): BackOption[] {
  return [];
}
