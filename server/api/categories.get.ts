import type { Category } from '../../app/models/categories';

interface StrapiCategory {
  documentId: string;
  name: string;
  value?: string | null;
}

interface StrapiCategoriesResponse {
  data: StrapiCategory[];
}

export default defineEventHandler(async (event): Promise<Category[]> => {
  const config = useRuntimeConfig(event);

  const response = await $fetch<StrapiCategoriesResponse>(`${config.strapiUrl}/api/categories`, {
    headers: { Authorization: `Bearer ${config.strapiToken}` },
    query: {
      'pagination[pageSize]': 200,
      sort: 'name:asc',
    },
  });

  return response.data.map(
    (category): Category => ({
      id: category.documentId,
      name: category.name,
      value: category.value?.trim() ?? '',
    }),
  );
});
