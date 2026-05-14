<template>
  <div class="configurator-page configurator-type-page">
    <NuxtLink to="/configurator" class="configurator-type-page__back-link"> terug naar het ontwerp </NuxtLink>

    <section class="configurator-main">
      <div class="configurator-main__inner">
        <div class="configurator-type-page__content">
          <BaseHeader size="big" as="h1" align="left" color="primary" class="configurator-type-page__title"> selecteer kasten </BaseHeader>
          <BaseParagraph size="medium" align="left" color="primary" class="configurator-type-page__description"> selecteer hier de kast groep waar je mee wil beginnen </BaseParagraph>

          <p v-if="categoriesError" class="configurator-type-page__error">Kastgroepen laden is mislukt. Probeer de pagina te vernieuwen.</p>
          <div v-else-if="categoriesPending" class="configurator-type-page__radios configurator-type-page__radios--skeleton" aria-busy="true" aria-label="Kastgroepen laden">
            <div v-for="n in 3" :key="n" class="configurator-type-page__radio-skeleton" />
          </div>
          <p v-else-if="typeOptions.length === 0" class="configurator-type-page__empty">Er zijn nog geen kastgroepen beschikbaar.</p>
          <div v-else class="configurator-type-page__radios" role="radiogroup" aria-label="Kast groep">
            <BaseRadioButton v-for="option in typeOptions" :key="option.id" v-model="selectedTypeValue" :name="radioGroupName" :value="option.value" :label="option.label" @hover="onRadioHover" @hover-end="onRadioHoverEnd" />
          </div>

          <div class="configurator-type-page__design">
            <BaseHeader size="small" as="h2" align="left" color="primary" class="configurator-type-page__design-title"> Jouw ontwerp </BaseHeader>
            <BaseParagraph size="small" align="left" color="primary" class="configurator-type-page__design-detail"> Front: {{ frontSummary }} </BaseParagraph>
            <BaseParagraph size="small" align="left" color="primary" class="configurator-type-page__design-detail"> Greep/knop: {{ handleSummary }} </BaseParagraph>
            <BaseParagraph size="small" align="left" color="primary" class="configurator-type-page__design-detail"> Kastkleur: {{ sideSummary }}</BaseParagraph>
            <BaseParagraph size="small" align="left" color="primary" class="configurator-type-page__design-detail"> Plintkleur: {{ plinthSummary }} </BaseParagraph>
            <NuxtLink to="/configurator" class="configurator-type-page__change-link">wijzigen</NuxtLink>
          </div>
        </div>

        <div class="configurator-type-page__media">
          <div class="configurator-type-page__canvas-wrap">
            <div ref="canvasContainerRef" class="configurator-type-page__canvas-host" :class="{ 'configurator-type-page__canvas-host--ready': modelLoaded }" aria-hidden="true" />
            <div v-if="!modelLoaded" class="configurator-type-page__canvas-loading" role="status" aria-live="polite">
              <span class="configurator-type-page__spinner" />
            </div>
          </div>
        </div>
      </div>

      <div class="configurator-main__actions">
        <BaseButtons back-label="Terug" next-label="Volgende" @back="onBack" @next="onNext" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useConfiguratorState } from '../../composables/useConfiguratorState';
import { useCategories } from '../../composables/useCategories';
import { useModelViewer } from '../../composables/useModelViewer';
import { useToast } from '../../composables/useToast';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const canvasContainerRef = ref<HTMLElement | null>(null);

const { plinthSelection, frontSelection, sideSelection, handleSelection } = useConfiguratorState();

function selectionTitle(sel: { title?: string | null } | null | undefined): string {
  const t = sel?.title?.trim();
  return t ? t : '—';
}

const frontSummary = computed(() => selectionTitle(frontSelection.value));
const handleSummary = computed(() => selectionTitle(handleSelection.value));
const sideSummary = computed(() => selectionTitle(sideSelection.value));
const plinthSummary = computed(() => selectionTitle(plinthSelection.value));
const radioGroupName = 'configurator-type';
const selectedTypeValue = ref((route.query.type as string) ?? '');
const previewType = ref<string | null>(null);
const displayType = computed(() => previewType.value ?? selectedTypeValue.value);

const { categories, pending: categoriesPending, error: categoriesError } = useCategories();

/** Radio rows: Strapi `value` drives `type` query (fallback to document id if empty). */
const typeOptions = computed(() =>
  categories.value.map((c) => ({
    id: c.id,
    value: c.value.trim() || c.id,
    label: c.name,
  })),
);

watch(typeOptions, (opts) => {
  if (!opts.length) return;
  const v = selectedTypeValue.value;
  if (v && !opts.some((o) => o.value === v)) {
    selectedTypeValue.value = '';
  }
});

function onRadioHover(value: string) {
  previewType.value = value;
}

function onRadioHoverEnd() {
  previewType.value = null;
}

const { modelLoaded } = useModelViewer(canvasContainerRef, {
  modelPath: '/threecabinets.glb',
  selections: { plinthSelection, frontSelection, sideSelection },
  selectedType: displayType,
});

