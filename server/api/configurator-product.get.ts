import type { ConfiguratorProduct } from '../../app/constants/dummy';
import { ProductBuilder, type StrapiCabinetSerieRow, type StrapiCabinetType } from '../utils/ProductBuilder';

interface StrapiProductData {
  documentId: string;
  name: string;
  description?: string | null;
  image?: unknown;
  cabinetTypes?: StrapiCabinetType[];
}

interface StrapiProductResponse {
  data: StrapiProductData;
}

interface StrapiCabinetSeriesListResponse {
  data: StrapiCabinetSerieRow[];
}

interface StrapiRuntimeConfig {
  strapiUrl: string;
  strapiToken: string;
}

async function loadConfiguratorProductBySeries(config: StrapiRuntimeConfig, seriesId: string): Promise<ConfiguratorProduct> {
  const response = await $fetch<StrapiCabinetSeriesListResponse>(`${config.strapiUrl}/api/cabinet-series`, {
    headers: { Authorization: `Bearer ${config.strapiToken}` },
    query: {
      'filters[documentId][$eq]': seriesId,
      'pagination[pageSize]': 1,
    },
  });

  const row = response.data[0];
  if (!row) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Cabinet series not found.',
    });
  }

  return ProductBuilder.mapSerieToConfiguratorProduct(row);
}

async function loadConfiguratorProductByProductId(config: StrapiRuntimeConfig, productId: string): Promise<ConfiguratorProduct> {
  const res = await $fetch<StrapiProductResponse>(`${config.strapiUrl}/api/products/${encodeURIComponent(productId)}`, {
    headers: { Authorization: `Bearer ${config.strapiToken}` },
    query: {
      'populate[image]': 'true',
      'populate[cabinetTypes][populate][variants]': 'true',
      'populate[cabinetTypes][populate][depthOptions]': 'true',
      'populate[cabinetTypes][populate][cabinetSeries]': 'true',
    },
  });

  const row = res.data;
  if (!row?.documentId) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found.' });
  }

  const types: StrapiCabinetType[] = Array.isArray(row.cabinetTypes) ? row.cabinetTypes : [];
  const widthOpts = ProductBuilder.buildWidthOptions(types);
  const heightOpts = ProductBuilder.buildHeightOptions(types);
  const depthOpts = ProductBuilder.buildDepthOptions(types);
  const hasLeftRight = ProductBuilder.hasLeftRight(types);
  const bullets = ProductBuilder.parseDescriptionBullets(row.description ?? null);

  return {
    id: row.documentId,
    title: row.name,
    image: extractStrapiImageUrl(row.image, config.strapiUrl) ?? '',
    dimensions: {
      width: widthOpts.length > 0 ? widthOpts : [{ value: '0', label: 'Niet beschikbaar' }],
      height: heightOpts.length > 0 ? heightOpts : [{ value: '0', label: 'Niet beschikbaar' }],
      depth: depthOpts.length > 0 ? depthOpts : [{ value: '0', label: 'Niet beschikbaar' }],
      plinth: ProductBuilder.plinthOptions,
    },
    doorSwing: hasLeftRight ? { leftLabel: 'Deur links', rightLabel: 'Deur rechts', default: 'left' } : { leftLabel: '', rightLabel: '', default: 'left' },
    addOns: [],
    productInformation: bullets,
    basePrice: 0,
  };
}

export default defineEventHandler(async (event): Promise<ConfiguratorProduct> => {
  const query = getQuery(event);
  const productId = typeof query.product === 'string' ? query.product.trim() : '';
  const seriesId = typeof query.series === 'string' ? query.series.trim() : '';

  if (!productId && !seriesId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Query parameter "product" or "series" (document id) is required.',
    });
  }

  if (productId && seriesId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Provide either "product" or "series", not both.',
    });
  }

  const config = useRuntimeConfig(event);

  try {
    if (seriesId) {
      return await loadConfiguratorProductBySeries(config, seriesId);
    }
    return await loadConfiguratorProductByProductId(config, productId);
  } catch (err: unknown) {
    const statusCode = err && typeof err === 'object' && 'statusCode' in err ? Number((err as { statusCode: number }).statusCode) : NaN;
    if (Number.isFinite(statusCode) && statusCode >= 400 && statusCode < 600) {
      throw err;
    }
    throw createError({
      statusCode: 502,
      statusMessage: 'Could not load configurator product.',
    });
  }
});
