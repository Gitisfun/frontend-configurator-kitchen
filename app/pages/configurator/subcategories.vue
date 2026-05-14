<template>
  <div class="configurator-page configurator-subcategories-page">
    <NuxtLink :to="{ path: '/configurator/type', query: typeQuery }" class="configurator-subcategories-page__back-link"> terug naar kasten </NuxtLink>

    <section class="configurator-main">
      <div class="configurator-main__inner">
        <BaseHeader size="big" as="h1" align="left" color="primary" class="configurator-subcategories-page__title">
          {{ categoryTitle }}
        </BaseHeader>

        <p v-if="catalogError" class="configurator-subcategories-page__error">Kon subcategorieën en series niet laden. Probeer het opnieuw.</p>

        <template v-else-if="catalogPending">
          <ul class="configurator-subcategories-page__grid" role="list" aria-busy="true">
            <li v-for="n in 8" :key="n" class="configurator-subcategories-page__item configurator-subcategories-page__item--skeleton" aria-hidden="true" />
          </ul>
        </template>

        <template v-else-if="!hasAnyItems">
          <p class="configurator-subcategories-page__empty">Geen subcategorieën of series voor deze categorie.</p>
        </template>

        <template v-else>
          <ul class="configurator-subcategories-page__grid" role="list">
            <li v-for="item in catalogItems" :key="`${item.kind}-${item.id}`" class="configurator-subcategories-page__item">
              <ListItem :title="item.title" :image="item.image ?? '#e8e4df'" :selected="false" @click="onCatalogItemClick(item)" />
            </li>
          </ul>
        </template>
      </div>

      <div class="configurator-main__actions">
        <BaseButtons back-label="Terug" :show-next="false" @back="onBack" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCategories } from '../../composables/useCategories';
import { useCategoryCatalog, type CategoryCatalogItem } from '../../composables/useCategoryCatalog';

const route = useRoute();
const router = useRouter();

const { categories } = useCategories();

const categoryDocumentId = computed(() => {
  const q = route.query.category;
  if (typeof q === 'string' && q.trim()) return q.trim();
  const type = route.query.type as string | undefined;
  if (!type) return '';
  const match = categories.value.find((c) => (c.value.trim() || c.id) === type);
  return match?.id ?? '';
});

/** Nested subcategory drill-down: comma-separated Strapi document ids from root to current parent. */
const subcategoryPathIds = computed(() => {
  const q = route.query.subcategoryPath;
  if (typeof q !== 'string' || !q.trim()) return [];
  return q.split(',').map((s) => s.trim()).filter(Boolean);
});

/** Current catalog scope: children of the last id in the path; root when path is empty. */
const parentSubcategoryDocumentId = computed(() => {
  const ids = subcategoryPathIds.value;
  return ids.length ? ids[ids.length - 1]! : '';
});

const { catalog, pending: catalogPending, error: catalogError } = useCategoryCatalog(categoryDocumentId, parentSubcategoryDocumentId);

const typeQuery = computed(() => {
  const t = route.query.type;
  if (typeof t === 'string' && t) return { type: t };
  return {};
});

const categoryTitle = computed(() => {
  const id = categoryDocumentId.value;
  if (id) {
    const cat = categories.value.find((c) => c.id === id);
    if (cat?.name) return cat.name;
  }
  const type = route.query.type as string | undefined;
  const match = categories.value.find((c) => (c.value.trim() || c.id) === type);
  return match?.name ?? 'Kasten';
});

/** Subcategories first, then cabinet series (same order as before the single-list change). */
const catalogItems = computed(() => [...catalog.value.subcategories, ...catalog.value.series]);

const hasAnyItems = computed(() => catalogItems.value.length > 0);

function baseStepQuery(): Record<string, string> {
  const q: Record<string, string> = {};
  const type = route.query.type;
  if (typeof type === 'string') q.type = type;
  const cat = categoryDocumentId.value;
  if (cat) q.category = cat;
  return q;
}

function onCatalogItemClick(item: CategoryCatalogItem) {
  if (item.kind === 'subcategory') {
    const nextPath = [...subcategoryPathIds.value, item.id].join(',');
    router.push({
      path: '/configurator/subcategories',
      query: {
        ...baseStepQuery(),
        subcategoryPath: nextPath,
      },
    });
    return;
  }

  router.push({
    path: '/configurator/product',
    query: {
      ...baseStepQuery(),
      series: item.id,
      ...(subcategoryPathIds.value.length ? { subcategoryPath: subcategoryPathIds.value.join(',') } : {}),
    },
  });
}

function onBack() {
  const ids = subcategoryPathIds.value;
  const step = baseStepQuery();

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

  router.push({
    path: '/configurator/type',
    query: typeof route.query.type === 'string' && route.query.type ? { type: route.query.type } : {},
  });
}
</script>

<style scoped>
.configurator-page {
  position: relative;
  background-color: var(--color-surface);
  padding-top: calc(var(--navbar-height) + 1.5rem);
  padding-bottom: var(--intro-padding-y);
  padding-left: var(--intro-padding-x);
  padding-right: var(--intro-padding-x);
}

.configurator-main {
  padding: 0;
}

.configurator-main__inner {
  max-width: var(--intro-max-width);
  margin: 0 auto;
}

.configurator-subcategories-page__back-link {
  position: absolute;
  top: 0;
  right: var(--intro-padding-x);
  font-family: var(--font-sans);
  font-size: var(--paragraph-size-small);
  color: var(--color-text-primary);
  text-decoration: underline;
}

.configurator-subcategories-page__back-link:hover {
  color: var(--color-brand);
}

.configurator-subcategories-page__title {
  margin-bottom: 1.5rem;
}

.configurator-subcategories-page__error {
  margin: 0 0 1rem;
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--color-danger, #c0392b);
}

.configurator-subcategories-page__empty {
  margin: 0;
  font-family: var(--font-sans);
  font-size: var(--paragraph-size-medium);
  color: var(--color-text-muted);
}

.configurator-subcategories-page__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.configurator-subcategories-page__item {
  margin: 0;
  padding: 0;
}

.configurator-subcategories-page__item--skeleton {
  aspect-ratio: 3 / 4;
  border-radius: var(--picker-radius);
  background: linear-gradient(90deg, var(--color-surface-hover) 25%, var(--picker-border) 50%, var(--color-surface-hover) 75%);
  background-size: 200% 100%;
  animation: subcategories-shimmer 1.4s ease infinite;
}

@keyframes subcategories-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.configurator-main__actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--picker-border);
}

@media (min-width: 768px) {
  .configurator-page {
    padding-top: calc(var(--navbar-height-desktop) + 2rem);
    padding-bottom: var(--intro-padding-y-desktop);
    padding-left: var(--intro-padding-x-desktop);
    padding-right: var(--intro-padding-x-desktop);
  }

  .configurator-subcategories-page__back-link {
    right: var(--intro-padding-x-desktop);
  }

  .configurator-subcategories-page__title {
    margin-bottom: 2rem;
  }

  .configurator-subcategories-page__grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
  }

  .configurator-main__actions {
    margin-top: 2.5rem;
    padding-top: 2.5rem;
  }
}
</style>
