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
  image?: unknown;
}

interface StrapiCabinetSeriesResponse {
  data: StrapiCabinetSerie[];
}

function mapSub(row: StrapiSubcategory, strapiUrl: string): CategoryCatalogItem {
  return {
    id: row.documentId,
    title: row.name,
    image: extractStrapiImageUrl(row.image, strapiUrl),
    kind: 'subcategory',
  };
}

function mapSeries(row: StrapiCabinetSerie, strapiUrl: string): CategoryCatalogItem {
  return {
    id: row.documentId,
    title: row.name,
    image: extractStrapiImageUrl(row.image, strapiUrl),
    kind: 'cabinet-series',
  };
}

function mergeUniqueSeries(
  parts: StrapiCabinetSerie[][],
  strapiUrl: string,
): CategoryCatalogItem[] {
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
  return merged.map((row) => mapSeries(row, strapiUrl));
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

  if (parentSubcategoryId) {
    const subsRes = await $fetch<StrapiSubcategoriesResponse>(`${config.strapiUrl}/api/subcategories`, {
      headers: { Authorization: `Bearer ${config.strapiToken}` },
      query: {
        'pagination[pageSize]': 200,
        'populate[image]': 'true',
        'filters[category][documentId][$eq]': categoryId,
        'filters[parent][documentId][$eq]': parentSubcategoryId,
        sort: 'name:asc',
      },
    });

    const seriesRes = await $fetch<StrapiCabinetSeriesResponse>(`${config.strapiUrl}/api/cabinet-series`, {
      headers: { Authorization: `Bearer ${config.strapiToken}` },
      query: {
        'pagination[pageSize]': 200,
        'populate[image]': 'true',
        'filters[subcategory][documentId][$eq]': parentSubcategoryId,
        sort: 'name:asc',
      },
    });

    return {
      subcategories: subsRes.data.map((row) => mapSub(row, config.strapiUrl)),
      series: seriesRes.data.map((row) => mapSeries(row, config.strapiUrl)),
    };
  }

  /** Root of category tree: top-level subcategories (no parent) + series for this level. */
  const subsRes = await $fetch<StrapiSubcategoriesResponse>(`${config.strapiUrl}/api/subcategories`, {
    headers: { Authorization: `Bearer ${config.strapiToken}` },
    query: {
      'pagination[pageSize]': 200,
      'populate[image]': 'true',
      'filters[category][documentId][$eq]': categoryId,
      'filters[parent][$null]': true,
      sort: 'name:asc',
    },
  });

  const seriesDirectRes = await $fetch<StrapiCabinetSeriesResponse>(`${config.strapiUrl}/api/cabinet-series`, {
    headers: { Authorization: `Bearer ${config.strapiToken}` },
    query: {
      'pagination[pageSize]': 200,
      'populate[image]': 'true',
      'filters[category][documentId][$eq]': categoryId,
      sort: 'name:asc',
    },
  });

  let seriesUnderTopLevelSubs: StrapiCabinetSerie[] = [];
  try {
    const nested = await $fetch<StrapiCabinetSeriesResponse>(`${config.strapiUrl}/api/cabinet-series`, {
      headers: { Authorization: `Bearer ${config.strapiToken}` },
      query: {
        'pagination[pageSize]': 200,
        'populate[image]': 'true',
        'filters[$and][0][subcategory][category][documentId][$eq]': categoryId,
        'filters[$and][1][subcategory][parent][$null]': true,
        sort: 'name:asc',
      },
    });
    seriesUnderTopLevelSubs = nested.data;
  } catch {
    seriesUnderTopLevelSubs = [];
  }

  const series = mergeUniqueSeries([seriesDirectRes.data, seriesUnderTopLevelSubs], config.strapiUrl);

  return {
    subcategories: subsRes.data.map((row) => mapSub(row, config.strapiUrl)),
    series,
  };
});
