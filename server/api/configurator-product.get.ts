import type { ConfiguratorProduct, ProductDimensionOption } from '../../app/constants/dummy';

interface StrapiVariant {
  width: number;
  height?: number | null;
  isVariableWidth?: boolean;
}

interface StrapiDepthOption {
  depth: number;
  isDefault?: boolean;
}

interface StrapiCabinetSeries {
  carcaseHeight?: number | null;
}

interface StrapiCabinetType {
  documentId: string;
  hasLeftRight?: boolean;
  variants?: StrapiVariant[];
  depthOptions?: StrapiDepthOption[];
  cabinetSeries?: StrapiCabinetSeries | null;
}

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

/** Values in Strapi are stored in mm; convert to cm for display labels. */
function mmToCm(mm: number): number {
  return mm / 10;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseDescriptionBullets(html: string | null | undefined): string[] {
  if (!html || !html.trim()) return [];
  const liMatches = [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
  if (liMatches.length > 0) {
    return liMatches.map((m) => stripHtml(m[1] ?? '')).filter(Boolean);
  }
  const pParts = html.split(/<\/?p[^>]*>/i).map(stripHtml).filter(Boolean);
  if (pParts.length > 0) return pParts;
  const plain = stripHtml(html);
  return plain ? [plain] : [];
}

function buildWidthOptions(types: StrapiCabinetType[]): ProductDimensionOption[] {
  const widths = new Set<number>();
  for (const ct of types) {
    for (const v of ct.variants ?? []) {
      if (!v.isVariableWidth && typeof v.width === 'number' && v.width > 0) {
        widths.add(v.width);
      }
    }
  }
  return [...widths]
    .sort((a, b) => a - b)
    .map((w) => ({ value: String(w), label: `${mmToCm(w)} cm breed` }));
}

function buildHeightOptions(types: StrapiCabinetType[]): ProductDimensionOption[] {
  const heights = new Set<number>();
  for (const ct of types) {
    const seriesH = ct.cabinetSeries?.carcaseHeight;
    if (typeof seriesH === 'number' && seriesH > 0) {
      heights.add(seriesH);
    } else {
      for (const v of ct.variants ?? []) {
        if (typeof v.height === 'number' && v.height > 0) heights.add(v.height);
      }
    }
  }
  return [...heights]
    .sort((a, b) => a - b)
    .map((h) => ({ value: String(h), label: `${mmToCm(h)} cm hoog` }));
}

function buildDepthOptions(types: StrapiCabinetType[]): ProductDimensionOption[] {
  const depths = new Map<number, boolean>();
  for (const ct of types) {
    for (const d of ct.depthOptions ?? []) {
      if (typeof d.depth === 'number' && d.depth > 0) {
        depths.set(d.depth, depths.get(d.depth) || !!d.isDefault);
      }
    }
  }
  return [...depths.entries()]
    .sort((a, b) => {
      if (a[1] !== b[1]) return a[1] ? -1 : 1;
      return a[0] - b[0];
    })
    .map(([d]) => ({ value: String(d), label: `${mmToCm(d)} cm diep` }));
}

const PLINTH_OPTIONS: ProductDimensionOption[] = [
  { value: '125', label: '12.5 cm hoge plint' },
  { value: '150', label: '15 cm hoge plint' },
];

interface StrapiCabinetSerieRow {
  documentId: string;
  name: string;
  carcaseHeight?: number | null;
  defaultCarcaseDepth?: number | null;
  productLine?: string | null;
}

interface StrapiCabinetSeriesListResponse {
  data: StrapiCabinetSerieRow[];
}

function mapSerieToConfiguratorProduct(row: StrapiCabinetSerieRow): ConfiguratorProduct {
  const h = row.carcaseHeight;
  const d = row.defaultCarcaseDepth;

  const heightOpts: ProductDimensionOption[] =
    h != null && Number.isFinite(h)
      ? [{ value: String(h), label: `${mmToCm(h)} cm hoog` }]
      : [{ value: '720', label: '72 cm hoog' }];

  const depthOpts: ProductDimensionOption[] =
    d != null && Number.isFinite(d)
      ? [{ value: String(d), label: `${mmToCm(d)} cm diep` }]
      : [{ value: '600', label: '60 cm diep' }];

  const widthOpts: ProductDimensionOption[] = [
    { value: '600', label: '60 cm breed' },
    { value: '800', label: '80 cm breed' },
    { value: '1000', label: '100 cm breed' },
  ];

  const fallback = '/svg/base-60.svg';

  const info: string[] = [];
  if (row.productLine) info.push(`Productlijn: ${row.productLine}`);
  if (info.length === 0) info.push('Configureer het formaat en opties hieronder.');

  return {
    id: row.documentId,
    title: row.name,
    image: fallback,
    thumb: fallback,
    dimensions: {
      width: widthOpts,
      height: heightOpts,
      depth: depthOpts,
      plinth: PLINTH_OPTIONS,
    },
    doorSwing: { leftLabel: 'Deur links', rightLabel: 'Deur rechts', default: 'left' },
    addOns: [],
    productInformation: info,
    basePrice: 0,
  };
}

interface StrapiRuntimeConfig {
  strapiUrl: string;
  strapiToken: string;
}

async function loadConfiguratorProductBySeries(
  config: StrapiRuntimeConfig,
  seriesId: string,
): Promise<ConfiguratorProduct> {
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

  return mapSerieToConfiguratorProduct(row);
}

async function loadConfiguratorProductByProductId(
  config: StrapiRuntimeConfig,
  productId: string,
): Promise<ConfiguratorProduct> {
  const res = await $fetch<StrapiProductResponse>(
    `${config.strapiUrl}/api/products/${encodeURIComponent(productId)}`,
    {
      headers: { Authorization: `Bearer ${config.strapiToken}` },
      query: {
        'populate[image]': 'true',
        'populate[cabinetTypes][populate][variants]': 'true',
        'populate[cabinetTypes][populate][depthOptions]': 'true',
        'populate[cabinetTypes][populate][cabinetSeries]': 'true',
      },
    },
  );

  const row = res.data;
  if (!row?.documentId) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found.' });
  }

  const types: StrapiCabinetType[] = Array.isArray(row.cabinetTypes) ? row.cabinetTypes : [];
  const widthOpts = buildWidthOptions(types);
  const heightOpts = buildHeightOptions(types);
  const depthOpts = buildDepthOptions(types);
  const hasLeftRight = types.some((ct) => !!ct.hasLeftRight);
  const bullets = parseDescriptionBullets(row.description ?? null);

  return {
    id: row.documentId,
    title: row.name,
    image: extractStrapiImageUrl(row.image, config.strapiUrl) ?? '',
    dimensions: {
      width: widthOpts.length > 0 ? widthOpts : [{ value: '0', label: 'Niet beschikbaar' }],
      height: heightOpts.length > 0 ? heightOpts : [{ value: '0', label: 'Niet beschikbaar' }],
      depth: depthOpts.length > 0 ? depthOpts : [{ value: '0', label: 'Niet beschikbaar' }],
      plinth: PLINTH_OPTIONS,
    },
    doorSwing: hasLeftRight
      ? { leftLabel: 'Deur links', rightLabel: 'Deur rechts', default: 'left' }
      : { leftLabel: '', rightLabel: '', default: 'left' },
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
    const statusCode =
      err && typeof err === 'object' && 'statusCode' in err
        ? Number((err as { statusCode: number }).statusCode)
        : NaN;
    if (Number.isFinite(statusCode) && statusCode >= 400 && statusCode < 600) {
      throw err;
    }
    throw createError({
      statusCode: 502,
      statusMessage: 'Could not load configurator product.',
    });
  }
});
