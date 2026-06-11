import type { CatalogProductDetail } from '../models/catalogProductDetail';

export type { CatalogProductDetail } from '../models/catalogProductDetail';

export const CATALOG_PRODUCT_PATH = '/api/catalog-product' as const;

export function fetchCatalogProduct(documentId: string): Promise<CatalogProductDetail> {
  return $fetch<CatalogProductDetail>(CATALOG_PRODUCT_PATH, {
    query: { documentId: documentId.trim() },
  });
}
