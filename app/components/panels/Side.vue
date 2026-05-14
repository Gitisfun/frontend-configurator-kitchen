<template>
  <BasePanel :model-value="modelValue" title="Side Panel" width="720px" @update:model-value="emit('update:modelValue', $event)">
    <p class="side-panel__intro">Choose a side panel color for your cabinet.</p>
    <p v-if="error" class="side-panel__error">Failed to load side panel options. Please try again.</p>
    <ul v-else class="side-panel__list" role="list">
      <template v-if="pending">
        <li v-for="n in 6" :key="n" class="side-panel__item side-panel__item--skeleton" aria-hidden="true" />
      </template>
      <template v-else>
        <li v-for="item in backs" :key="item.id" class="side-panel__item">
          <ListItem
            :title="item.title"
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
import { useBacks, type BackOption } from '../../composables/useBacks';

interface Props {
  modelValue: boolean;
  selection?: BackOption | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'update:selection': [value: BackOption];
}>();

const { backs, pending, error } = useBacks();

function selectOption(item: BackOption) {
  emit('update:selection', item);
  emit('update:modelValue', false);
}
</script>

<style scoped>
.side-panel__intro {
  margin: 0 0 1rem;
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--color-text);
}

.side-panel__error {
  margin: 0 0 1rem;
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--color-danger, #c0392b);
}

.side-panel__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.side-panel__item {
  margin: 0;
  padding: 0;
  display: flex;
}

.side-panel__item :deep(.list-item) {
  flex: 1;
}

.side-panel__item--skeleton {
  aspect-ratio: 3 / 4;
  border-radius: var(--picker-radius);
  background: linear-gradient(90deg, var(--color-surface-hover) 25%, var(--picker-border) 50%, var(--color-surface-hover) 75%);
  background-size: 200% 100%;
  animation: side-panel-shimmer 1.4s ease infinite;
}

@keyframes side-panel-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
