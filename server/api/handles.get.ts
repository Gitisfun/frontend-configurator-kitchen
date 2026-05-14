import type { HandleOption } from '../../app/models/handle';

interface StrapiHandle {
  documentId: string;
  name: string;
  image?: unknown;
}

interface StrapiHandlesResponse {
  data: StrapiHandle[];
}

export default defineEventHandler(async (event): Promise<HandleOption[]> => {
  const config = useRuntimeConfig(event);

  const response = await $fetch<StrapiHandlesResponse>(`${config.strapiUrl}/api/handles`, {
    headers: { Authorization: `Bearer ${config.strapiToken}` },
    query: {
      'pagination[pageSize]': 200,
      'populate[image]': 'true',
    },
  });

  return response.data.map((handle): HandleOption => ({
    id: handle.documentId,
    title: handle.name,
    image: extractStrapiImageUrl(handle.image, config.strapiUrl),
  }));
});
