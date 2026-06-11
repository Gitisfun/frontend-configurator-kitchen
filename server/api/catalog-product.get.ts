import type { CatalogProductDetail } from '../../app/models/catalogProductDetail';

interface StrapiProductData {
  documentId: string;
  name: string;
  description?: string | null;
  image?: unknown;
}

interface StrapiProductResponse {
  data: StrapiProductData;
}

function stripHtmlToPlain(html: string | null | undefined): string | null {
  if (html == null || typeof html !== 'string') return null;
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length ? text : null;
}

export default defineEventHandler(async (event): Promise<CatalogProductDetail> => {
  const query = getQuery(event);
  const documentId = typeof query.documentId === 'string' ? query.documentId.trim() : '';

  if (!documentId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Query parameter "documentId" (product document id) is required.',
    });
  }

  const config = useRuntimeConfig(event);

  try {
    const res = await $fetch<StrapiProductResponse>(
      `${config.strapiUrl}/api/products/${encodeURIComponent(documentId)}`,
      {
        headers: { Authorization: `Bearer ${config.strapiToken}` },
        query: {
          'populate[image]': 'true',
        },
      },
    );

    const row = res.data;
    if (!row?.documentId) {
      throw createError({ statusCode: 404, statusMessage: 'Product not found.' });
    }

    return {
      documentId: row.documentId,
      title: row.name,
      image: extractStrapiImageUrl(row.image, config.strapiUrl),
      descriptionText: stripHtmlToPlain(row.description ?? null),
    };
  } catch (err: unknown) {
    const status =
      err && typeof err === 'object' && 'statusCode' in err ? Number((err as { statusCode: number }).statusCode) : 502;
    if (status === 404) {
      throw createError({ statusCode: 404, statusMessage: 'Product not found.' });
    }
    throw createError({
      statusCode: status >= 400 && status < 600 ? status : 502,
      statusMessage: 'Could not load product.',
    });
  }
});
