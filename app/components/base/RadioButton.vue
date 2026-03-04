<template>
  <label
    class="radio"
    @mouseenter="emit('hover', value)"
    @mouseleave="emit('hoverEnd')"
  >
    <input type="radio" class="radio__input" :name="name" :value="value" :checked="modelValue === value" :disabled="disabled" :aria-label="ariaLabel ?? label" @change="emit('update:modelValue', value)" />
    <span class="radio__label">{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string;
  value: string;
  label: string;
  /** Group name for radio buttons; required when multiple options share the same v-model */
  name?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

withDefaults(defineProps<Props>(), {
  name: undefined,
  disabled: false,
  ariaLabel: undefined,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'hover': [value: string];
  'hoverEnd': [];
}>();
</script>

<style scoped>
.radio {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-family: var(--font-sans);
  font-size: var(--paragraph-size-small);
  color: var(--color-text-primary);
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.radio:hover {
  background-color: var(--color-surface-hover);
}

.radio__input {
  width: 1.125rem;
  height: 1.125rem;
  accent-color: var(--color-brand);
}
.radio__label {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.radio:has(.radio__input:disabled) {
  opacity: 0.6;
  cursor: not-allowed;
}
.radio:has(.radio__input:disabled):hover {
  background-color: transparent;
}
</style>
