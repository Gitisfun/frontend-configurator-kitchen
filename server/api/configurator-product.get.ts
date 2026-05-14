import type { ConfiguratorProduct, ProductDimensionOption } from '../../app/constants/dummy';

interface StrapiCabinetSerieRow {
  documentId: string;
  name: string;
  carcaseHeight?: number | null;
  defaultCarcaseDepth?: number | null;
  productLine?: string | null;
  image?: unknown;
}

interface StrapiCabinetSeriesResponse {
  data: StrapiCabinetSerieRow[];
}

function extractDisplayImageUrl(image: unknown, strapiBase: string): string | null {
  if (image == null) return null;
  const base = strapiBase.replace(/\/$/, '');

  function toFullUrl(path: string | undefined | null): string | null {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${base}${path.startsWith('/') ? path : `/${path}`}`;
  }

  if (typeof image === 'object' && !Array.isArray(image) && 'url' in (image as object)) {
    const flat = image as {
      url?: string;
      formats?: { large?: { url?: string }; medium?: { url?: string } };
    };
    const u = toFullUrl(flat.formats?.large?.url ?? flat.formats?.medium?.url ?? flat.url);
    if (u) return u;
    return extractStrapiImageUrl(image, strapiBase);
  }

  const wrapped = image as {
    data?: { attributes?: { url?: string; formats?: { large?: { url?: string }; medium?: { url?: string } } } } | null;
  };
  const attrs = wrapped.data?.attributes;
  if (!attrs) return extractStrapiImageUrl(image, strapiBase);
  const fromFormats = toFullUrl(attrs.formats?.large?.url ?? attrs.formats?.medium?.url ?? attrs.url);
  if (fromFormats) return fromFormats;

  return extractStrapiImageUrl(image, strapiBase);
}

function mapSerieToConfiguratorProduct(row: StrapiCabinetSerieRow, strapiUrl: string): ConfiguratorProduct {
  const h = row.carcaseHeight;
  const d = row.defaultCarcaseDepth;

  const heightOpts: ProductDimensionOption[] =
    h != null && Number.isFinite(h)
      ? [{ value: String(h), label: `${h} cm hoog` }]
      : [{ value: '72', label: '72 cm hoog' }];

  const depthOpts: ProductDimensionOption[] =
    d != null && Number.isFinite(d)
      ? [{ value: String(d), label: `${d} cm diep` }]
      : [{ value: '60', label: '60 cm diep' }];

  const widthOpts: ProductDimensionOption[] = [
    { value: '60', label: '60 cm breed' },
    { value: '80', label: '80 cm breed' },
    { value: '100', label: '100 cm breed' },
  ];

  const displayUrl = extractDisplayImageUrl(row.image, strapiUrl);
  const fallback = '/svg/base-60.svg';

  const info: string[] = [];
  if (row.productLine) info.push(`Productlijn: ${row.productLine}`);
  if (info.length === 0) info.push('Configureer het formaat en opties hieronder.');

  return {
    id: row.documentId,
    title: row.name,
    image: displayUrl ?? fallback,
    thumb: extractStrapiImageUrl(row.image, strapiUrl) ?? displayUrl ?? fallback,
    dimensions: {
      width: widthOpts,
      height: heightOpts,
      depth: depthOpts,
      plinth: [
        { value: '12.5', label: '12.5 cm hoge plint' },
        { value: '15', label: '15 cm hoge plint' },
      ],
    },
    doorSwing: { leftLabel: 'Deur links', rightLabel: 'Deur rechts', default: 'left' },
    addOns: [],
    productInformation: info,
    basePrice: 0,
  };
}

export default defineEventHandler(async (event): Promise<ConfiguratorProduct> => {
  const query = getQuery(event);
  const seriesId = typeof query.series === 'string' ? query.series.trim() : '';

  if (!seriesId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Query parameter "series" (cabinet series document id) is required.',
    });
  }

  const config = useRuntimeConfig(event);

  const response = await $fetch<StrapiCabinetSeriesResponse>(`${config.strapiUrl}/api/cabinet-series`, {
    headers: { Authorization: `Bearer ${config.strapiToken}` },
    query: {
      'filters[documentId][$eq]': seriesId,
      'populate[image]': 'true',
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

  return mapSerieToConfiguratorProduct(row, config.strapiUrl);
});
