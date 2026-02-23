<template>
  <div class="configurator-page">
    <header class="configurator-header">
      <BaseHeader size="big" as="h1" align="center" color="primary" class="configurator-header__title"> Customize Your Cabinet </BaseHeader>
      <BaseParagraph size="medium" align="center" color="primary" class="configurator-header__description"> Select colors and handle styles to create your perfect kitchen piece. </BaseParagraph>
    </header>

    <section class="configurator-main">
      <div class="configurator-main__inner">
        <div class="configurator-main__media">
          <img src="/placeholder.png" alt="Kitchen cabinet preview" class="configurator-main__image" />
          <p class="configurator-main__hint">Drag to rotate • Colors update live</p>
        </div>
        <div class="configurator-main__pickers">
          <BasePicker label="Plinth Color" type="color" :value="plinthColor" @click="onPickerClick('plinth')" />
          <BasePicker label="Door Color" type="color" :value="doorColor" @click="onPickerClick('door')" />
          <BasePicker label="Side Panel" type="color" :value="sidePanelColor" @click="onPickerClick('sidePanel')" />
          <BasePicker label="Handle Type" type="text" :value="handleType" @click="onPickerClick('handle')" />
        </div>
        <div class="configurator-main__actions">
          <BaseButtons back-label="Back" next-label="Next" @back="onBack" @next="onNext" />
        </div>
      </div>
    </section>

    <PanelsPlinth v-model="plinthPanelOpen" v-model:color="plinthColor" />
    <PanelsFront v-model="doorPanelOpen" v-model:color="doorColor" />
    <PanelsSide v-model="sidePanelOpen" v-model:color="sidePanelColor" />
    <PanelsHandle v-model="handlePanelOpen" v-model:value="handleType" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const plinthPanelOpen = ref(false);
const plinthColor = ref('#e8e4df');
const doorPanelOpen = ref(false);
const doorColor = ref('#ffffff');
const sidePanelOpen = ref(false);
const sidePanelColor = ref('#c4b8a8');
const handlePanelOpen = ref(false);
const handleType = ref('Knop 77');

function onPickerClick(key: string) {
  if (key === 'plinth') {
    plinthPanelOpen.value = true;
  } else if (key === 'door') {
    doorPanelOpen.value = true;
  } else if (key === 'sidePanel') {
    sidePanelOpen.value = true;
  } else if (key === 'handle') {
    handlePanelOpen.value = true;
  } else {
    console.log('Picker clicked:', key);
  }
}

function onBack() {
  // TODO: go to previous step or navigate back
  window.history.back();
}

function onNext() {
  // TODO: go to next step or submit
  console.log('Next clicked');
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

.configurator-main__image {
  width: 100%;
  max-width: 480px;
  height: auto;
  display: block;
  border-radius: var(--picker-radius);
  background-color: #f5f2ee;
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

  .configurator-main__image {
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
