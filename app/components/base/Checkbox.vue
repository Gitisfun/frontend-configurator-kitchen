<template>
  <label class="checkbox">
    <input
      type="checkbox"
      class="checkbox__input"
      :checked="isChecked"
      :value="value"
      :disabled="disabled"
      :aria-label="ariaLabel"
      @change="onChange"
    />
    <span class="checkbox__label">
      <slot />
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  /** When used with array v-model: this checkbox's value */
  value?: string;
  /** When used with array v-model: current array of selected values */
  modelValue?: string[];
  /** When used with boolean v-model: checked state (use value + modelValue array OR checked alone) */
  checked?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  value: undefined,
  modelValue: () => [],
  checked: undefined,
  disabled: false,
  ariaLabel: undefined,
});

const emit = defineEmits<{
  'update:modelValue': [payload: string[]];
  'update:checked': [payload: boolean];
}>();

const isArrayMode = computed(() => props.value !== undefined && Array.isArray(props.modelValue));

const isChecked = computed(() => {
  if (props.checked !== undefined) return props.checked;
  if (isArrayMode.value && props.value !== undefined) return props.modelValue!.includes(props.value);
  return false;
});

function onChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (isArrayMode.value && props.value !== undefined) {
    const next = target.checked
      ? [...(props.modelValue ?? []), props.value]
      : (props.modelValue ?? []).filter((v) => v !== props.value);
    emit('update:modelValue', next);
  } else {
    emit('update:checked', target.checked);
  }
}
</script>

<style scoped>
.checkbox {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  cursor: pointer;
  font-family: var(--font-sans);
  font-size: var(--paragraph-size-small);
  color: var(--color-text-primary);
  padding: var(--picker-padding-y) var(--picker-padding-x);
  border: 1px solid var(--picker-border);
  border-radius: var(--picker-radius);
  background-color: var(--color-surface);
}

.checkbox:hover {
  background-color: var(--color-surface-hover);
}

.checkbox__input {
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
  accent-color: var(--color-brand);
}

.checkbox__label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex: 1;
  min-width: 0;
}

/* Push the last element in the slot (e.g. info icon) to the end; text nodes don't count as elements */
.checkbox__label :deep(*:last-child) {
  margin-left: auto;
}
</style>
