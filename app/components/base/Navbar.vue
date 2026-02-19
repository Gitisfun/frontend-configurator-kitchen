<template>
  <nav class="navbar" :style="navbarStyle">
    <NuxtLink to="/" class="logo-link">
      <img src="/logo_dekeukenfabriek_kleur.png" alt="DE KEUKEN FABRIEK" class="logo" />
    </NuxtLink>
    <div class="nav-links">
      <NuxtLink to="/" class="nav-link">Home</NuxtLink>
      <NuxtLink to="/about" class="nav-link">About</NuxtLink>
      <NuxtLink to="/contact" class="nav-link">Contact</NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface Props {
  /** When true, use primary link color and solid bar (for pages with white background). */
  lightPage?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  lightPage: false,
});

const SCROLL_THRESHOLD = 80;
const scrollProgress = ref(0);

function updateScroll() {
  const scrollTop = window.scrollY ?? document.documentElement.scrollTop;
  scrollProgress.value = Math.min(scrollTop / SCROLL_THRESHOLD, 1);
}

function lerpColor(from: [number, number, number], to: [number, number, number], t: number): string {
  const r = Math.round(from[0] + (to[0] - from[0]) * t);
  const g = Math.round(from[1] + (to[1] - from[1]) * t);
  const b = Math.round(from[2] + (to[2] - from[2]) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

const WHITE: [number, number, number] = [255, 255, 255];
const PRIMARY: [number, number, number] = [27, 58, 92];

const navbarStyle = computed(() => {
  const p = props.lightPage ? 1 : scrollProgress.value;
  const linkColor = lerpColor(WHITE, PRIMARY, p);
  return {
    backgroundColor: `rgba(255, 255, 255, ${0.95 * p})`,
    backdropFilter: `blur(${10 * p}px)`,
    WebkitBackdropFilter: `blur(${10 * p}px)`,
    boxShadow: `0 2px 10px rgba(0, 0, 0, ${0.05 * p})`,
    '--nav-link-color': linkColor,
  } as Record<string, string>;
});

onMounted(() => {
  updateScroll();
  window.addEventListener('scroll', updateScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateScroll);
});
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--navbar-padding-y) var(--navbar-padding-x);
  z-index: 100;
  opacity: 0.95;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.logo-link:hover {
  opacity: 0.9;
}

.logo {
  height: var(--navbar-logo-height);
  width: auto;
}

.nav-links {
  display: flex;
  gap: var(--navbar-gap);
  align-items: center;
}

.nav-link {
  font-family: var(--font-sans);
  font-size: var(--navbar-link-font-size);
  font-weight: var(--font-weight-medium);
  color: var(--nav-link-color, var(--navbar-link-color));
  text-decoration: none;
  letter-spacing: var(--letter-spacing-wide);
  position: relative;
  padding: 0.25rem 0;
  transition: color 0.3s ease;
  text-transform: uppercase;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: var(--navbar-link-underline-height);
  background-color: var(--navbar-link-color-active);
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: var(--navbar-link-color-active);
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link.router-link-active {
  color: var(--navbar-link-color-active);
}

.nav-link.router-link-active::after {
  width: 100%;
}

@media (min-width: 768px) {
  .navbar {
    padding: var(--navbar-padding-y-desktop) var(--navbar-padding-x-desktop);
  }

  .nav-link {
    font-size: var(--navbar-link-font-size-desktop);
  }

  .nav-links {
    gap: var(--navbar-gap-desktop);
  }
}
</style>
