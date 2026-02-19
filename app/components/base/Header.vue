<template>
  <component
    :is="as"
    :class="[
      'header',
      `header--${size}`,
      `header--${align}`,
      `header--${color}`,
      className
    ]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
interface Props {
  size?: 'small' | 'medium' | 'big'
  as?: 'h1' | 'h2' | 'h3' | 'h4'
  align?: 'left' | 'center'
  color?: 'primary' | 'muted' | 'light'
  weight?: 400 | 500 | 600
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  as: 'h2',
  align: 'left',
  color: 'primary',
  weight: 400
})
</script>

<style scoped>
.header {
  font-family: var(--font-serif);
  font-weight: v-bind('props.weight');
  letter-spacing: var(--letter-spacing-tight);
  line-height: var(--line-height-heading);
  margin: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

/* Size variants */
.header--big {
  font-size: var(--header-size-big);
}

.header--medium {
  font-size: var(--header-size-medium);
}

.header--small {
  font-size: var(--header-size-small);
}

/* Alignment */
.header--left {
  text-align: left;
}

.header--center {
  text-align: center;
}

/* Color variants */
.header--primary {
  color: var(--color-text-primary);
}

.header--muted {
  color: var(--color-text-muted-strong);
}

.header--light {
  color: var(--color-text-light);
}

/* Responsive - Desktop */
@media (min-width: 768px) {
  .header--big {
    font-size: var(--header-size-big-desktop);
  }

  .header--medium {
    font-size: var(--header-size-medium-desktop);
  }

  .header--small {
    font-size: var(--header-size-small-desktop);
  }
}
</style>
