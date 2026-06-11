import { computed, type Ref } from 'vue';
import { fetchCatalogProduct, type CatalogProductDetail } from '../../api/catalogProduct';

export type { CatalogProductDetail } from '../../api/catalogProduct';

export function useCatalogProduct(productDocumentId: Ref<string>) {
  const { data, pending, error, refresh } = useAsyncData(
    () => `catalog-product-${productDocumentId.value.trim() || 'none'}`,
    () => {
      const id = productDocumentId.value.trim();
      if (!id) return Promise.resolve(null);
      return fetchCatalogProduct(id);
    },
    { watch: [productDocumentId] },
  );

  const detail = computed(() => data.value ?? null);

  return { detail, pending, error, refresh };
}
