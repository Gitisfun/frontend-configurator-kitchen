<template>
  <BasePanel :model-value="modelValue" title="Door Color" width="720px" @update:model-value="emit('update:modelValue', $event)">
    <p class="front-panel__intro">Choose a door color for your cabinet.</p>
    <ul class="front-panel__list" role="list">
      <li v-for="item in doorOptions" :key="item.id" class="front-panel__item">
        <ListItem
          :title="item.title"
          :image="item.image"
          :price-class="item.priceClass"
          :info-url="item.infoUrl"
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

interface DoorOption {
  id: string;
  title: string;
  image: string;
  priceClass: number;
  infoUrl: string;
}

const props = withDefaults(defineProps<Props>(), {
  color: '#ffffff',
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'update:color': [value: string];
}>();

const doorOptions: DoorOption[] = [
  { id: 'custom', title: 'Personaliseer jouw kleur', image: '#7a8a9a', priceClass: 5, infoUrl: '/info/custom-color' },
  { id: 'b20', title: 'B20 ultramat', image: '#2d2d2d', priceClass: 3, infoUrl: '/info/b20' },
  { id: 'b30', title: 'B30 ultramat', image: '#3d3d3d', priceClass: 4, infoUrl: '/info/b30' },
  { id: 'b40', title: 'B40 ultramat', image: '#4a4a4a', priceClass: 4, infoUrl: '/info/b40' },
  { id: 'b50', title: 'B50 ultramat', image: '#5a5a5a', priceClass: 5, infoUrl: '/info/b50' },
  { id: 'g20', title: 'G20 ultramat', image: '#d8d8d4', priceClass: 2, infoUrl: '/info/g20' },
  { id: 'g40', title: 'G40 ultramat', image: '#c8c8c4', priceClass: 3, infoUrl: '/info/g40' },
  { id: 'g50', title: 'G50 ultramat', image: '#b0b0ac', priceClass: 3, infoUrl: '/info/g50' },
  { id: 'g60', title: 'G60 ultramat', image: '#989894', priceClass: 4, infoUrl: '/info/g60' },
  { id: 'sneeuwwit', title: 'Sneeuwwit mat kunststof', image: '#fafaf8', priceClass: 2, infoUrl: '/info/sneeuwwit' },
  { id: 'magnolia', title: 'Magnolia ultramat', image: '#e8e4df', priceClass: 3, infoUrl: '/info/magnolia' },
  { id: 'wit', title: 'Wit hoogglans', image: '#ffffff', priceClass: 4, infoUrl: '/info/wit' },
  { id: 'antraciet', title: 'Antraciet mat', image: '#36454f', priceClass: 5, infoUrl: '/info/antraciet' },
  { id: 'grafiet', title: 'Grafiet', image: '#4a4a4a', priceClass: 5, infoUrl: '/info/grafiet' },
];

function selectOption(item: DoorOption) {
  emit('update:color', item.image);
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
