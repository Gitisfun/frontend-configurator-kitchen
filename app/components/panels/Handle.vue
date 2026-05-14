<template>
  <BasePanel :model-value="modelValue" title="Handle Type" width="720px" @update:model-value="emit('update:modelValue', $event)">
    <p class="handle-panel__intro">Choose a handle or knob for your cabinet.</p>
    <p v-if="error" class="handle-panel__error">Failed to load handle options. Please try again.</p>
    <ul v-else class="handle-panel__list" role="list">
      <template v-if="pending">
        <li v-for="n in 6" :key="n" class="handle-panel__item handle-panel__item--skeleton" aria-hidden="true" />
      </template>
      <template v-else>
        <li v-for="item in handles" :key="item.id" class="handle-panel__item">
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
import { useHandles, type HandleOption } from '../../composables/useHandles';

interface Props {
  modelValue: boolean;
  selection?: HandleOption | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'update:selection': [value: HandleOption];
}>();

const { handles, pending, error } = useHandles();

function selectOption(item: HandleOption) {
  emit('update:selection', item);
  emit('update:modelValue', false);
}
</script>

<style scoped>
.handle-panel__intro {
  margin: 0 0 1rem;
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--color-text);
}

.handle-panel__error {
  margin: 0 0 1rem;
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--color-danger, #c0392b);
}

.handle-panel__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.handle-panel__item {
  margin: 0;
  padding: 0;
  display: flex;
}

.handle-panel__item :deep(.list-item) {
  flex: 1;
}

.handle-panel__item--skeleton {
  aspect-ratio: 3 / 4;
  border-radius: var(--picker-radius);
  background: linear-gradient(90deg, var(--color-surface-hover) 25%, var(--picker-border) 50%, var(--color-surface-hover) 75%);
  background-size: 200% 100%;
  animation: handle-panel-shimmer 1.4s ease infinite;
}

@keyframes handle-panel-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
