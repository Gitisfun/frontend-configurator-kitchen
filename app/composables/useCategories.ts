import { CATEGORIES_PATH, defaultCategoriesResponse, type Category } from '../services/categories';

export type { Category };

export function useCategories() {
  const { data, pending, error, refresh } = useFetch<Category[]>(CATEGORIES_PATH, {
    key: 'categories',
    default: defaultCategoriesResponse,
  });

  const categories = computed(() => data.value ?? []);

  return { categories, pending, error, refresh };
}
