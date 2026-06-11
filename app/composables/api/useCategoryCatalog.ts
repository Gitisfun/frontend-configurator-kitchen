import { computed, type Ref } from 'vue';
import {
  defaultCategoryCatalogResponse,
  fetchCategoryCatalog,
  type CategoryCatalogResponse,
} from '../../api/categoryCatalog';

export type { CategoryCatalogResponse, CategoryCatalogItem } from '../../api/categoryCatalog';

export function useCategoryCatalog(categoryDocumentId: Ref<string>, parentSubcategoryDocumentId: Ref<string>) {
  const { data, pending, error, refresh } = useAsyncData(
    () =>
      `category-catalog-${categoryDocumentId.value.trim() || 'none'}-${parentSubcategoryDocumentId.value.trim() || 'root'}`,
    () => {
      const c = categoryDocumentId.value.trim();
      if (!c) return Promise.resolve(defaultCategoryCatalogResponse());
      return fetchCategoryCatalog(c, parentSubcategoryDocumentId.value);
    },
    {
      watch: [categoryDocumentId, parentSubcategoryDocumentId],
    },
  );

  const catalog = computed(() => data.value ?? defaultCategoryCatalogResponse());

  /** Subcategories first, then catalog products, then cabinet series (same order as the subcategories step UI). */
  const catalogItems = computed(() => [...catalog.value.subcategories, ...catalog.value.products, ...catalog.value.series]);

  return { catalog, catalogItems, pending, error, refresh };
}
