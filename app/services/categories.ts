import type { Category } from '../models/categories';

export type { Category } from '../models/categories';

export const CATEGORIES_PATH = '/api/categories' as const;

export function defaultCategoriesResponse(): Category[] {
  return [];
}
