import { computed } from 'vue';
import type { Category } from '../../api/categories';
import { CATEGORIES_PATH, defaultCategoriesResponse } from '../../api/categories';

export type { Category } from '../../api/categories';

export function useCategories() {
  const { data, pending, error, refresh } = useFetch<Category[]>(CATEGORIES_PATH, {
    key: 'categories',
    default: defaultCategoriesResponse,
  });

  const categories = computed(() => data.value ?? []);

  return { categories, pending, error, refresh };
}
