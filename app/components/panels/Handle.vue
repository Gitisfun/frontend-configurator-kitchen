<template>
  <BasePanel :model-value="modelValue" title="Handle Type" width="720px" @update:model-value="emit('update:modelValue', $event)">
    <p class="handle-panel__intro">Choose a handle or knob for your cabinet.</p>
    <ul class="handle-panel__list" role="list">
      <li v-for="item in HANDLE_OPTIONS" :key="item.id" class="handle-panel__item">
        <ListItem
          :title="item.title"
          :image="item.image"
          :selected="selection?.id === item.id"
          @click="selectOption(item)"
        />
      </li>
    </ul>
  </BasePanel>
</template>

<script setup lang="ts">
import { HANDLE_OPTIONS, type HandleOption } from '../../constants/dummy';

interface Props {
  modelValue: boolean;
  selection?: HandleOption | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'update:selection': [value: HandleOption];
}>();

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
}
</style>
