<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="linkClasses"
    @click="handleClick"
  >
    <span v-if="$slots.iconLeft" class="link__icon link__icon--left">
      <slot name="iconLeft" />
    </span>
    <span class="link__content">
      <slot />
    </span>
  </NuxtLink>
  <a
    v-else-if="href"
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    :class="linkClasses"
    @click="handleClick"
  >
    <span v-if="$slots.iconLeft" class="link__icon link__icon--left">
      <slot name="iconLeft" />
    </span>
    <span class="link__content">
      <slot />
    </span>
  </a>
  <button
    v-else
    type="button"
    :disabled="disabled"
    :class="linkClasses"
    @click="handleClick"
  >
    <span v-if="$slots.iconLeft" class="link__icon link__icon--left">
      <slot name="iconLeft" />
    </span>
    <span class="link__content">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Internal route (NuxtLink) */
  to?: string | object
  /** URL for external or same-tab links */
  href?: string
  /** Set when href is an external URL (adds target + rel) */
  external?: boolean
  /** Show text underline */
  underline?: boolean
  /** Visual size */
  size?: 'small' | 'medium'
  /** Text color variant */
  color?: 'primary' | 'muted'
  /** Disabled state (button mode or when you want to disable navigation) */
  disabled?: boolean
  /** Extra class */
  className?: string
}

interface Emits {
  (e: 'click', event: MouseEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  underline: false,
  size: 'medium',
  color: 'primary',
  disabled: false,
  external: false
})

const emit = defineEmits<Emits>()

const linkClasses = computed(() => [
  'link',
  `link--${props.size}`,
  `link--${props.color}`,
  props.underline ? 'link--underline' : '',
  props.disabled ? 'link--disabled' : '',
  props.className ?? ''
].filter(Boolean))

function handleClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>

<style scoped>
.link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-sans);
  font-weight: var(--font-weight-medium);
  letter-spacing: var(--letter-spacing-body);
  line-height: var(--line-height-body);
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: opacity 0.2s ease;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: none;
  border: none;
  padding: 0;
}

.link:hover:not(.link--disabled) {
  opacity: 0.75;
}

.link--underline {
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.link--small {
  font-size: var(--link-font-size-small);
}

.link--medium {
  font-size: var(--link-font-size-medium);
}

.link--primary {
  color: var(--color-text-primary);
}

.link--muted {
  color: var(--color-text-muted);
}

.link--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.link__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.link__icon--left {
  order: -1;
}
</style>
