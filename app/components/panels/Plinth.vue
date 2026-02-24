<template>
  <BasePanel :model-value="modelValue" title="Plinth Color" width="720px" @update:model-value="emit('update:modelValue', $event)">
    <p class="plinth-panel__intro">Choose a plinth color for your cabinet.</p>
    <ul class="plinth-panel__list" role="list">
      <li v-for="item in PLINTH_OPTIONS" :key="item.id" class="plinth-panel__item">
        <ListItem
          :title="item.title"
          :description="item.description"
          :image="item.image"
          :selected="selection?.id === item.id"
          @click="selectOption(item)"
        />
      </li>
    </ul>
  </BasePanel>
</template>

<script setup lang="ts">
import { PLINTH_OPTIONS, type PlinthOption } from '../../constants/dummy';

interface Props {
  modelValue: boolean;
  selection?: PlinthOption | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'update:selection': [value: PlinthOption];
}>();

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
}
</style>
