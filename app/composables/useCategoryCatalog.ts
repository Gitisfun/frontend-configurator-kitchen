import { computed, type Ref } from 'vue';
import { CATEGORY_CATALOG_PATH, defaultCategoryCatalogResponse, type CategoryCatalogResponse } from '../services/categoryCatalog';

export type { CategoryCatalogResponse, CategoryCatalogItem } from '../services/categoryCatalog';

export function useCategoryCatalog(categoryDocumentId: Ref<string>, parentSubcategoryDocumentId: Ref<string>) {
  const { data, pending, error, refresh } = useAsyncData(
    () =>
      `category-catalog-${categoryDocumentId.value.trim() || 'none'}-${parentSubcategoryDocumentId.value.trim() || 'root'}`,
    () => {
      const c = categoryDocumentId.value.trim();
      if (!c) return Promise.resolve(defaultCategoryCatalogResponse());
      const p = parentSubcategoryDocumentId.value.trim();
      return $fetch<CategoryCatalogResponse>(CATEGORY_CATALOG_PATH, {
        query: {
          category: c,
          ...(p ? { parentSubcategory: p } : {}),
        },
      });
    },
    {
      watch: [categoryDocumentId, parentSubcategoryDocumentId],
    },
  );

  const catalog = computed(() => data.value ?? defaultCategoryCatalogResponse());

  return { catalog, pending, error, refresh };
}
