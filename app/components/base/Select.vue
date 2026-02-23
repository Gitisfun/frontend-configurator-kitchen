<template>
  <div ref="rootRef" class="select-wrap">
    <button
      type="button"
      :disabled="disabled"
      :aria-label="ariaLabel"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-controls="listboxId"
      class="select-trigger"
      @click="toggle"
    >
      <span class="select-trigger__label">{{ selectedLabel }}</span>
      <span class="select-trigger__arrow" :class="{ 'select-trigger__arrow--open': isOpen }" aria-hidden="true">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
    </button>
    <Transition name="dropdown">
      <ul
        v-show="isOpen"
        :id="listboxId"
        role="listbox"
        :aria-label="ariaLabel"
        class="select-list"
        tabindex="-1"
      >
        <li
          v-for="opt in options"
          :key="opt.value"
          role="option"
          :aria-selected="modelValue === opt.value"
          class="select-list__item"
          :class="{ 'select-list__item--selected': modelValue === opt.value }"
          @click="choose(opt)"
        >
          {{ opt.label }}
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

export interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  modelValue: string;
  options: SelectOption[];
  /** Accessible label (e.g. "Breedte") */
  label?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  fullWidth: true,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const listboxId = `select-listbox-${Math.random().toString(36).slice(2, 9)}`;
const rootRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);

const ariaLabel = computed(() => props.label ?? '');
const selectedLabel = computed(() => {
  const opt = props.options.find((o) => o.value === props.modelValue);
  return opt?.label ?? props.options[0]?.label ?? '';
});

function toggle() {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
}

function choose(opt: SelectOption) {
  emit('update:modelValue', opt.value);
  isOpen.value = false;
}

function onDocumentClick(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
}

function onKeydown(e: KeyboardEvent) {
  if (!isOpen.value) return;
  if (e.key === 'Escape') {
    isOpen.value = false;
    (e.target as HTMLElement).blur();
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick, true);
  document.addEventListener('keydown', onKeydown);
});

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick, true);
  document.removeEventListener('keydown', onKeydown);
});
</script>

<style scoped>
.select-wrap {
  position: relative;
  width: 100%;
}

.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-family: var(--font-sans);
  font-size: var(--picker-value-font-size);
  color: var(--color-text-primary);
  background-color: var(--picker-bg);
  border: 1px solid var(--picker-border);
  border-radius: var(--picker-radius);
  padding: var(--picker-padding-y) var(--picker-padding-x);
  cursor: pointer;
  text-align: left;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.select-trigger:hover:not(:disabled) {
  border-color: var(--color-text-muted-light);
}

.select-trigger:focus {
  outline: none;
  border-color: var(--color-text-muted-light);
  box-shadow: 0 0 0 2px var(--picker-focus-ring);
}

.select-trigger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.select-trigger__label {
  flex: 1;
  min-width: 0;
}

.select-trigger__arrow {
  flex-shrink: 0;
  margin-left: 0.5rem;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

/* Closed: arrow points down (default). Open: rotate to point up */
.select-trigger__arrow--open {
  transform: rotate(180deg);
}

.select-list {
  position: absolute;
  z-index: 50;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  background-color: var(--color-surface);
  border: 1px solid var(--picker-border);
  border-radius: var(--picker-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 240px;
  overflow-y: auto;
}

.select-list__item {
  padding: var(--picker-padding-y) var(--picker-padding-x);
  font-family: var(--font-sans);
  font-size: var(--picker-value-font-size);
  color: var(--color-text-primary);
  cursor: pointer;
  border-bottom: 1px solid var(--picker-border);
  transition: background-color 0.15s ease;
}

.select-list__item:last-child {
  border-bottom: none;
}

.select-list__item:hover {
  background-color: var(--color-surface-hover);
}

.select-list__item--selected {
  font-weight: var(--font-weight-medium);
  background-color: var(--color-surface-hover);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (min-width: 768px) {
  .select-trigger {
    font-size: var(--picker-value-font-size-desktop);
    padding: var(--picker-padding-y-desktop) var(--picker-padding-x-desktop);
  }

  .select-list__item {
    font-size: var(--picker-value-font-size-desktop);
    padding: var(--picker-padding-y-desktop) var(--picker-padding-x-desktop);
  }
}
</style>
