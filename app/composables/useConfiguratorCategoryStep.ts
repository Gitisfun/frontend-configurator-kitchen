import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { commaSeparatedRouteQueryParam, trimmedRouteQueryParam } from '../utils/routeQuery';
import type { CategoryCatalogItem } from '../api/categoryCatalog';
import { useCategories } from './api/useCategories';

/**
 * Shared route parsing and navigation for the configurator category / subcategory / catalog steps.
 */
export function useConfiguratorCategoryStep() {
  const route = useRoute();
  const router = useRouter();
  const { t } = useI18n();
  const { categories } = useCategories();

  const categoryDocumentId = computed(() => {
    const fromQuery = trimmedRouteQueryParam(route.query.category);
    if (fromQuery) return fromQuery;
    const type = trimmedRouteQueryParam(route.query.type);
    if (!type) return '';
    const match = categories.value.find((c) => (c.value.trim() || c.id) === type);
    return match?.id ?? '';
  });

  /** Nested subcategory drill-down: comma-separated Strapi document ids from root to current parent. */
  const subcategoryPathIds = computed(() => commaSeparatedRouteQueryParam(route.query.subcategoryPath));

  const typeQuery = computed(() => {
    const type = trimmedRouteQueryParam(route.query.type);
    if (type) return { type };
    return {};
  });

  /** Preserves `type` and resolved category document id for sibling steps (subcategories, product). */
  const stepQuery = computed(() => {
    const q: Record<string, string> = {};
    const type = trimmedRouteQueryParam(route.query.type);
    if (type) q.type = type;
    const cat = categoryDocumentId.value;
    if (cat) q.category = cat;
    return q;
  });

  const categoryTitle = computed(() => {
    const id = categoryDocumentId.value;
    if (id) {
      const cat = categories.value.find((c) => c.id === id);
      if (cat?.name) return cat.name;
    }
    const type = trimmedRouteQueryParam(route.query.type);
    const match = categories.value.find((c) => (c.value.trim() || c.id) === type);
    return match?.name ?? t('configurator.subcategories.defaultCategoryTitle');
  });

  /** Current catalog scope: children of the last id in the path; root when path is empty. */
  const parentSubcategoryDocumentId = computed(() => {
    const ids = subcategoryPathIds.value;
    return ids.length ? ids[ids.length - 1]! : '';
  });

  const subcategoriesRoute = computed(() => ({
    path: '/configurator/subcategories',
    query: {
      ...stepQuery.value,
      ...(subcategoryPathIds.value.length ? { subcategoryPath: subcategoryPathIds.value.join(',') } : {}),
    },
  }));

  function navigateOnCatalogItem(item: CategoryCatalogItem) {
    if (item.kind === 'subcategory') {
      const nextPath = [...subcategoryPathIds.value, item.id].join(',');
      router.push({
        path: '/configurator/subcategories',
        query: {
          ...stepQuery.value,
          subcategoryPath: nextPath,
        },
      });
      return;
    }

    const pathTail = subcategoryPathIds.value.length > 0 ? { subcategoryPath: subcategoryPathIds.value.join(',') } : {};

    if (item.kind === 'product') {
      router.push({
        path: '/configurator/product',
        query: {
          ...stepQuery.value,
          product: item.id,
          ...pathTail,
        },
      });
      return;
    }

    router.push({
      path: '/configurator/product',
      query: {
        ...stepQuery.value,
        series: item.id,
        ...pathTail,
      },
    });
  }

  function navigateBackFromSubcategories() {
    const ids = subcategoryPathIds.value;
    const step = stepQuery.value;

    if (ids.length > 1) {
      router.replace({
        path: '/configurator/subcategories',
        query: {
          ...step,
          subcategoryPath: ids.slice(0, -1).join(','),
        },
      });
      return;
    }

    if (ids.length === 1) {
      router.replace({
        path: '/configurator/subcategories',
        query: step,
      });
      return;
    }

    const type = trimmedRouteQueryParam(route.query.type);
    router.replace({
      path: '/configurator/type',
      query: type ? { type } : {},
    });
  }

  return {
    categoryDocumentId,
    subcategoryPathIds,
    parentSubcategoryDocumentId,
    typeQuery,
    stepQuery,
    subcategoriesRoute,
    categoryTitle,
    navigateOnCatalogItem,
    navigateBackFromSubcategories,
  };
}
