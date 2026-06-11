<template>
  <div class="configurator-page configurator-catalog-product-page">
    <section class="configurator-main">
      <p v-if="!productId" class="configurator-catalog-product-page__notice">Geen product geselecteerd.</p>
      <p v-else-if="fetchError" class="configurator-catalog-product-page__notice">Kon dit product niet laden. Probeer het opnieuw.</p>
      <template v-else-if="pending">
        <div class="configurator-catalog-product-page__inner configurator-catalog-product-page__inner--loading" aria-busy="true">
          <div class="configurator-catalog-product-page__skeleton configurator-catalog-product-page__skeleton--title" />
          <div class="configurator-catalog-product-page__skeleton configurator-catalog-product-page__skeleton--hero" />
        </div>
      </template>
      <template v-else-if="detail">
        <div class="configurator-main__inner">
          <header class="configurator-catalog-product-page__header">
            <BaseHeader size="big" as="h1" align="left" color="primary" class="configurator-catalog-product-page__title">
              {{ detail.title }}
            </BaseHeader>
          </header>
          <div v-if="detail.image" class="configurator-catalog-product-page__media">
            <img :src="detail.image" alt="" class="configurator-catalog-product-page__image" width="600" height="400" />
          </div>
          <div v-if="detail.descriptionText" class="configurator-catalog-product-page__body">
            <BaseParagraph size="medium" align="left" color="primary">{{ detail.descriptionText }}</BaseParagraph>
          </div>
        </div>
      </template>

      <div class="configurator-main__actions">
        <BaseButtons back-label="Terug" :show-next="false" @back="onBack" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { trimmedRouteQueryParam } from '../../utils/routeQuery';
import { useCatalogProduct } from '../../composables/api/useCatalogProduct';

const route = useRoute();
const router = useRouter();

const productId = computed(() => trimmedRouteQueryParam(route.query.product));

const { detail, pending, error: fetchError } = await useCatalogProduct(productId);

function baseStepQuery(): Record<string, string> {
  const q: Record<string, string> = {};
  const type = route.query.type;
  if (typeof type === 'string') q.type = type;
  const cat = route.query.category;
  if (typeof cat === 'string' && cat.trim()) q.category = cat.trim();
  const sub = route.query.subcategoryPath;
  if (typeof sub === 'string' && sub.trim()) q.subcategoryPath = sub.trim();
  return q;
}

function onBack() {
  router.push({
    path: '/configurator/subcategories',
    query: baseStepQuery(),
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

.configurator-catalog-product-page__notice {
  margin: 0 auto 1rem;
  max-width: var(--intro-max-width);
  font-family: var(--font-sans);
  font-size: var(--paragraph-size-medium);
  color: var(--color-text-muted);
}

.configurator-catalog-product-page__inner--loading {
  max-width: var(--intro-max-width);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.configurator-catalog-product-page__skeleton {
  border-radius: var(--picker-radius);
  background: linear-gradient(90deg, var(--color-surface-hover) 25%, var(--picker-border) 50%, var(--color-surface-hover) 75%);
  background-size: 200% 100%;
  animation: catalog-product-shimmer 1.4s ease infinite;
}

.configurator-catalog-product-page__skeleton--title {
  height: 2.5rem;
  max-width: 70%;
}

.configurator-catalog-product-page__skeleton--hero {
  aspect-ratio: 4 / 3;
  max-width: 480px;
}

@keyframes catalog-product-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.configurator-catalog-product-page__header {
  margin-bottom: 1.5rem;
}

.configurator-catalog-product-page__title {
  margin: 0;
}

.configurator-catalog-product-page__media {
  margin-bottom: 1.5rem;
}

.configurator-catalog-product-page__image {
  display: block;
  width: 100%;
  max-width: 480px;
  height: auto;
  border-radius: var(--picker-radius);
  object-fit: cover;
}

.configurator-catalog-product-page__body {
  margin-bottom: 1rem;
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
}
</style>
