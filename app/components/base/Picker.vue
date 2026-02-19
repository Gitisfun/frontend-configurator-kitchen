<template>
  <button type="button" :disabled="disabled" :class="pickerClasses" :aria-label="ariaLabel" @click="handleClick">
    <span class="picker__label">{{ label }}</span>
    <span class="picker__value">
      <slot name="value">
        <span v-if="type === 'color'" class="picker__swatch" :style="swatchStyle" />
        <span v-else-if="type === 'text'" class="picker__text">{{ value }}</span>
        <img v-else-if="type === 'image' && imageSrc" :src="imageSrc" :alt="imageAlt" class="picker__image" />
      </slot>
    </span>
    <span class="picker__chevron">
      <slot name="iconRight">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M4.5 3L8 6L4.5 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  /** Label shown on the left (e.g. "Plinth Color") */
  label: string;
  /** Type of value display */
  type?: 'color' | 'text' | 'image';
  /** Value: hex string for color, text for text, URL for image. For image, can pass object { src, alt? } */
  value?: string | { src: string; alt?: string };
  /** Visual selected state (e.g. brand border) */
  selected?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  className?: string;
}

interface Emits {
  (e: 'click', event: MouseEvent): void;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  selected: false,
  disabled: false,
  fullWidth: true,
  size: 'medium',
});

const emit = defineEmits<Emits>();

const pickerClasses = computed(() => ['picker', `picker--${props.size}`, props.fullWidth ? 'picker--full-width' : '', props.selected ? 'picker--selected' : '', props.disabled ? 'picker--disabled' : '', props.className ?? ''].filter(Boolean));

const imageSrc = computed(() => {
  if (props.type !== 'image' || props.value == null) return '';
  return typeof props.value === 'string' ? props.value : props.value.src;
});

const imageAlt = computed(() => {
  if (props.type !== 'image' || props.value == null) return '';
  return typeof props.value === 'object' && props.value.alt != null ? props.value.alt : '';
});

const swatchStyle = computed(() => {
  if (props.type !== 'color' || props.value == null) return {};
  const hex = typeof props.value === 'string' ? props.value : '#e0e0e0';
  return { backgroundColor: hex };
});

const ariaLabel = computed(() => {
  const label = props.label;
  if (props.type === 'color' && props.value) {
    return `Choose ${label}, currently ${props.value}`;
  }
  if (props.type === 'text' && props.value) {
    return `Choose ${label}, currently ${props.value}`;
  }
  return `Choose ${label}`;
});

function handleClick(event: MouseEvent) {
  if (!props.disabled) {
    emit('click', event);
  }
}
</script>

<style scoped>
.picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--picker-gap);
  padding: var(--picker-padding-y) var(--picker-padding-x);
  background-color: var(--picker-bg);
  border: 1px solid var(--picker-border);
  border-radius: var(--picker-radius);
  font-family: var(--font-sans);
  text-align: left;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.picker:hover:not(.picker--disabled) {
  background-color: var(--picker-bg-hover);
}

.picker:focus {
  outline: var(--picker-focus-ring);
  outline-offset: var(--picker-focus-offset);
}

.picker:focus:not(:focus-visible) {
  outline: none;
}

.picker--full-width {
  width: 100%;
}

.picker--selected {
  border-color: var(--color-brand);
}

.picker--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.picker__label {
  flex-shrink: 0;
  font-size: var(--picker-label-font-size);
  font-weight: var(--font-weight-medium);
  color: var(--picker-label-color);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.picker__value {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
}

.picker__text {
  font-size: var(--picker-value-font-size);
  color: var(--picker-value-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.picker__swatch {
  width: var(--picker-swatch-size);
  height: var(--picker-swatch-size);
  border-radius: 50%;
  border: 1px solid var(--picker-border);
  flex-shrink: 0;
}

.picker__image {
  width: var(--picker-image-size);
  height: var(--picker-image-size);
  object-fit: cover;
  border-radius: var(--picker-radius);
  border: 1px solid var(--picker-border);
  flex-shrink: 0;
}

.picker__chevron {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--picker-label-color);
}

@media (min-width: 768px) {
  .picker {
    padding: var(--picker-padding-y-desktop) var(--picker-padding-x-desktop);
  }

  .picker__label {
    font-size: var(--picker-label-font-size-desktop);
  }

  .picker__text {
    font-size: var(--picker-value-font-size-desktop);
  }

  .picker__swatch {
    width: var(--picker-swatch-size-desktop);
    height: var(--picker-swatch-size-desktop);
  }

  .picker__image {
    width: var(--picker-image-size-desktop);
    height: var(--picker-image-size-desktop);
  }
}
</style>
