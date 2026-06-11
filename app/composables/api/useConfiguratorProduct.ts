import { computed, type Ref } from 'vue';
import {
  fetchConfiguratorProductByProductId,
  fetchConfiguratorProductBySeriesId,
  type ConfiguratorProduct,
} from '../../api/configuratorProduct';

export type { ConfiguratorProduct } from '../../api/configuratorProduct';

export function useConfiguratorProduct(productDocumentId: Ref<string>, seriesDocumentId: Ref<string>) {
  const { data, pending, error, refresh } = useAsyncData(
    () => `configurator-product-${productDocumentId.value.trim() || 'none'}-${seriesDocumentId.value.trim() || 'none'}`,
    () => {
      const productId = productDocumentId.value.trim();
      const seriesId = seriesDocumentId.value.trim();
      if (!productId && !seriesId) return Promise.resolve(null);
      if (seriesId) return fetchConfiguratorProductBySeriesId(seriesId);
      return fetchConfiguratorProductByProductId(productId);
    },
    { watch: [productDocumentId, seriesDocumentId] },
  );

  const product = computed(() => data.value ?? null);

  return { product, pending, error, refresh };
}
