<template>
  <div v-if="toasts.length > 0" class="toast-container" role="region" aria-label="Notifications">
    <BaseToast
      v-for="toast in toasts"
      :key="toast.id"
      :type="toast.type"
      :message="toast.message"
      :title="toast.title"
      :dismissible="toast.dismissible !== false"
      @close="dismiss(toast.id)"
    />
  </div>
</template>

<script setup lang="ts">
import { useToast } from '../../composables/useToast';

const { toasts, dismiss } = useToast();
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: var(--toast-z-index, 1100);
  display: flex;
  flex-direction: column;
  gap: var(--toast-gap, 0.75rem);
  pointer-events: none;
}

.toast-container :deep(.toast) {
  pointer-events: auto;
}

@media (min-width: 768px) {
  .toast-container {
    bottom: 2rem;
    right: 2rem;
  }
}
</style>
