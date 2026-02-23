<template>
  <div class="textfield" :style="wrapperStyle">
    <label v-if="label" :for="inputId" class="textfield__label">{{ label }}</label>
    <input
      :id="inputId"
      type="text"
      class="textfield__input"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-label="ariaLabel ?? label ?? placeholder"
      @input="onInput"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: string;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  ariaLabel?: string;
  /** e.g. '320px' or '100%' */
  maxWidth?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: undefined,
  label: undefined,
  disabled: false,
  ariaLabel: undefined,
  maxWidth: undefined,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const inputId = computed(() => `textfield-${Math.random().toString(36).slice(2, 9)}`);

const wrapperStyle = computed(() =>
  props.maxWidth ? { maxWidth: props.maxWidth } : undefined
);

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value);
}
</script>

<style scoped>
.textfield {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.textfield__label {
  font-family: var(--font-sans);
  font-size: var(--picker-label-font-size);
  color: var(--color-text-muted);
}

.textfield__input {
  font-family: var(--font-sans);
  font-size: var(--picker-value-font-size);
  color: var(--color-text-primary);
  background-color: var(--picker-bg);
  border: 1px solid var(--picker-border);
  border-radius: var(--picker-radius);
  padding: var(--picker-padding-y) var(--picker-padding-x);
  width: 100%;
}

.textfield__input::placeholder {
  color: var(--color-text-muted);
}

.textfield__input:focus {
  outline: none;
  border-color: var(--color-text-muted-light);
  box-shadow: 0 0 0 2px var(--picker-focus-ring);
}

.textfield__input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (min-width: 768px) {
  .textfield__input {
    font-size: var(--picker-value-font-size-desktop);
    padding: var(--picker-padding-y-desktop) var(--picker-padding-x-desktop);
  }
}
</style>
