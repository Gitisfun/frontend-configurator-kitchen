<template>
  <div class="configurator-page configurator-subcategories-page">
    <NuxtLink to="/configurator/type" class="configurator-subcategories-page__back-link">
      terug naar kasten
    </NuxtLink>

    <section class="configurator-main">
      <div class="configurator-main__inner">
        <BaseHeader size="big" as="h1" align="left" color="primary" class="configurator-subcategories-page__title">
          {{ categoryTitle }}
        </BaseHeader>

        <ul class="configurator-subcategories-page__grid" role="list">
          <li
            v-for="item in subcategories"
            :key="item.id"
            class="configurator-subcategories-page__item"
          >
            <ListItem
              :title="item.title"
              :image="item.image"
              :selected="selectedId === item.id"
              @click="selectSubcategory(item)"
            />
          </li>
        </ul>
      </div>

      <div class="configurator-main__actions">
        <BaseButtons back-label="Terug" next-label="Volgende" @back="onBack" @next="onNext" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from '../../composables/useToast';
import {
  CONFIGURATOR_TYPE_OPTIONS,
  SUBCATEGORIES_BY_TYPE,
  type Subcategory,
} from '../../constants/dummy';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const selectedId = ref<string | null>(null);

const categoryTitle = computed(() => {
  const type = route.query.type as string | undefined;
  const option = CONFIGURATOR_TYPE_OPTIONS.find((o) => o.value === type);
  return option?.label ?? 'hoge kasten';
});

const subcategories = computed<Subcategory[]>(() => {
  const type = route.query.type as string | undefined;
  return type ? SUBCATEGORIES_BY_TYPE[type] ?? [] : [];
});

function selectSubcategory(item: Subcategory) {
  selectedId.value = selectedId.value === item.id ? null : item.id;
}

function onBack() {
  window.history.back();
}

function onNext() {
  const type = route.query.type as string | undefined;
  const subcategoryId = selectedId.value;
  if (!subcategoryId) {
    toast.warning('Selecteer een kast om verder te gaan.');
    return;
  }
  router.push({
    path: '/configurator/product',
    query: { type: type ?? '', subcategory: subcategoryId },
  });
}
</script>

<style scoped>
.configurator-subcategories-page {
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
  .configurator-subcategories-page {
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
