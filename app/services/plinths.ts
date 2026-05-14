import type { PlinthOption } from '../models/plinth';

export type { PlinthOption } from '../models/plinth';

export const PLINTHS_PATH = '/api/plinths' as const;

export function defaultPlinthsResponse(): PlinthOption[] {
  return [];
}
