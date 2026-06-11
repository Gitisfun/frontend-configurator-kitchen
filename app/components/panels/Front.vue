<template>
  <BasePanel :model-value="modelValue" title="Front Color" width="720px" @update:model-value="emit('update:modelValue', $event)">
    <p class="front-panel__intro">Choose a front color for your cabinet.</p>
    <p v-if="error" class="front-panel__error">Failed to load front options. Please try again.</p>
    <ul v-else class="front-panel__list" role="list">
      <template v-if="pending">
        <li v-for="n in 6" :key="n" class="front-panel__item front-panel__item--skeleton" aria-hidden="true" />
      </template>
      <template v-else>
        <li v-for="item in fronts" :key="item.id" class="front-panel__item">
          <ListItem
            :title="item.title"
            :description="item.description ?? undefined"
            :image="item.image ?? undefined"
            :price-class="item.priceClass ?? undefined"
            :selected="selection?.id === item.id"
            @click="selectOption(item)"
          />
        </li>
      </template>
    </ul>
  </BasePanel>
</template>

<script setup lang="ts">
import { useFronts, type FrontOption } from '../../composables/api/useFronts';

interface Props {
  modelValue: boolean;
  selection?: FrontOption | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'update:selection': [value: FrontOption];
}>();

const { fronts, pending, error } = useFronts();

function selectOption(item: FrontOption) {
  emit('update:selection', item);
  emit('update:modelValue', false);
}
</script>

<style scoped>
.front-panel__intro {
  margin: 0 0 1rem;
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--color-text);
}

.front-panel__error {
  margin: 0 0 1rem;
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--color-danger, #c0392b);
}

.front-panel__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.front-panel__item {
  margin: 0;
  padding: 0;
  display: flex;
}

.front-panel__item :deep(.list-item) {
  flex: 1;
}

.front-panel__item--skeleton {
  aspect-ratio: 3 / 4;
  border-radius: var(--picker-radius);
  background: linear-gradient(90deg, var(--color-surface-hover) 25%, var(--picker-border) 50%, var(--color-surface-hover) 75%);
  background-size: 200% 100%;
  animation: front-panel-shimmer 1.4s ease infinite;
}

@keyframes front-panel-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
