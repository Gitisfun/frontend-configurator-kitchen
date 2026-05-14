/**
 * Shapes returned by `/api/category-catalog` for the subcategories step.
 */
export type CategoryCatalogKind = 'subcategory' | 'cabinet-series';

export interface CategoryCatalogItem {
  id: string;
  title: string;
  image: string | null;
  kind: CategoryCatalogKind;
}

export interface CategoryCatalogResponse {
  subcategories: CategoryCatalogItem[];
  series: CategoryCatalogItem[];
}
