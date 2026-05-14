import type { BackOption } from '../../app/models/back';

interface StrapiBack {
  documentId: string;
  name: string;
  image?: unknown;
}

interface StrapiBacksResponse {
  data: StrapiBack[];
}

export default defineEventHandler(async (event): Promise<BackOption[]> => {
  const config = useRuntimeConfig(event);

  const response = await $fetch<StrapiBacksResponse>(`${config.strapiUrl}/api/backs`, {
    headers: { Authorization: `Bearer ${config.strapiToken}` },
    query: {
      'pagination[pageSize]': 200,
      'populate[image]': 'true',
    },
  });

  return response.data.map((back): BackOption => ({
    id: back.documentId,
    title: back.name,
    image: extractStrapiImageUrl(back.image, config.strapiUrl),
  }));
});
