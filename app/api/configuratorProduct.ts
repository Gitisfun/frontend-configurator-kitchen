import type { ConfiguratorProduct } from '../constants/dummy';

export type { ConfiguratorProduct };

export const CONFIGURATOR_PRODUCT_PATH = '/api/configurator-product' as const;

export function fetchConfiguratorProductByProductId(productId: string): Promise<ConfiguratorProduct> {
  return $fetch<ConfiguratorProduct>(CONFIGURATOR_PRODUCT_PATH, {
    query: { product: productId.trim() },
  });
}

export function fetchConfiguratorProductBySeriesId(seriesId: string): Promise<ConfiguratorProduct> {
  return $fetch<ConfiguratorProduct>(CONFIGURATOR_PRODUCT_PATH, {
    query: { series: seriesId.trim() },
  });
}
