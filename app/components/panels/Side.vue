<template>
  <BasePanel :model-value="modelValue" title="Side Panel" width="720px" @update:model-value="emit('update:modelValue', $event)">
    <p class="side-panel__intro">Choose a side panel color for your cabinet.</p>
    <ul class="side-panel__list" role="list">
      <li v-for="item in sideOptions" :key="item.id" class="side-panel__item">
        <ListItem
          :title="item.title"
          :image="item.image"
          :selected="color === item.image"
          @click="selectOption(item)"
        />
      </li>
    </ul>
  </BasePanel>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  color?: string;
}

interface SideOption {
  id: string;
  title: string;
  image: string;
}

const props = withDefaults(defineProps<Props>(), {
  color: '#c4b8a8',
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'update:color': [value: string];
}>();

const sideOptions: SideOption[] = [
  { id: 'sneeuwwit', title: 'Sneeuwwit', image: '#ffffff' },
  { id: 'premiumwit', title: 'Premiumwit', image: '#faf8f5' },
  { id: 'kalkwit', title: 'Kalkwit', image: '#f2f0eb' },
  { id: 'magic-grijs', title: 'Magic-grijs', image: '#a8a49e' },
  { id: 'klei', title: 'Klei', image: '#8b8478' },
  { id: 'magnolia', title: 'Magnolia', image: '#e8e4df' },
  { id: 'lichtgrijs', title: 'Lichtgrijs', image: '#d8d8d4' },
  { id: 'antraciet', title: 'Antraciet', image: '#3d3d3d' },
  { id: 'taupe', title: 'Taupe', image: '#c4b8a8' },
  { id: 'zand', title: 'Zand', image: '#e6e0d5' },
  { id: 'grafiet', title: 'Grafiet', image: '#4a4a4a' },
  { id: 'natuurwit', title: 'Natuurwit', image: '#f5f3ef' },
];

function selectOption(item: SideOption) {
  emit('update:color', item.image);
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
