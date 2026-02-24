<template>
  <BasePanel :model-value="modelValue" title="Side Panel" width="720px" @update:model-value="emit('update:modelValue', $event)">
    <p class="side-panel__intro">Choose a side panel color for your cabinet.</p>
    <ul class="side-panel__list" role="list">
      <li v-for="item in SIDE_OPTIONS" :key="item.id" class="side-panel__item">
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
import { SIDE_OPTIONS, type SideOption } from '../../constants/dummy';

interface Props {
  modelValue: boolean;
  selection?: SideOption | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'update:selection': [value: SideOption];
}>();

function selectOption(item: SideOption) {
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
}
</style>
