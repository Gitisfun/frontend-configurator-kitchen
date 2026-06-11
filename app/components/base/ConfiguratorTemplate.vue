<template>
  <div class="configurator-template">
    <slot name="before" />

    <header v-if="title || description" class="configurator-template__header" :class="`configurator-template__header--${titleAlign}`">
      <BaseHeader v-if="title" size="big" as="h1" :align="titleAlign" color="primary" class="configurator-template__title">
        {{ title }}
      </BaseHeader>
      <BaseParagraph v-if="description" size="medium" :align="titleAlign" color="primary" class="configurator-template__description">
        {{ description }}
      </BaseParagraph>
    </header>

    <section class="configurator-template__main">
      <slot />

      <div v-if="showActions" class="configurator-template__actions">
        <slot name="actions">
          <BaseButtons :back-label="backLabel" :next-label="nextLabel" :show-next="showNext" @back="handleBack" @next="emit('next')" />
        </slot>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

interface Props {
  title?: string;
  description?: string;
  titleAlign?: 'left' | 'center';
  backTo?: RouteLocationRaw;
  backLabel?: string;
  nextLabel?: string;
  showActions?: boolean;
  showNext?: boolean;
}

const emit = defineEmits<{
  back: [];
  next: [];
}>();

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  titleAlign: 'left',
  backLabel: 'Terug',
  nextLabel: 'Volgende',
  showActions: true,
  showNext: true,
});

const router = useRouter();

function handleBack() {
  if (props.backTo) {
    router.push(props.backTo);
    return;
  }

  emit('back');
}
</script>

<style scoped>
.configurator-template {
  position: relative;
  background-color: var(--color-surface);
  padding-top: calc(var(--navbar-height) + 1.5rem);
  padding-bottom: var(--intro-padding-y);
  padding-left: var(--intro-padding-x);
  padding-right: var(--intro-padding-x);
}

.configurator-template__header {
  max-width: var(--intro-max-width);
  margin: 0 auto;
  padding: 0 0 2rem;
}

.configurator-template__header--center {
  text-align: center;
}

.configurator-template__title {
  margin-bottom: 0;
}

.configurator-template__description {
  max-width: 560px;
  margin-top: 0.75rem;
  margin-bottom: 0;
}

.configurator-template__header--center .configurator-template__description {
  margin-left: auto;
  margin-right: auto;
}

.configurator-template__main {
  padding: 0;
}

.configurator-template__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  max-width: var(--intro-max-width);
  margin: 2rem auto 0;
  padding-top: 2rem;
  border-top: 1px solid var(--picker-border);
}

@media (min-width: 768px) {
  .configurator-template {
    padding-top: calc(var(--navbar-height-desktop) + 2rem);
    padding-bottom: var(--intro-padding-y-desktop);
    padding-left: var(--intro-padding-x-desktop);
    padding-right: var(--intro-padding-x-desktop);
  }

  .configurator-template__header {
    padding-bottom: 3rem;
  }

  .configurator-template__actions {
    margin-top: 2.5rem;
    padding-top: 2.5rem;
  }
}
</style>
