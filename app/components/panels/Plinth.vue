<template>
  <BasePanel :model-value="modelValue" title="Plinth Color" width="720px" @update:model-value="emit('update:modelValue', $event)">
    <p class="plinth-panel__intro">Choose a plinth color for your cabinet.</p>
    <p v-if="error" class="plinth-panel__error">Failed to load plinth options. Please try again.</p>
    <ul v-else class="plinth-panel__list" role="list">
      <template v-if="pending">
        <li v-for="n in 6" :key="n" class="plinth-panel__item plinth-panel__item--skeleton" aria-hidden="true" />
      </template>
      <template v-else>
        <li v-for="item in plinths" :key="item.id" class="plinth-panel__item">
          <ListItem
            :title="item.title"
            :description="item.description ?? undefined"
            :image="item.image ?? undefined"
            :selected="selection?.id === item.id"
            @click="selectOption(item)"
          />
        </li>
      </template>
    </ul>
  </BasePanel>
</template>

<script setup lang="ts">
import { usePlinths, type PlinthOption } from '../../composables/usePlinths';

interface Props {
  modelValue: boolean;
  selection?: PlinthOption | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'update:selection': [value: PlinthOption];
}>();

const { plinths, pending, error } = usePlinths();

function selectOption(item: PlinthOption) {
  emit('update:selection', item);
  emit('update:modelValue', false);
}
</script>

<style scoped>
.plinth-panel__intro {
  margin: 0 0 1rem;
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--color-text);
}

.plinth-panel__error {
  margin: 0 0 1rem;
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--color-danger, #c0392b);
}

.plinth-panel__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.plinth-panel__item {
  margin: 0;
  padding: 0;
  display: flex;
}

.plinth-panel__item :deep(.list-item) {
  flex: 1;
}

.plinth-panel__item--skeleton {
  aspect-ratio: 3 / 4;
  border-radius: var(--picker-radius);
  background: linear-gradient(90deg, var(--color-surface-hover) 25%, var(--picker-border) 50%, var(--color-surface-hover) 75%);
  background-size: 200% 100%;
  animation: plinth-panel-shimmer 1.4s ease infinite;
}

@keyframes plinth-panel-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
