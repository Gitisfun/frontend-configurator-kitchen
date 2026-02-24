<template>
  <BasePanel :model-value="modelValue" title="Front Color" width="720px" @update:model-value="emit('update:modelValue', $event)">
    <p class="front-panel__intro">Choose a front color for your cabinet.</p>
    <ul class="front-panel__list" role="list">
      <li v-for="item in FRONT_OPTIONS" :key="item.id" class="front-panel__item">
        <ListItem
          :title="item.title"
          :image="item.image"
          :price-class="item.priceClass"
          :info-url="item.infoUrl"
          :selected="selection?.id === item.id"
          @click="selectOption(item)"
        />
      </li>
    </ul>
  </BasePanel>
</template>

<script setup lang="ts">
import { FRONT_OPTIONS, type FrontOption } from '../../constants/dummy';

interface Props {
  modelValue: boolean;
  selection?: FrontOption | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'update:selection': [value: FrontOption];
}>();

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
}
</style>
