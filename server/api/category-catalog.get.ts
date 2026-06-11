import type { CategoryCatalogItem, CategoryCatalogResponse } from '../../app/models/categoryCatalog';

interface StrapiSubcategory {
  documentId: string;
  name: string;
  image?: unknown;
}

interface StrapiSubcategoriesResponse {
  data: StrapiSubcategory[];
}

interface StrapiCabinetSerie {
  documentId: string;
  name: string;
}

interface StrapiCabinetSeriesResponse {
  data: StrapiCabinetSerie[];
}

interface StrapiProduct {
  documentId: string;
  name: string;
  image?: unknown;
}

interface StrapiProductsResponse {
  data: StrapiProduct[];
}

function mapSub(row: StrapiSubcategory, strapiUrl: string): CategoryCatalogItem {
  return {
    id: row.documentId,
    title: row.name,
    image: extractStrapiImageUrl(row.image, strapiUrl),
    kind: 'subcategory',
  };
}

function mapSeries(row: StrapiCabinetSerie): CategoryCatalogItem {
  return {
    id: row.documentId,
    title: row.name,
    image: null,
    kind: 'cabinet-series',
  };
}

function mapProduct(row: StrapiProduct, strapiUrl: string): CategoryCatalogItem {
  return {
    id: row.documentId,
    title: row.name,
    image: extractStrapiImageUrl(row.image, strapiUrl),
    kind: 'product',
  };
}

function mergeUniqueSeries(parts: StrapiCabinetSerie[][]): CategoryCatalogItem[] {
  const seen = new Set<string>();
  const merged: StrapiCabinetSerie[] = [];
  for (const part of parts) {
    for (const row of part) {
      if (seen.has(row.documentId)) continue;
      seen.add(row.documentId);
      merged.push(row);
    }
  }
  merged.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  return merged.map((row) => mapSeries(row));
}

async function fetchStrapiProducts(
  strapiUrl: string,
  strapiToken: string,
  query: Record<string, string | number | boolean>,
): Promise<StrapiProduct[]> {
  try {
    const res = await $fetch<StrapiProductsResponse>(`${strapiUrl}/api/products`, {
      headers: { Authorization: `Bearer ${strapiToken}` },
      query,
    });
    return res.data ?? [];
  } catch {
    return [];
  }
}

export default defineEventHandler(async (event): Promise<CategoryCatalogResponse> => {
  const query = getQuery(event);
  const categoryId = typeof query.category === 'string' ? query.category.trim() : '';
  const parentSubcategoryId =
    typeof query.parentSubcategory === 'string' ? query.parentSubcategory.trim() : '';

  if (!categoryId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Query parameter "category" (category document id) is required.',
    });
  }

  const config = useRuntimeConfig(event);
  const { strapiUrl, strapiToken } = config;

  if (parentSubcategoryId) {
    const [subsRes, seriesRes, productsRaw] = await Promise.all([
      $fetch<StrapiSubcategoriesResponse>(`${strapiUrl}/api/subcategories`, {
        headers: { Authorization: `Bearer ${strapiToken}` },
        query: {
          'pagination[pageSize]': 200,
          'populate[image]': 'true',
          'filters[category][documentId][$eq]': categoryId,
          'filters[parent][documentId][$eq]': parentSubcategoryId,
          sort: 'name:asc',
        },
      }),
      $fetch<StrapiCabinetSeriesResponse>(`${strapiUrl}/api/cabinet-series`, {
        headers: { Authorization: `Bearer ${strapiToken}` },
        query: {
          'pagination[pageSize]': 200,
          'filters[subcategory][documentId][$eq]': parentSubcategoryId,
          sort: 'name:asc',
        },
      }),
      fetchStrapiProducts(strapiUrl, strapiToken, {
        'pagination[pageSize]': 200,
        'populate[image]': 'true',
        'filters[subcategory][documentId][$eq]': parentSubcategoryId,
        sort: 'name:asc',
      }),
    ]);

    return {
      subcategories: subsRes.data.map((row) => mapSub(row, strapiUrl)),
      products: productsRaw.map((row) => mapProduct(row, strapiUrl)),
      series: seriesRes.data.map((row) => mapSeries(row)),
    };
  }

  /** Root of category tree: top-level subcategories (no parent) + series for this level. */
  const [subsRes, seriesDirectRes, productsRaw] = await Promise.all([
    $fetch<StrapiSubcategoriesResponse>(`${strapiUrl}/api/subcategories`, {
      headers: { Authorization: `Bearer ${strapiToken}` },
      query: {
        'pagination[pageSize]': 200,
        'populate[image]': 'true',
        'filters[category][documentId][$eq]': categoryId,
        'filters[parent][$null]': true,
        sort: 'name:asc',
      },
    }),
    $fetch<StrapiCabinetSeriesResponse>(`${strapiUrl}/api/cabinet-series`, {
      headers: { Authorization: `Bearer ${strapiToken}` },
      query: {
        'pagination[pageSize]': 200,
        'filters[category][documentId][$eq]': categoryId,
        sort: 'name:asc',
      },
    }),
    fetchStrapiProducts(strapiUrl, strapiToken, {
      'pagination[pageSize]': 200,
      'populate[image]': 'true',
      'filters[category][documentId][$eq]': categoryId,
      'filters[subcategory][$null]': true,
      sort: 'name:asc',
    }),
  ]);

  let seriesUnderTopLevelSubs: StrapiCabinetSerie[] = [];
  try {
    const nested = await $fetch<StrapiCabinetSeriesResponse>(`${strapiUrl}/api/cabinet-series`, {
      headers: { Authorization: `Bearer ${strapiToken}` },
      query: {
        'pagination[pageSize]': 200,
        'filters[$and][0][subcategory][category][documentId][$eq]': categoryId,
        'filters[$and][1][subcategory][parent][$null]': true,
        sort: 'name:asc',
      },
    });
    seriesUnderTopLevelSubs = nested.data;
  } catch {
    seriesUnderTopLevelSubs = [];
  }

  const series = mergeUniqueSeries([seriesDirectRes.data, seriesUnderTopLevelSubs]);

  return {
    subcategories: subsRes.data.map((row) => mapSub(row, strapiUrl)),
    products: productsRaw.map((row) => mapProduct(row, strapiUrl)),
    series,
  };
});
