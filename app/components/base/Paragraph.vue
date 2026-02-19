<template>
  <p :class="['paragraph', `paragraph--${size}`, `paragraph--${align}`, `paragraph--${color}`, maxWidth ? 'paragraph--max-width' : '', className]" :style="{ maxWidth: maxWidth }">
    <slot />
  </p>
</template>

<script setup lang="ts">
interface Props {
  size?: 'small' | 'medium' | 'large';
  align?: 'left' | 'center' | 'right' | 'justify';
  color?: 'primary' | 'muted' | 'light';
  weight?: 400 | 500 | 600 | 700;
  maxWidth?: string;
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  align: 'left',
  color: 'primary',
  weight: 400,
  maxWidth: '',
});
</script>

<style scoped>
.paragraph {
  opacity: 0.75;
  font-family: var(--font-sans);
  font-weight: v-bind('props.weight');
  letter-spacing: var(--letter-spacing-body);
  line-height: var(--line-height-body);
  margin: 0 0 var(--paragraph-margin-bottom) 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

/* Size variants */
.paragraph--small {
  font-size: var(--paragraph-size-small);
}

.paragraph--medium {
  font-size: var(--paragraph-size-medium);
}

.paragraph--large {
  font-size: var(--paragraph-size-large);
}

/* Alignment */
.paragraph--left {
  text-align: left;
}

.paragraph--center {
  text-align: center;
}

.paragraph--right {
  text-align: right;
}

.paragraph--justify {
  text-align: justify;
}

/* Color variants */
.paragraph--primary {
  color: var(--color-text-muted);
}

.paragraph--muted {
  color: var(--color-text-muted-light);
}

.paragraph--light {
  color: var(--color-text-light);
}

/* Max width for readability */
.paragraph--max-width {
  margin-left: auto;
  margin-right: auto;
}

/* Responsive - Desktop */
@media (min-width: 768px) {
  .paragraph--small {
    font-size: var(--paragraph-size-small-desktop);
  }

  .paragraph--medium {
    font-size: var(--paragraph-size-medium-desktop);
  }

  .paragraph--large {
    font-size: var(--paragraph-size-large-desktop);
  }
}
</style>
