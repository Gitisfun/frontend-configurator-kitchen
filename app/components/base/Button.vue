<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'button',
      `button--${variant}`,
      `button--${size}`,
      fullWidth ? 'button--full-width' : '',
      rounded ? 'button--rounded' : '',
      shadow ? 'button--shadow' : '',
      disabled ? 'button--disabled' : '',
      loading ? 'button--loading' : '',
      className
    ]"
    :style="customStyles"
    @click="handleClick"
  >
    <span v-if="loading" class="button__spinner"></span>
    <span v-if="$slots.iconLeft" class="button__icon button__icon--left">
      <slot name="iconLeft" />
    </span>
    <span class="button__content">
      <slot />
    </span>
    <span v-if="$slots.iconRight" class="button__icon button__icon--right">
      <slot name="iconRight" />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'outlined' | 'primary' | 'secondary' | 'light' | 'dark'
  size?: 'small' | 'medium' | 'large'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  rounded?: boolean
  shadow?: boolean
  customColor?: string
  customBgColor?: string
  customBorderColor?: string
  className?: string
}

interface Emits {
  (e: 'click', event: MouseEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  type: 'button',
  disabled: false,
  loading: false,
  fullWidth: false,
  rounded: false,
  shadow: false
})

const emit = defineEmits<Emits>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

const customStyles = computed(() => {
  const styles: Record<string, string> = {}
  
  if (props.customColor) {
    styles.color = props.customColor
  }
  
  if (props.customBgColor) {
    styles.backgroundColor = props.customBgColor
  }
  
  if (props.customBorderColor) {
    styles.borderColor = props.customBorderColor
  }
  
  return styles
})
</script>

<style scoped>
.button {
  font-family: var(--font-sans);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-button);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.3s ease, height 0.3s ease;
}

.button:active::before {
  width: 300px;
  height: 300px;
}

.button:focus {
  outline: var(--button-focus-ring);
  outline-offset: var(--button-focus-offset);
}

.button:focus:not(:focus-visible) {
  outline: none;
}

/* Variants */
.button--outlined {
  background-color: var(--button-outlined-bg);
  color: var(--button-outlined-color);
  border: 1px solid var(--button-outlined-border);
}

.button--outlined:hover:not(:disabled) {
  background-color: var(--button-outlined-hover-bg);
  transform: translateY(-1px);
}

.button--outlined:active:not(:disabled) {
  transform: translateY(0);
}

.button--primary {
  background-color: var(--button-primary-bg);
  color: var(--button-primary-color);
  border: none;
}

.button--primary:hover:not(:disabled) {
  background-color: var(--button-primary-bg-hover);
  transform: translateY(-1px);
}

.button--primary:active:not(:disabled) {
  transform: translateY(0);
}

.button--secondary {
  background-color: var(--color-brand-secondary);
  color: var(--color-text-light);
  border: none;
}

.button--secondary:hover:not(:disabled) {
  background-color: var(--color-brand-secondary-hover);
  transform: translateY(-1px);
}

.button--secondary:active:not(:disabled) {
  transform: translateY(0);
}

.button--light {
  background-color: var(--button-light-bg);
  color: var(--button-light-color);
  border: none;
}

.button--light:hover:not(:disabled) {
  background-color: var(--button-light-hover-bg);
  transform: translateY(-1px);
}

.button--light:active:not(:disabled) {
  transform: translateY(0);
}

.button--dark {
  background-color: var(--button-dark-bg);
  color: var(--button-dark-color);
  border: none;
}

.button--dark:hover:not(:disabled) {
  background-color: var(--button-dark-hover-bg);
  transform: translateY(-1px);
}

.button--dark:active:not(:disabled) {
  transform: translateY(0);
}

/* Sizes */
.button--small {
  padding: var(--button-padding-y-small) var(--button-padding-x-small);
  font-size: var(--button-font-size-small);
  min-height: var(--button-min-height-small);
}

.button--medium {
  padding: var(--button-padding-y-medium) var(--button-padding-x-medium);
  font-size: var(--button-font-size-medium);
  min-height: var(--button-min-height-medium);
}

.button--large {
  padding: var(--button-padding-y-large) var(--button-padding-x-large);
  font-size: var(--button-font-size-large);
  min-height: var(--button-min-height-large);
}

/* States */
.button--disabled,
.button:disabled {
  opacity: var(--button-disabled-opacity);
  cursor: not-allowed;
  transform: none !important;
}

.button--loading {
  cursor: wait;
}

.button--full-width {
  width: 100%;
}

.button--rounded {
  border-radius: var(--button-radius-rounded);
}

.button--shadow {
  box-shadow: var(--button-shadow);
}

.button--shadow:hover:not(:disabled) {
  box-shadow: var(--button-shadow-hover);
}

.button__content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  z-index: 1;
}

.button__icon {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
}

.button__icon--left {
  margin-right: -0.25rem;
}

.button__icon--right {
  margin-left: -0.25rem;
}

.button__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  position: relative;
  z-index: 1;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (min-width: 768px) {
  .button--small {
    padding: var(--button-padding-y-small-desktop) var(--button-padding-x-small-desktop);
    font-size: var(--button-font-size-small-desktop);
    min-height: var(--button-min-height-small-desktop);
  }

  .button--medium {
    padding: var(--button-padding-y-medium-desktop) var(--button-padding-x-medium-desktop);
    font-size: var(--button-font-size-medium-desktop);
    min-height: var(--button-min-height-medium-desktop);
  }

  .button--large {
    padding: var(--button-padding-y-large-desktop) var(--button-padding-x-large-desktop);
    font-size: var(--button-font-size-large-desktop);
    min-height: var(--button-min-height-large-desktop);
  }
}
</style>
