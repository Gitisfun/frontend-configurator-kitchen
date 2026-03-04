<template>
  <div class="theme-switcher" @keydown.escape="open = false">
    <button
      type="button"
      class="theme-switcher__toggle"
      aria-label="Thema kiezen"
      @click="open = !open"
    >
      <span class="theme-switcher__active-swatch" :data-swatch="activeTheme" />
    </button>

    <Transition name="theme-switcher-dropdown">
      <div v-if="open" class="theme-switcher__dropdown">
        <div class="theme-switcher__header">
          <span class="theme-switcher__label">Kies een thema</span>
        </div>
        <ul class="theme-switcher__list">
          <li v-for="theme in themes" :key="theme.id" class="theme-switcher__item">
            <button
              type="button"
              :class="['theme-switcher__option', { 'theme-switcher__option--active': activeTheme === theme.id }]"
              @click="selectTheme(theme.id)"
              @mouseenter="previewTheme(theme.id)"
              @mouseleave="cancelPreview"
            >
              <span class="theme-switcher__swatch" :data-swatch="theme.id" />
              <span class="theme-switcher__option-text">
                <span class="theme-switcher__option-name">{{ theme.label }}</span>
                <span class="theme-switcher__option-desc">{{ theme.description }}</span>
              </span>
              <svg v-if="activeTheme === theme.id" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="theme-switcher__check" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </Transition>

    <div v-if="open" class="theme-switcher__backdrop" @click="open = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useTheme, type ThemeId } from '../../composables/useTheme';

const { activeTheme, themes, setTheme, previewTheme, cancelPreview } = useTheme();
const open = ref(false);

function selectTheme(id: ThemeId) {
  setTheme(id);
  open.value = false;
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) {
    open.value = false;
    cancelPreview();
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown));
onUnmounted(() => document.removeEventListener('keydown', onKeydown));
</script>

<style scoped>
.theme-switcher {
  position: relative;
}

.theme-switcher__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border: 2px solid var(--picker-border);
  border-radius: 50%;
  background: var(--color-surface);
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
}

.theme-switcher__toggle:hover {
  border-color: var(--color-text-muted-light);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transform: scale(1.05);
}

.theme-switcher__toggle:active {
  transform: scale(0.95);
}

.theme-switcher__active-swatch {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: block;
}

.theme-switcher__backdrop {
  position: fixed;
  inset: 0;
  z-index: 99;
}

.theme-switcher__dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 0.5rem);
  z-index: 100;
  width: 290px;
  background: var(--color-surface);
  border: 1px solid var(--picker-border);
  border-radius: var(--panel-radius);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

.theme-switcher__header {
  padding: 0.875rem 1rem 0.5rem;
}

.theme-switcher__label {
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.theme-switcher__list {
  list-style: none;
  padding: 0 0.5rem 0.5rem;
  margin: 0;
  max-height: 340px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--color-text-muted-light) transparent;
}

.theme-switcher__option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.5rem 0.625rem;
  border: none;
  border-radius: var(--button-radius-rounded);
  background: transparent;
  cursor: pointer;
  text-align: left;
  color: inherit;
  transition: background-color 0.12s ease;
}

.theme-switcher__option:hover {
  background: var(--color-surface-hover);
}

.theme-switcher__option--active {
  background: var(--color-surface-hover);
}

/* Swatches (shared between toggle and list) */
.theme-switcher__active-swatch[data-swatch='classic'],
.theme-switcher__swatch[data-swatch='classic'] {
  background: linear-gradient(135deg, #1B3A5C 50%, #00A651 50%);
}

.theme-switcher__active-swatch[data-swatch='warm-earth'],
.theme-switcher__swatch[data-swatch='warm-earth'] {
  background: linear-gradient(135deg, #3D2E2A 50%, #C2714F 50%);
}

.theme-switcher__active-swatch[data-swatch='midnight'],
.theme-switcher__swatch[data-swatch='midnight'] {
  background: linear-gradient(135deg, #141820 50%, #4F9CF7 50%);
}

.theme-switcher__active-swatch[data-swatch='sage'],
.theme-switcher__swatch[data-swatch='sage'] {
  background: linear-gradient(135deg, #2C3E3A 50%, #7C9A82 50%);
}

.theme-switcher__active-swatch[data-swatch='noir'],
.theme-switcher__swatch[data-swatch='noir'] {
  background: linear-gradient(135deg, #1A1A1A 50%, #C9A84C 50%);
}

.theme-switcher__active-swatch[data-swatch='coastal'],
.theme-switcher__swatch[data-swatch='coastal'] {
  background: linear-gradient(135deg, #2A3D52 50%, #3A8FB7 50%);
}

.theme-switcher__active-swatch[data-swatch='industrial'],
.theme-switcher__swatch[data-swatch='industrial'] {
  background: linear-gradient(135deg, #1E1C1A 50%, #D4804A 50%);
}

.theme-switcher__active-swatch[data-swatch='zen'],
.theme-switcher__swatch[data-swatch='zen'] {
  background: linear-gradient(135deg, #2C2C28 50%, #3B5998 50%);
}

.theme-switcher__active-swatch[data-swatch='bistro'],
.theme-switcher__swatch[data-swatch='bistro'] {
  background: linear-gradient(135deg, #2E1F2E 50%, #8C2F4E 50%);
}

.theme-switcher__active-swatch[data-swatch='arctic'],
.theme-switcher__swatch[data-swatch='arctic'] {
  background: linear-gradient(135deg, #1A2030 50%, #1AA8A0 50%);
}

.theme-switcher__swatch {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 2px solid var(--picker-border);
  transition: transform 0.15s ease;
}

.theme-switcher__option:hover .theme-switcher__swatch {
  transform: scale(1.1);
}

.theme-switcher__option-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.theme-switcher__option-name {
  font-family: var(--font-sans);
  font-size: var(--paragraph-size-small);
  font-weight: 600;
  color: var(--color-text-primary);
}

.theme-switcher__option-desc {
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.theme-switcher__check {
  flex-shrink: 0;
  color: var(--color-brand);
}

/* Transition */
.theme-switcher-dropdown-enter-active,
.theme-switcher-dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.theme-switcher-dropdown-enter-from,
.theme-switcher-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.97);
}
</style>
