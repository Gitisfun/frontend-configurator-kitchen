import type { FrontOption } from '../models/front';

export type { FrontOption } from '../models/front';

/** BFF route — served by `server/api/fronts.get.ts` */
export const FRONTS_PATH = '/api/fronts' as const;

export function defaultFrontsResponse(): FrontOption[] {
  return [];
}
