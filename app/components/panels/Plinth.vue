<template>
  <BasePanel :model-value="modelValue" title="Plinth Color" width="720px" @update:model-value="emit('update:modelValue', $event)">
    <p class="plinth-panel__intro">Choose a plinth color for your cabinet.</p>
    <ul class="plinth-panel__list" role="list">
      <li v-for="item in plinthOptions" :key="item.id" class="plinth-panel__item">
        <ListItem
          :title="item.title"
          :description="item.description"
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

interface PlinthOption {
  id: string;
  title: string;
  description: string;
  image: string;
}

const props = withDefaults(defineProps<Props>(), {
  color: '#e8e4df',
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'update:color': [value: string];
}>();

const plinthOptions: PlinthOption[] = [
  { id: 'kalkwit', title: 'Kalkwit', description: 'Bedrag per 10cm: 6,20', image: '#f8f6f2' },
  { id: 'magnolia', title: 'Magnolia kunststof', description: 'Bedrag per 10cm: 5,80', image: '#e8e4df' },
  { id: 'magnolia-hg', title: 'Magnolia hoogglanzend', description: 'Bedrag per 10cm: 7,40', image: '#eae6e0' },
  { id: 'magnolia-mat', title: 'Magnolia uv-lak extra mat', description: 'Bedrag per 10cm: 8,10', image: '#e0dcd7' },
  { id: 'magnolia-uv', title: 'Magnolia uv-lak hoogglanzend', description: 'Bedrag per 10cm: 0,-', image: '#f0ede8' },
  { id: 'ivory', title: 'Ivory', description: 'Bedrag per 10cm: 5,50', image: '#fffff0' },
  { id: 'warm-wit', title: 'Warm wit', description: 'Bedrag per 10cm: 6,00', image: '#faf8f5' },
  { id: 'parelwit', title: 'Parelwit', description: 'Bedrag per 10cm: 6,80', image: '#f5f5f0' },
  { id: 'natuurwit', title: 'Natuurwit', description: 'Bedrag per 10cm: 5,20', image: '#f2f0eb' },
  { id: 'zand', title: 'Zand', description: 'Bedrag per 10cm: 6,40', image: '#e6e0d5' },
  { id: 'grijs-wit', title: 'Grijs wit', description: 'Bedrag per 10cm: 7,20', image: '#e8e8e4' },
  { id: 'lichtgrijs', title: 'Lichtgrijs', description: 'Bedrag per 10cm: 5,90', image: '#d8d8d4' },
  { id: 'muisgrijs', title: 'Muisgrijs', description: 'Bedrag per 10cm: 6,60', image: '#c8c8c4' },
  { id: 'antraciet', title: 'Antraciet', description: 'Bedrag per 10cm: 8,40', image: '#3d3d3d' },
  { id: 'grafiet', title: 'Grafiet', description: 'Bedrag per 10cm: 8,20', image: '#4a4a4a' },
  { id: 'zwart', title: 'Zwart', description: 'Bedrag per 10cm: 9,00', image: '#1a1a1a' },
  { id: 'donkergrijs', title: 'Donkergrijs', description: 'Bedrag per 10cm: 7,80', image: '#5a5a56' },
  { id: 'taupe', title: 'Taupe', description: 'Bedrag per 10cm: 6,50', image: '#c4b8a8' },
  { id: 'beige', title: 'Beige', description: 'Bedrag per 10cm: 5,70', image: '#d4c8b8' },
  { id: 'zandsteen', title: 'Zandsteen', description: 'Bedrag per 10cm: 7,00', image: '#b8a898' },
  { id: 'natuur-eiken', title: 'Natuur eiken', description: 'Bedrag per 10cm: 8,80', image: '#c4a878' },
  { id: 'walnoot', title: 'Walnoot', description: 'Bedrag per 10cm: 9,20', image: '#6b4423' },
  { id: 'noten', title: 'Noten', description: 'Bedrag per 10cm: 8,60', image: '#5c4033' },
  { id: 'eiken-matt', title: 'Eiken mat', description: 'Bedrag per 10cm: 7,60', image: '#b8a088' },
  { id: 'eiken-glans', title: 'Eiken hoogglans', description: 'Bedrag per 10cm: 8,00', image: '#d0b898' },
  { id: 'wit-matt', title: 'Wit mat', description: 'Bedrag per 10cm: 6,10', image: '#f0eeea' },
  { id: 'wit-glans', title: 'Wit hoogglans', description: 'Bedrag per 10cm: 6,90', image: '#fafaf8' },
  { id: 'off-white', title: 'Off-white', description: 'Bedrag per 10cm: 5,40', image: '#f5f3ef' },
  { id: 'crème', title: 'Crème', description: 'Bedrag per 10cm: 6,30', image: '#f2ebe0' },
  { id: 'melk', title: 'Melk', description: 'Bedrag per 10cm: 5,60', image: '#ebe5dc' },
  { id: 'steengrijs', title: 'Steengrijs', description: 'Bedrag per 10cm: 7,40', image: '#a0a09c' },
  { id: 'charcoal', title: 'Charcoal', description: 'Bedrag per 10cm: 8,50', image: '#36454f' },
  { id: 'grijs-blauw', title: 'Grijs blauw', description: 'Bedrag per 10cm: 7,90', image: '#6b7b8c' },
  { id: 'licht-beige', title: 'Licht beige', description: 'Bedrag per 10cm: 5,30', image: '#e8e0d8' },
  { id: 'terracotta', title: 'Terracotta', description: 'Bedrag per 10cm: 8,20', image: '#c67b5c' },
  { id: 'zilver', title: 'Zilver', description: 'Bedrag per 10cm: 9,40', image: '#c0c0c0' },
  { id: 'aluminium', title: 'Aluminium', description: 'Bedrag per 10cm: 9,80', image: '#a8a8a8' },
  { id: 'rood-bruin', title: 'Rood bruin', description: 'Bedrag per 10cm: 8,70', image: '#8b4513' },
  { id: 'mahonie', title: 'Mahonie', description: 'Bedrag per 10cm: 10,20', image: '#4a2c2a' },
  { id: 'wengé', title: 'Wengé', description: 'Bedrag per 10cm: 9,60', image: '#3d2b1f' },
];

function selectOption(item: PlinthOption) {
  emit('update:color', item.image);
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
