<template>
  <div
    :class="toastClasses"
    role="alert"
    :aria-live="type === 'error' ? 'assertive' : 'polite'"
    aria-atomic="true"
  >
    <span class="toast__icon" aria-hidden="true">
      <component :is="iconComponent" />
    </span>
    <div class="toast__content">
      <p v-if="title" class="toast__title">{{ title }}</p>
      <p class="toast__message">{{ message }}</p>
    </div>
    <button
      v-if="dismissible"
      type="button"
      class="toast__close"
      aria-label="Close"
      @click="$emit('close')"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue';
import type { ToastType } from '../../composables/useToast';

interface Props {
  type: ToastType;
  message: string;
  title?: string;
  dismissible?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  dismissible: true,
});

defineEmits<{
  close: [];
}>();

const toastClasses = computed(() => [
  'toast',
  `toast--${props.type}`,
]);

const iconComponent = computed(() => {
  const color = `var(--color-${props.type})`;
  const icons = {
    success: () => h('svg', { width: 20, height: 20, viewBox: '0 0 20 20', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, [
      h('path', { d: 'M16.667 5L7.5 14.167 3.333 10', stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
    ]),
    info: () => h('svg', { width: 20, height: 20, viewBox: '0 0 20 20', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, [
      h('path', { d: 'M10 6v2M10 14h.01', stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round' }),
      h('circle', { cx: 10, cy: 10, r: 8, stroke: color, 'stroke-width': 2 }),
    ]),
    warning: () => h('svg', { width: 20, height: 20, viewBox: '0 0 20 20', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, [
      h('path', { d: 'M10 7v4M10 14h.01', stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round' }),
      h('path', { d: 'M2 16l8-14 8 14H2z', stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
    ]),
    error: () => h('svg', { width: 20, height: 20, viewBox: '0 0 20 20', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, [
      h('path', { d: 'M15 5L5 15M5 5l10 10', stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round' }),
    ]),
  };
  return icons[props.type];
});
</script>

<style scoped>
.toast {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: var(--toast-padding-y, 0.875rem) var(--toast-padding-x, 1rem);
  border-radius: var(--toast-radius, 8px);
  box-shadow: var(--toast-shadow, 0 4px 12px rgba(27, 58, 92, 0.15));
  font-family: var(--font-sans);
  text-align: left;
  min-width: 280px;
  max-width: 420px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.toast__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-top: 0.125rem;
}

.toast__content {
  flex: 1;
  min-width: 0;
}

.toast__title {
  margin: 0 0 0.25rem;
  font-size: var(--toast-title-font-size, 13px);
  font-weight: var(--font-weight-medium);
  line-height: 1.3;
  color: inherit;
}

.toast__message {
  margin: 0;
  font-size: var(--toast-font-size, 14px);
  line-height: 1.5;
  color: inherit;
}

.toast__close {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin: -0.25rem -0.25rem -0.25rem 0;
  padding: 0;
  border: none;
  background: transparent;
  color: inherit;
  opacity: 0.7;
  cursor: pointer;
  border-radius: 4px;
  transition: opacity 0.2s ease;
}

.toast__close:hover {
  opacity: 1;
}

.toast__close:focus {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.toast__close:focus:not(:focus-visible) {
  outline: none;
}

/* Success */
.toast--success {
  background-color: var(--color-success-muted, #e6f5ee);
  color: var(--color-text-primary);
  border-left: 4px solid var(--color-success);
}

/* Info */
.toast--info {
  background-color: var(--color-info-muted, #e8eef4);
  color: var(--color-text-primary);
  border-left: 4px solid var(--color-info);
}

/* Warning */
.toast--warning {
  background-color: var(--color-warning-muted, #faf3e6);
  color: var(--color-text-primary);
  border-left: 4px solid var(--color-warning);
}

/* Error */
.toast--error {
  background-color: var(--color-error-muted, #fde8e8);
  color: var(--color-text-primary);
  border-left: 4px solid var(--color-error);
}

@media (min-width: 768px) {
  .toast {
    padding: var(--toast-padding-y-desktop, 1rem) var(--toast-padding-x-desktop, 1.25rem);
  }

  .toast__title {
    font-size: var(--toast-title-font-size-desktop, 14px);
  }

  .toast__message {
    font-size: var(--toast-font-size-desktop, 15px);
  }
}
</style>
