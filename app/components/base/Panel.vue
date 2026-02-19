<template>
  <Teleport to="body">
    <Transition name="panel">
      <div
        v-if="modelValue"
        ref="overlayRef"
        class="panel-overlay"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        @click.self="onOverlayClick"
        @keydown.esc="close"
      >
        <aside
          ref="panelRef"
          class="panel"
          :style="panelStyle"
        >
          <header class="panel__header">
            <slot name="header">
              <h2 :id="titleId" class="panel__title">
                {{ title }}
              </h2>
              <button
                type="button"
                class="panel__close"
                aria-label="Close panel"
                @click="close"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </slot>
          </header>
          <div class="panel__body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="panel__footer">
            <slot name="footer" />
          </footer>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  width?: string
  closeOnOverlayClick?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  width: '400px',
  closeOnOverlayClick: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const titleId = 'panel-title-' + Math.random().toString(36).slice(2, 11)
const overlayRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
let previousActiveElement: HTMLElement | null = null

const panelStyle = computed(() => ({ width: props.width }))

function close() {
  emit('update:modelValue', false)
}

function onOverlayClick() {
  if (props.closeOnOverlayClick) {
    close()
  }
}

function lockBodyScroll() {
  previousActiveElement = document.activeElement as HTMLElement | null
  document.body.style.overflow = 'hidden'
}

function unlockBodyScroll() {
  document.body.style.overflow = ''
  if (previousActiveElement?.focus) {
    previousActiveElement.focus()
  }
}

function focusCloseButton() {
  requestAnimationFrame(() => {
    const closeBtn = panelRef.value?.querySelector('.panel__close') as HTMLElement | undefined
    closeBtn?.focus()
  })
}

watch(() => props.modelValue, (open) => {
  if (open) {
    lockBodyScroll()
    focusCloseButton()
  } else {
    unlockBodyScroll()
  }
})
</script>

<style scoped>
.panel-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--panel-z-index);
  display: flex;
  justify-content: flex-end;
  background-color: var(--panel-overlay-bg);
  -webkit-tap-highlight-color: transparent;
}

.panel {
  height: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--panel-bg);
  box-shadow: var(--panel-shadow);
  overflow: hidden;
}

.panel__header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: var(--panel-header-padding);
  border-bottom: 1px solid var(--panel-border-color);
}

.panel__title {
  margin: 0;
  font-family: var(--font-serif);
  font-size: var(--panel-title-font-size);
  font-weight: 500;
  color: var(--color-text-primary);
  letter-spacing: var(--letter-spacing-tight);
  line-height: var(--line-height-heading);
}

.panel__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: var(--button-radius-rounded);
  background: transparent;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.panel__close:hover {
  background-color: var(--color-surface-hover);
}

.panel__close:focus {
  outline: var(--button-focus-ring);
  outline-offset: var(--button-focus-offset);
}

.panel__body {
  flex: 1;
  overflow-y: auto;
  padding: var(--panel-body-padding);
}

.panel__footer {
  flex-shrink: 0;
  padding: var(--panel-footer-padding);
  border-top: 1px solid var(--panel-border-color);
}

/* Transition: overlay fade + panel slide from right */
.panel-enter-active,
.panel-leave-active {
  transition: background-color 0.25s ease;
}

.panel-enter-active .panel,
.panel-leave-active .panel {
  transition: transform 0.25s ease;
}

.panel-enter-from,
.panel-leave-to {
  background-color: transparent;
}

.panel-enter-from .panel,
.panel-leave-to .panel {
  transform: translateX(100%);
}

@media (min-width: 768px) {
  .panel {
    border-radius: var(--panel-radius) 0 0 var(--panel-radius);
  }
}
</style>
