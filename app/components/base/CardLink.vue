<template>
  <NuxtLink :to="to" class="card-link">
    <div class="card-link__content">
      <div v-if="$slots.icon" class="card-link__icon">
        <slot name="icon" />
      </div>
      <div class="card-link__text">
        <BaseHeader size="small" as="h2" align="left" color="primary" class="card-link__title">
          {{ title }}
        </BaseHeader>
        <BaseParagraph v-if="description" size="small" align="left" color="muted" class="card-link__description">
          {{ description }}
        </BaseParagraph>
      </div>
    </div>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="card-link__arrow" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Props {
  to: string;
  title: string;
  description?: string;
}

withDefaults(defineProps<Props>(), {
  description: undefined,
});
</script>

<style scoped>
.card-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: var(--color-surface-hover);
  border: 1px solid var(--picker-border);
  border-radius: var(--panel-radius);
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.card-link:hover {
  border-color: var(--color-text-muted-light);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--color-text-primary) 8%, transparent);
  background: var(--color-surface);
}

.card-link:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-surface), 0 0 0 4px var(--color-brand);
}

.card-link__content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.card-link__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: var(--button-radius-rounded);
  background: var(--color-surface);
  border: 1px solid var(--picker-border);
  color: var(--color-text-primary);
}

.card-link__text {
  min-width: 0;
}

.card-link__title {
  margin-bottom: 0;
}

.card-link__description {
  margin: 0;
}

.card-link__arrow {
  flex-shrink: 0;
  color: var(--color-text-muted);
  transition: transform 0.2s ease;
}

.card-link:hover .card-link__arrow {
  transform: translateX(3px);
}
</style>
