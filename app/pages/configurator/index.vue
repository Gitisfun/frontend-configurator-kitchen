<template>
  <BaseConfiguratorTemplate :title="t('configurator.index.title')" :description="t('configurator.index.description')" title-align="center" :back-label="t('configurator.index.actions.back')" :next-label="t('configurator.index.actions.next')" @back="onBack" @next="onNext">
    <div class="configurator-main__inner">
      <div class="configurator-main__media">
        <div class="configurator-main__canvas-wrap">
          <div ref="canvasContainerRef" class="configurator-main__canvas-host" :class="{ 'configurator-main__canvas-host--ready': modelLoaded }" aria-hidden="true" />
          <img v-if="modelLoaded && handleSelection?.image" :key="handleSelection.id" :src="handleSelection.image" :alt="handleSelection.title ?? ''" class="configurator-main__handle-overlay" aria-hidden="true" />
          <div v-if="!modelLoaded" class="configurator-main__canvas-loading" role="status" aria-live="polite">
            <span class="configurator-main__spinner" />
          </div>
        </div>
      </div>
      <div class="configurator-main__pickers">
        <BasePicker :label="t('configurator.index.pickers.front')" type="color" :value="frontSelection?.image ?? null" :error="showPickerErrors && !frontSelection" :error-message="t('configurator.index.errors.front')" @click="onPickerClick(PICKER_KEY_FRONT)" />
        <BasePicker :label="t('configurator.index.pickers.sidePanel')" type="color" :value="sideSelection?.image ?? null" :error="showPickerErrors && !sideSelection" :error-message="t('configurator.index.errors.sidePanel')" @click="onPickerClick(PICKER_KEY_SIDE_PANEL)" />
        <BasePicker :label="t('configurator.index.pickers.plinth')" type="color" :value="plinthSelection?.image ?? null" :error="showPickerErrors && !plinthSelection" :error-message="t('configurator.index.errors.plinth')" @click="onPickerClick(PICKER_KEY_PLINTH)" />
        <BasePicker
          :label="t('configurator.index.pickers.handle')"
          type="image"
          :value="handleSelection?.image ? { src: handleSelection.image, alt: handleSelection.title } : null"
          :error="showPickerErrors && !handleSelection"
          :error-message="t('configurator.index.errors.handle')"
          @click="onPickerClick(PICKER_KEY_HANDLE)"
        />
      </div>
    </div>
  </BaseConfiguratorTemplate>

  <PanelsPlinth v-model="plinthPanelOpen" v-model:selection="plinthSelection" />
  <PanelsFront v-model="frontPanelOpen" v-model:selection="frontSelection" />
  <PanelsSide v-model="sidePanelOpen" v-model:selection="sideSelection" />
  <PanelsHandle v-model="handlePanelOpen" v-model:selection="handleSelection" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCabinetViewer } from '../../composables/useCabinetViewer';
import { useConfiguratorState } from '../../composables/useConfiguratorState';
import { useToast } from '../../composables/useToast';
import { PICKER_KEY_PLINTH, PICKER_KEY_FRONT, PICKER_KEY_SIDE_PANEL, PICKER_KEY_HANDLE } from '../../constants/configurator';

const { t } = useI18n();
const router = useRouter();
const canvasContainerRef = ref<HTMLElement | null>(null);
const showPickerErrors = ref(false);
const toast = useToast();

const { plinthPanelOpen, plinthSelection, frontPanelOpen, frontSelection, sidePanelOpen, sideSelection, handlePanelOpen, handleSelection, onPickerClick } = useConfiguratorState();

const { modelLoaded } = useCabinetViewer(canvasContainerRef, {
  plinthSelection,
  frontSelection,
  sideSelection,
});

function onBack() {
  router.replace('/');
}

function onNext() {
  const missing: string[] = [];
  if (!frontSelection.value) missing.push(t('configurator.index.validation.missingFront'));
  if (!sideSelection.value) missing.push(t('configurator.index.validation.missingSidePanel'));
  if (!plinthSelection.value) missing.push(t('configurator.index.validation.missingPlinth'));
  if (!handleSelection.value) missing.push(t('configurator.index.validation.missingHandle'));

  if (missing.length > 0) {
    showPickerErrors.value = true;
    toast.warning(t('configurator.index.validation.toastMessage', { list: missing.join(', ') }), {
      title: t('configurator.index.validation.toastTitle'),
    });
    return;
  }
  showPickerErrors.value = false;
  router.push('/configurator/type');
}
</script>

<style scoped>
.configurator-main__inner {
  max-width: var(--intro-max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: start;
}

.configurator-main__media {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.configurator-main__canvas-wrap {
  position: relative;
  width: 100%;
  max-width: 480px;
  aspect-ratio: 4 / 3;
  border-radius: var(--picker-radius);
  overflow: hidden;
  background-color: var(--color-surface);
}

.configurator-main__canvas-host {
  width: 100%;
  height: 100%;
  visibility: hidden;
  opacity: 0;
}

.configurator-main__canvas-host--ready {
  visibility: visible;
  opacity: 1;
}

.configurator-main__canvas-host :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
  object-fit: contain;
}

.configurator-main__handle-overlay {
  position: absolute;
  top: 52%;
  left: 30%;
  width: 13%;
  height: auto;
  transform: translate(-50%, -50%);
  transform-origin: center center;
  pointer-events: none;
  user-select: none;
  filter: drop-shadow(0 0.5px 0.5px rgba(255, 255, 255, 0.45)) drop-shadow(0 1px 1px rgba(0, 0, 0, 0.18)) drop-shadow(0 3px 6px rgba(0, 0, 0, 0.22)) drop-shadow(0 6px 12px rgba(0, 0, 0, 0.12));
  animation: handle-overlay-in 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: transform, filter;
  z-index: 1;
}

@keyframes handle-overlay-in {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.85);
    filter: drop-shadow(0 0 0 transparent);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.configurator-main__canvas-loading {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: var(--color-surface);
}

.configurator-main__spinner {
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

.configurator-main__pickers {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .configurator-main__inner {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
  }

  .configurator-main__media {
    order: 1;
  }

  .configurator-main__canvas-wrap {
    max-width: 100%;
  }

  .configurator-main__pickers {
    order: 2;
    gap: 1rem;
  }
}
</style>
