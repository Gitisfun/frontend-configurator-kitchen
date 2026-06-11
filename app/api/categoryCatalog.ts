import type { CategoryCatalogResponse } from '../models/categoryCatalog';

export type { CategoryCatalogItem, CategoryCatalogResponse, CategoryCatalogKind } from '../models/categoryCatalog';

export const CATEGORY_CATALOG_PATH = '/api/category-catalog' as const;

export function defaultCategoryCatalogResponse(): CategoryCatalogResponse {
  return { subcategories: [], products: [], series: [] };
}

export function fetchCategoryCatalog(
  categoryDocumentId: string,
  parentSubcategoryDocumentId?: string,
): Promise<CategoryCatalogResponse> {
  const category = categoryDocumentId.trim();
  const parent = parentSubcategoryDocumentId?.trim() ?? '';
  return $fetch<CategoryCatalogResponse>(CATEGORY_CATALOG_PATH, {
    query: {
      category,
      ...(parent ? { parentSubcategory: parent } : {}),
    },
  });
}
