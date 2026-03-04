<template>
  <span
    :class="[
      'badge',
      `badge--${variant}`,
      `badge--${size}`,
    ]"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'muted' | 'brand' | 'info' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium';
}

withDefaults(defineProps<Props>(), {
  variant: 'muted',
  size: 'medium',
});
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: var(--font-sans);
  border-radius: 999px;
  letter-spacing: var(--letter-spacing-body);
  white-space: nowrap;
  line-height: 1;
}

/* Sizes */
.badge--small {
  font-size: 12px;
  padding: 0.15rem 0.6rem;
}

.badge--medium {
  font-size: var(--paragraph-size-small);
  padding: 0.25rem 0.75rem;
}

/* Variants */
.badge--muted {
  color: var(--color-text-muted);
  background: var(--color-surface-hover);
}

.badge--brand {
  color: var(--color-brand);
  background: var(--color-success-muted);
}

.badge--info {
  color: var(--color-info);
  background: var(--color-info-muted);
}

.badge--success {
  color: var(--color-success);
  background: var(--color-success-muted);
}

.badge--warning {
  color: var(--color-warning);
  background: var(--color-warning-muted);
}

.badge--error {
  color: var(--color-error);
  background: rgba(197, 48, 48, 0.08);
}
</style>
