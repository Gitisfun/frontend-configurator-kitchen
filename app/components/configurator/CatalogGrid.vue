<template>
  <div class="catalog-grid">
    <template v-if="loading">
      <ul class="catalog-grid__list" role="list" aria-busy="true" :aria-label="loadingLabel">
        <li v-for="n in skeletonCount" :key="n" class="catalog-grid__cell" aria-hidden="true">
          <div class="catalog-grid__skeleton-card">
            <div class="catalog-grid__skeleton-media catalog-grid__shimmer" />
            <div class="catalog-grid__skeleton-title catalog-grid__shimmer" />
          </div>
        </li>
      </ul>
    </template>
    <template v-else-if="items.length === 0">
      <slot name="empty" />
    </template>
    <template v-else>
      <ul class="catalog-grid__list" role="list">
        <li v-for="item in items" :key="`${item.kind}-${item.id}`" class="catalog-grid__cell">
          <ListItem :title="item.title" :image="item.image ?? '#e8e4df'" @click="emit('select', item)" />
        </li>
      </ul>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { CategoryCatalogItem } from '../../api/categoryCatalog';

const SKELETON_DEFAULT = 6;

withDefaults(
  defineProps<{
    loading: boolean;
    items: CategoryCatalogItem[];
    skeletonCount?: number;
    /** Screen-reader label while the catalog grid is loading. */
    loadingLabel?: string;
  }>(),
  { skeletonCount: SKELETON_DEFAULT, loadingLabel: 'Loading catalog' },
);

const emit = defineEmits<{
  select: [item: CategoryCatalogItem];
}>();
</script>

<style scoped>
.catalog-grid__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.catalog-grid__cell {
  margin: 0;
  padding: 0;
  min-width: 0;
}

.catalog-grid__skeleton-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.75rem;
  width: 100%;
  padding: var(--picker-padding-x);
  background-color: var(--color-surface);
  border: 1px solid var(--picker-border);
  border-radius: var(--picker-radius);
}

.catalog-grid__skeleton-media {
  aspect-ratio: 4 / 3;
  width: 100%;
  border-radius: 4px;
  border: 1px solid #e8e3da;
  background-color: #f5f1ec;
}

.catalog-grid__skeleton-title {
  height: 0.875rem;
  width: 72%;
  border-radius: 4px;
  background-color: var(--color-surface-hover);
}

.catalog-grid__shimmer {
  position: relative;
  overflow: hidden;
}

.catalog-grid__shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 0%,
    transparent 40%,
    rgba(255, 255, 255, 0.55) 50%,
    transparent 60%,
    transparent 100%
  );
  transform: translateX(-100%);
  animation: catalog-grid-shimmer 1.5s ease-in-out infinite;
}

.catalog-grid__skeleton-card .catalog-grid__skeleton-media::after {
  animation-delay: 0.05s;
}

.catalog-grid__skeleton-card .catalog-grid__skeleton-title::after {
  animation-delay: 0.15s;
}

@keyframes catalog-grid-shimmer {
  100% {
    transform: translateX(100%);
  }
}

@media (min-width: 768px) {
  .catalog-grid__list {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
  }

  .catalog-grid__skeleton-card {
    padding: var(--picker-padding-x-desktop);
  }

  .catalog-grid__skeleton-title {
    height: 0.9375rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .catalog-grid__shimmer::after {
    animation: none;
    opacity: 0.35;
  }
}
</style>