watch(
  () => route.query.type,
  (type) => {
    selectedTypeValue.value = (type as string) ?? '';
  },
  { immediate: true },
);

function onBack() {
  window.history.back();
}

function onNext() {
  const value = selectedTypeValue.value;
  const option = typeOptions.value.find((o) => o.value === value);
  if (!option || categoriesError.value) {
    toast.warning('Selecteer een kast groep om verder te gaan.');
    return;
  }
  router.replace({ path: '/configurator/type', query: { type: option.value } });
  router.push({
    path: '/configurator/subcategories',
    query: { type: option.value, category: option.id },
  });
}
</script>

<style scoped>
.configurator-type-page {
  position: relative;
  background-color: var(--color-surface);
  padding-top: calc(var(--navbar-height) + 1.5rem);
  padding-bottom: var(--intro-padding-y);
  padding-left: var(--intro-padding-x);
  padding-right: var(--intro-padding-x);
}

.configurator-main {
  padding: 0;
}

.configurator-main__inner {
  max-width: var(--intro-max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: start;
}

.configurator-type-page__back-link {
  position: absolute;
  top: 0;
  right: var(--intro-padding-x);
  font-family: var(--font-sans);
  font-size: var(--paragraph-size-small);
  color: var(--color-text-primary);
  text-decoration: underline;
}

.configurator-type-page__back-link:hover {
  color: var(--color-brand);
}

.configurator-type-page__content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.configurator-type-page__title {
  margin-bottom: 0;
}

.configurator-type-page__description {
  margin-top: 0;
}

.configurator-type-page__radios {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.configurator-type-page__radios :deep(.radio) {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--picker-border);
  border-radius: var(--picker-radius);
  font-size: var(--paragraph-size-medium);
}

.configurator-type-page__radios :deep(.radio:has(.radio__input:checked)) {
  border-color: var(--color-brand);
  background-color: var(--color-surface-hover);
}

.configurator-type-page__error {
  margin: 0;
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--color-danger, #c0392b);
}

.configurator-type-page__empty {
  margin: 0;
  font-family: var(--font-sans);
  font-size: var(--paragraph-size-medium);
  color: var(--color-text-muted);
}

.configurator-type-page__radios--skeleton {
  pointer-events: none;
}

.configurator-type-page__radio-skeleton {
  height: 48px;
  border-radius: var(--picker-radius);
  border: 1px solid var(--picker-border);
  background: linear-gradient(90deg, var(--color-surface-hover) 25%, var(--picker-border) 50%, var(--color-surface-hover) 75%);
  background-size: 200% 100%;
  animation: configurator-type-shimmer 1.4s ease infinite;
}

@keyframes configurator-type-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.configurator-type-page__design {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--picker-border);
}

.configurator-type-page__design-title {
  margin-bottom: 0.75rem;
}

.configurator-type-page__design-detail {
  margin: 0 0 0.35rem;
  font-size: 14px;
}

.configurator-type-page__change-link {
  display: inline-block;
  margin-top: 0.5rem;
  font-family: var(--font-sans);
  font-size: var(--paragraph-size-small);
  color: var(--color-text-primary);
  text-decoration: underline;
}

.configurator-type-page__change-link:hover {
  color: var(--color-brand);
}

.configurator-type-page__media {
  display: flex;
  align-items: center;
  justify-content: center;
}

.configurator-type-page__canvas-wrap {
  position: relative;
  width: 100%;
  max-width: 560px;
  min-height: 360px;
  aspect-ratio: 1 / 1;
  border-radius: var(--picker-radius);
  overflow: hidden;
  background-color: #f5f2ee;
}

.configurator-type-page__canvas-host {
  width: 100%;
  height: 100%;
  visibility: hidden;
  opacity: 0;
}

.configurator-type-page__canvas-host--ready {
  visibility: visible;
  opacity: 1;
}

.configurator-type-page__canvas-host :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
  object-fit: contain;
}

.configurator-type-page__canvas-loading {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: #ffffff;
}

.configurator-type-page__spinner {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 3px solid rgba(26, 54, 93, 0.2);
  border-top-color: var(--color-brand);
  animation: configurator-spin 0.8s linear infinite;
}

@keyframes configurator-spin {
  to {
    transform: rotate(360deg);
  }
}

.configurator-main__actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--picker-border);
}

@media (min-width: 768px) {
  .configurator-type-page {
    padding-top: calc(var(--navbar-height-desktop) + 2rem);
    padding-bottom: var(--intro-padding-y-desktop);
    padding-left: var(--intro-padding-x-desktop);
    padding-right: var(--intro-padding-x-desktop);
  }

  .configurator-main__inner {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: start;
  }

  .configurator-type-page__back-link {
    right: var(--intro-padding-x-desktop);
  }

  .configurator-type-page__canvas-wrap {
    min-height: 460px;
    max-width: 100%;
  }

  .configurator-main__actions {
    margin-top: 2.5rem;
    padding-top: 2.5rem;
  }
}
</style>
