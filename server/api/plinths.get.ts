import type { PlinthOption } from '../../app/models/plinth';

interface StrapiPlinth {
  documentId: string;
  name: string;
  price?: number | string | null;
  image?: unknown;
}

interface StrapiPlinthsResponse {
  data: StrapiPlinth[];
}

function formatPlinthPrice(price: number | string | null | undefined): string | null {
  if (price == null || price === '') return null;
  const n = typeof price === 'string' ? parseFloat(price) : price;
  if (!Number.isFinite(n)) return null;
  return `Bedrag per 10cm: ${n.toFixed(2).replace('.', ',')}`;
}

export default defineEventHandler(async (event): Promise<PlinthOption[]> => {
  const config = useRuntimeConfig(event);

  const response = await $fetch<StrapiPlinthsResponse>(`${config.strapiUrl}/api/plinths`, {
    headers: { Authorization: `Bearer ${config.strapiToken}` },
    query: {
      'pagination[pageSize]': 200,
      'populate[image]': 'true',
    },
  });

  return response.data.map((plinth): PlinthOption => ({
    id: plinth.documentId,
    title: plinth.name,
    image: extractStrapiImageUrl(plinth.image, config.strapiUrl),
    description: formatPlinthPrice(plinth.price),
  }));
});
