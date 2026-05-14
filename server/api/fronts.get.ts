import type { FrontOption } from '../../app/models/front';

interface StrapiFront {
  documentId: string;
  name: string;
  description?: string | null;
  image?: unknown;
  priceClass?: unknown;
}

interface StrapiFrontsResponse {
  data: StrapiFront[];
}

export default defineEventHandler(async (event): Promise<FrontOption[]> => {
  const config = useRuntimeConfig(event);

  const response = await $fetch<StrapiFrontsResponse>(`${config.strapiUrl}/api/fronts`, {
    headers: { Authorization: `Bearer ${config.strapiToken}` },
    query: {
      'pagination[pageSize]': 200,
      'populate[image]': 'true',
      'populate[priceClass]': 'true',
    },
  });

  return response.data.map((front): FrontOption => {
    const level = extractStrapiPriceClassLevel(front.priceClass);
    return {
      id: front.documentId,
      title: front.name,
      image: extractStrapiImageUrl(front.image, config.strapiUrl),
      priceClass: level !== null ? level + 1 : null,
      description: front.description ?? null,
    };
  });
});
