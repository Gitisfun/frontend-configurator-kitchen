<template>
  <div class="configurator-page">
    <header class="configurator-header">
      <BaseHeader size="big" as="h1" align="center" color="primary" class="configurator-header__title"> Customize Your Closet </BaseHeader>
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
          <BasePicker label="Door Color" type="color" value="#ffffff" @click="onPickerClick('door')" />
          <BasePicker label="Side Panel" type="color" value="#c4b8a8" @click="onPickerClick('sidePanel')" />
          <BasePicker label="Handle Type" type="text" value="Brass Bar" @click="onPickerClick('handle')" />
        </div>
        <div class="configurator-main__actions">
          <BaseButton variant="outlined" size="medium" rounded @click="onBack"> Back </BaseButton>
          <BaseButton variant="primary" size="medium" rounded @click="onNext"> Next </BaseButton>
        </div>
      </div>
    </section>

    <BasePanel v-model="plinthPanelOpen" title="Plinth Color" width="400px">
      <p class="configurator-panel__intro">Choose a plinth color for your cabinet.</p>
      <div class="configurator-panel__colors">
        <button
          v-for="c in plinthColors"
          :key="c"
          type="button"
          class="configurator-panel__swatch"
          :class="{ 'configurator-panel__swatch--selected': plinthColor === c }"
          :style="{ backgroundColor: c }"
          :aria-label="`Select plinth color ${c}`"
          @click="plinthColor = c; plinthPanelOpen = false"
        />
      </div>
    </BasePanel>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const plinthPanelOpen = ref(false);
const plinthColor = ref('#e8e4df');
const plinthColors = ['#e8e4df', '#ffffff', '#c4b8a8', '#2d2d2d', '#8b7355'];

function onPickerClick(key: string) {
  if (key === 'plinth') {
    plinthPanelOpen.value = true;
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
  padding-bottom: var(--intro-padding-y);
}

.configurator-header {
  padding: var(--intro-padding-y) var(--intro-padding-x) 2rem;
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
  padding: 0 var(--intro-padding-x);
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
    padding-bottom: var(--intro-padding-y-desktop);
  }

  .configurator-header {
    padding: var(--intro-padding-y-desktop) var(--intro-padding-x-desktop) 3rem;
  }

  .configurator-main {
    padding: 0 var(--intro-padding-x-desktop);
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

.configurator-panel__intro {
  margin: 0 0 1rem;
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--color-text);
}

.configurator-panel__colors {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.configurator-panel__swatch {
  width: 44px;
  height: 44px;
  border-radius: var(--picker-radius);
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.15s;
}

.configurator-panel__swatch:hover {
  transform: scale(1.05);
}

.configurator-panel__swatch--selected {
  border-color: var(--color-primary, #1a1a1a);
  box-shadow: 0 0 0 1px var(--color-primary, #1a1a1a);
}
</style>
