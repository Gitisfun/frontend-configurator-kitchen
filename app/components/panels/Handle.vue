<template>
  <BasePanel :model-value="modelValue" title="Handle Type" width="720px" @update:model-value="emit('update:modelValue', $event)">
    <p class="handle-panel__intro">Choose a handle or knob for your cabinet.</p>
    <ul class="handle-panel__list" role="list">
      <li v-for="item in handleOptions" :key="item.id" class="handle-panel__item">
        <ListItem
          :title="item.title"
          :image="item.image"
          :selected="value === item.title"
          @click="selectOption(item)"
        />
      </li>
    </ul>
  </BasePanel>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  value?: string;
}

interface HandleOption {
  id: string;
  title: string;
  image: string;
}

const props = withDefaults(defineProps<Props>(), {
  value: 'Knop 77',
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'update:value': [value: string];
}>();

const handleOptions: HandleOption[] = [
  { id: '77', title: 'Knop 77', image: '/placeholder.png' },
  { id: '9', title: 'Knop 9', image: '/placeholder.png' },
  { id: '199', title: 'Knop 199', image: '/placeholder.png' },
  { id: '141', title: 'Knop 141', image: '/placeholder.png' },
  { id: '178', title: 'Knop 178', image: '/placeholder.png' },
  { id: 'brass-bar', title: 'Brass Bar', image: '/placeholder.png' },
  { id: 'chrome-t', title: 'Chrome T-bar', image: '/placeholder.png' },
  { id: 'oval-matt', title: 'Oval mat', image: '/placeholder.png' },
  { id: 'round-polished', title: 'Round polished', image: '/placeholder.png' },
  { id: 'pull-rail', title: 'Pull rail', image: '/placeholder.png' },
];

function selectOption(item: HandleOption) {
  emit('update:value', item.title);
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
