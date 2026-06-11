<template>
  <BaseConfiguratorTemplate
    class="configurator-subcategories-page"
    :title="categoryTitle"
    :back-label="t('configurator.index.actions.back')"
    :show-next="false"
    @back="navigateBackFromSubcategories"
  >
    <template #before>
      <NuxtLink :to="{ path: '/configurator/type', query: typeQuery }" replace class="configurator-subcategories-page__back-link">
        {{ t('configurator.subcategories.backToCabinets') }}
      </NuxtLink>
    </template>

    <div class="configurator-main__inner">
      <p v-if="catalogError" class="configurator-subcategories-page__error">
        {{ t('configurator.subcategories.loadError') }}
      </p>

      <ConfiguratorCatalogGrid
        v-else
        :loading="catalogPending"
        :items="catalogItems"
        :loading-label="t('configurator.subcategories.loadingAriaLabel')"
        @select="navigateOnCatalogItem"
      >
        <template #empty>
          <p class="configurator-subcategories-page__empty">{{ t('configurator.subcategories.empty') }}</p>
        </template>
      </ConfiguratorCatalogGrid>
    </div>
  </BaseConfiguratorTemplate>
</template>

<script setup lang="ts">
import { useConfiguratorCategoryStep } from '../../composables/useConfiguratorCategoryStep';
import { useCategoryCatalog } from '../../composables/api/useCategoryCatalog';

const { t } = useI18n();

const { categoryDocumentId, parentSubcategoryDocumentId, typeQuery, categoryTitle, navigateOnCatalogItem, navigateBackFromSubcategories } =
  useConfiguratorCategoryStep();

const { catalogItems, pending: catalogPending, error: catalogError } = useCategoryCatalog(categoryDocumentId, parentSubcategoryDocumentId);
</script>

<style scoped>
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

@media (min-width: 768px) {
  .configurator-subcategories-page__back-link {
    right: var(--intro-padding-x-desktop);
  }
}
</style>
