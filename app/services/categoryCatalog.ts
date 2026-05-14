import type { CategoryCatalogResponse } from '../models/categoryCatalog';

export type { CategoryCatalogItem, CategoryCatalogResponse, CategoryCatalogKind } from '../models/categoryCatalog';

export const CATEGORY_CATALOG_PATH = '/api/category-catalog' as const;

export function defaultCategoryCatalogResponse(): CategoryCatalogResponse {
  return { subcategories: [], series: [] };
}
