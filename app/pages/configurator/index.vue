<template>
  <div class="configurator-page">
    <header class="configurator-header">
      <BaseHeader size="big" as="h1" align="center" color="primary" class="configurator-header__title"> Customize Your Cabinet </BaseHeader>
      <BaseParagraph size="medium" align="center" color="primary" class="configurator-header__description"> Select colors and handle styles to create your perfect kitchen piece. </BaseParagraph>
    </header>

    <section class="configurator-main">
      <div class="configurator-main__inner">
        <div class="configurator-main__media">
          <div v-if="canvasMounted" ref="canvasContainerRef" class="configurator-main__canvas-wrap" aria-hidden="true" />
        </div>
        <div class="configurator-main__pickers">
          <BasePicker :label="PICKER_LABEL_FRONT" type="color" :value="frontSelection?.image ?? null" :error="showPickerErrors && !frontSelection" error-message="Please select a front color" @click="onPickerClick(PICKER_KEY_FRONT)" />
          <BasePicker :label="PICKER_LABEL_SIDE_PANEL" type="color" :value="sideSelection?.image ?? null" :error="showPickerErrors && !sideSelection" error-message="Please select a side panel" @click="onPickerClick(PICKER_KEY_SIDE_PANEL)" />
          <BasePicker :label="PICKER_LABEL_PLINTH" type="color" :value="plinthSelection?.image ?? null" :error="showPickerErrors && !plinthSelection" error-message="Please select a plinth color" @click="onPickerClick(PICKER_KEY_PLINTH)" />
          <BasePicker :label="PICKER_LABEL_HANDLE" type="text" :value="handleSelection?.title ?? null" :error="showPickerErrors && !handleSelection" error-message="Please select a handle type" @click="onPickerClick(PICKER_KEY_HANDLE)" />
        </div>
        <div class="configurator-main__actions">
          <BaseButtons back-label="Back" next-label="Next" @back="onBack" @next="onNext" />
        </div>
      </div>
    </section>

    <PanelsPlinth v-model="plinthPanelOpen" v-model:selection="plinthSelection" />
    <PanelsFront v-model="frontPanelOpen" v-model:selection="frontSelection" />
    <PanelsSide v-model="sidePanelOpen" v-model:selection="sideSelection" />
    <PanelsHandle v-model="handlePanelOpen" v-model:selection="handleSelection" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCabinetViewer } from '../../composables/useCabinetViewer';
import { useConfiguratorState } from '../../composables/useConfiguratorState';
import { useToast } from '../../composables/useToast';
import { PICKER_KEY_PLINTH, PICKER_KEY_FRONT, PICKER_KEY_SIDE_PANEL, PICKER_KEY_HANDLE, PICKER_LABEL_PLINTH, PICKER_LABEL_FRONT, PICKER_LABEL_SIDE_PANEL, PICKER_LABEL_HANDLE } from '../../constants/configurator';

const router = useRouter();
const canvasContainerRef = ref<HTMLElement | null>(null);
const showPickerErrors = ref(false);
const toast = useToast();

const { plinthPanelOpen, plinthSelection, frontPanelOpen, frontSelection, sidePanelOpen, sideSelection, handlePanelOpen, handleSelection, onPickerClick } = useConfiguratorState();

const { canvasMounted } = useCabinetViewer(canvasContainerRef, {
  plinthSelection,
  frontSelection,
  sideSelection,
});

function onBack() {
  // TODO: go to previous step or navigate back
  window.history.back();
}

function onNext() {
  const missing: string[] = [];
  if (!frontSelection.value) missing.push('Front color');
  if (!sideSelection.value) missing.push('Side panel');
  if (!plinthSelection.value) missing.push('Plinth color');
  if (!handleSelection.value) missing.push('Handle type');

  if (missing.length > 0) {
    showPickerErrors.value = true;
    toast.warning(`Please fill in the missing options: ${missing.join(', ')}.`, {
      title: 'Missing required fields',
    });
    return;
  }
  showPickerErrors.value = false;
  router.push('/configurator/type');
}
</script>

<style scoped>
.configurator-page {
  background-color: var(--color-surface);
  padding-top: calc(var(--navbar-height) + 1.5rem);
  padding-bottom: var(--intro-padding-y);
  padding-left: var(--intro-padding-x);
  padding-right: var(--intro-padding-x);
}

.configurator-header {
  padding: 0 0 2rem;
  text-align: center;
}

.configurator-header__title {
  margin-bottom: 0.75rem;
}

.configurator-header__description {
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0;
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

.configurator-main__media {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.configurator-main__canvas-wrap {
  width: 100%;
  max-width: 480px;
  aspect-ratio: 4 / 3;
  border-radius: var(--picker-radius);
  overflow: hidden;
  background-color: #f5f2ee;
}

.configurator-main__canvas-wrap :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
  object-fit: contain;
}

.configurator-main__hint {
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--color-text-muted);
  margin: 0;
}

.configurator-main__pickers {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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
  .configurator-page {
    padding-top: calc(var(--navbar-height-desktop) + 2rem);
    padding-bottom: var(--intro-padding-y-desktop);
    padding-left: var(--intro-padding-x-desktop);
    padding-right: var(--intro-padding-x-desktop);
  }

  .configurator-header {
    padding: 0 0 3rem;
  }

  .configurator-main {
    padding: 0;
  }

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

  .configurator-main__actions {
    order: 3;
    grid-column: 1 / -1;
    margin-top: 2.5rem;
    padding-top: 2.5rem;
  }
}
</style>
