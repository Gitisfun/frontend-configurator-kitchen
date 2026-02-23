<template>
  <button
    type="button"
    class="list-item"
    :class="{ 'list-item--selected': selected }"
    :aria-pressed="selected"
    :aria-label="ariaLabel"
    @click="emit('click')"
  >
    <div class="list-item__media" :style="mediaStyle">
      <img
        v-if="isImageUrl"
        :src="image"
        :alt="title"
        class="list-item__image"
        loading="lazy"
      />
    </div>
    <h3 class="list-item__title">{{ title }}</h3>
    <p v-if="description" class="list-item__description">{{ description }}</p>
    <div v-if="priceClass != null" class="list-item__price-class" aria-label="Prijsklasse {{ priceClass }} van 5">
      <span
        v-for="n in 5"
        :key="n"
        class="list-item__dot"
        :class="{ 'list-item__dot--filled': n <= priceClass }"
        aria-hidden="true"
      />
    </div>
    <a
      v-if="infoUrl"
      :href="infoUrl"
      class="list-item__info"
      target="_blank"
      rel="noopener noreferrer"
      @click.stop
    >
      <span class="list-item__info-icon" aria-hidden="true">i</span>
      informatie
    </a>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  title: string;
  description?: string;
  /** Hex color (e.g. #e8e4df) or image URL for the top swatch */
  image?: string;
  selected?: boolean;
  /** Price class 1–5; when set, shows filled/empty circles */
  priceClass?: number;
  /** When set, shows an "informatie" link that opens this URL */
  infoUrl?: string;
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  image: '#e8e4df',
  selected: false,
});

const emit = defineEmits<{
  click: [];
}>();

const isImageUrl = computed(() => {
  if (!props.image) return false;
  return props.image.startsWith('http') || props.image.startsWith('/') || props.image.startsWith('data:');
});

const mediaStyle = computed(() => {
  if (isImageUrl.value) return {};
  return { backgroundColor: props.image || '#e8e4df' };
});

const ariaLabel = computed(() => {
  const label = props.title;
  if (props.description) return `${label}, ${props.description}`;
  if (props.priceClass != null) return `${label}, prijsklasse ${props.priceClass} van 5`;
  return label;
});
</script>

<style scoped>
.list-item {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  text-align: left;
  padding: var(--picker-padding-x);
  gap: 0.75rem;
  width: 100%;
  min-width: 0;
  background-color: var(--color-surface);
  border: 1px solid var(--picker-border);
  border-radius: var(--picker-radius);
  cursor: pointer;
  transition:
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s ease;
}

.list-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: var(--color-text-muted-light);
  background-color: var(--color-surface-hover);
  transform: translateY(-2px);
}

.list-item--selected {
  border-color: var(--color-brand);
  box-shadow: 0 0 0 1px var(--color-brand);
}

.list-item--selected:hover {
  border-color: var(--color-brand-hover);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 0 0 1px var(--color-brand-hover);
}

.list-item__media {
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--picker-border);
  background-color: var(--color-surface-hover);
}

.list-item__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.list-item__title {
  font-family: var(--font-sans);
  font-size: var(--paragraph-size-small);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin: 0;
  line-height: var(--line-height-heading);
}

.list-item__description {
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--color-text-muted);
  margin: 0;
  line-height: var(--line-height-body);
}

.list-item__price-class {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin: 0;
}

.list-item__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--picker-border);
  flex-shrink: 0;
}

.list-item__dot--filled {
  background-color: var(--color-text-primary);
}

.list-item__info {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--color-text-muted);
  text-decoration: underline;
  margin: 0;
  margin-top: auto;
  transition: color 0.2s ease;
}

.list-item__info:hover {
  color: var(--color-brand);
}

.list-item__info-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 50%;
  border: 1px solid currentColor;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
}
</style>
