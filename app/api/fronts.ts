import type { FrontOption } from '../models/front';

export type { FrontOption } from '../models/front';

export const FRONTS_PATH = '/api/fronts' as const;

export function defaultFrontsResponse(): FrontOption[] {
  return [];
}
