<template>
  <div class="numberfield">
    <label v-if="label" :for="inputId" class="numberfield__label">{{ label }}</label>
    <input
      :id="inputId"
      type="number"
      class="numberfield__input"
      :value="modelValue"
      :min="min"
      :max="max"
      :disabled="disabled"
      :aria-label="ariaLabel ?? label"
      @input="onInput"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: number;
  label?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  min: undefined,
  max: undefined,
  disabled: false,
  ariaLabel: undefined,
});

const emit = defineEmits<{
  'update:modelValue': [value: number];
}>();

const inputId = computed(() => `numberfield-${Math.random().toString(36).slice(2, 9)}`);

function onInput(e: Event) {
  const val = (e.target as HTMLInputElement).valueAsNumber;
  const num = Number.isNaN(val) ? props.min ?? 0 : val;
  emit('update:modelValue', num);
}
</script>

<style scoped>
.numberfield {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.numberfield__label {
  font-family: var(--font-sans);
  font-size: var(--picker-label-font-size);
  color: var(--color-text-muted);
}

.numberfield__input {
  font-family: var(--font-sans);
  font-size: var(--picker-value-font-size);
  color: var(--color-text-primary);
  background-color: var(--picker-bg);
  border: 1px solid var(--picker-border);
  border-radius: var(--picker-radius);
  padding: var(--picker-padding-y) var(--picker-padding-x);
  width: 4.5rem;
  text-align: center;
}

.numberfield__input:focus {
  outline: none;
  border-color: var(--color-text-muted-light);
  box-shadow: 0 0 0 2px var(--picker-focus-ring);
}

.numberfield__input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (min-width: 768px) {
  .numberfield__input {
    font-size: var(--picker-value-font-size-desktop);
    padding: var(--picker-padding-y-desktop) var(--picker-padding-x-desktop);
  }
}
</style>
