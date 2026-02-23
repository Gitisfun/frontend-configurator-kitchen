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
import { useRoute } from 'vue-router';

const route = useRoute();
const selectedId = ref<string | null>(null);

const categoryTitle = computed(() => {
  const type = route.query.type as string | undefined;
  if (type === 'base') return 'onderkasten';
  if (type === 'wall') return 'bovenkasten';
  return 'hoge kasten';
});

interface Subcategory {
  id: string;
  title: string;
  image: string;
}

const subcategories = computed<Subcategory[]>(() => {
  const type = route.query.type as string | undefined;
  if (type === 'base') {
    return [
      { id: 'base-60', title: 'Onderkast(en) 60cm breed', image: '/placeholder.png' },
      { id: 'base-80', title: 'Onderkast(en) 80cm breed', image: '/placeholder.png' },
      { id: 'base-100', title: 'Onderkast(en) 100cm breed', image: '/placeholder.png' },
      { id: 'base-accessories', title: 'Onderkast accessoires', image: '/placeholder.png' },
    ];
  }
  if (type === 'wall') {
    return [
      { id: 'wall-60', title: 'Bovenkast(en) 60cm breed', image: '/placeholder.png' },
      { id: 'wall-80', title: 'Bovenkast(en) 80cm breed', image: '/placeholder.png' },
      { id: 'wall-accessories', title: 'Bovenkast accessoires', image: '/placeholder.png' },
    ];
  }
  return [
    { id: 'tall-143', title: 'Hoge kast(en) 143cm hoog', image: '/placeholder.png' },
    { id: 'tall-194', title: 'Hoge kast(en) 194.8cm hoog', image: '/placeholder.png' },
    { id: 'tall-207', title: 'Hoge kast(en) 207.8cm hoog', image: '/placeholder.png' },
    { id: 'tall-220', title: 'Hoge kast(en) 220.8cm hoog', image: '/placeholder.png' },
    { id: 'tall-accessories', title: 'Hoge kast accessoires', image: '/placeholder.png' },
    { id: 'tall-panels', title: 'Hoge kast afwerkpanelen', image: '/placeholder.png' },
  ];
});

function selectSubcategory(item: Subcategory) {
  selectedId.value = selectedId.value === item.id ? null : item.id;
  // TODO: navigate or persist selection
}

function onBack() {
  window.history.back();
}

function onNext() {
  // TODO: go to next step
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
