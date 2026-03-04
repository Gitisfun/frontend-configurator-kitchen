<template>
  <nav :class="['navbar', { 'navbar--scrolled': scrolled }]" :style="navbarStyle">
    <NuxtLink to="/" class="logo-link">
      <img src="/logo_dekeukenfabriek_kleur.png" alt="DE KEUKEN FABRIEK" class="logo" />
    </NuxtLink>
    <div class="nav-links">
      <NuxtLink to="/" class="nav-link">Home</NuxtLink>
      <NuxtLink to="/about" class="nav-link">About</NuxtLink>
      <NuxtLink to="/contact" class="nav-link">Contact</NuxtLink>
      <BaseThemeSwitcher />
      <BaseCart :item-count="cartStore.itemCount" :total="cartStore.total" :items="cartStore.itemsForDropdown" />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useCartStore } from '../../../stores/cart';

interface Props {
  /** When true, use primary link color and solid bar (for pages with white background). */
  lightPage?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  lightPage: false,
});

const cartStore = useCartStore();

const SCROLL_THRESHOLD = 80;
const scrollProgress = ref(0);

function updateScroll() {
  const scrollTop = window.scrollY ?? document.documentElement.scrollTop;
  scrollProgress.value = Math.min(scrollTop / SCROLL_THRESHOLD, 1);
}

const navbarStyle = computed(() => {
  const p = props.lightPage ? 1 : scrollProgress.value;
  return {
    '--navbar-scroll-progress': p,
  } as Record<string, string>;
});

const scrolled = computed(() => (props.lightPage ? true : scrollProgress.value > 0.5));

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
  background-color: transparent;
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
  box-shadow: none;
  transition: background-color 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease;
}

.navbar--scrolled {
  background-color: var(--navbar-bg-scrolled, rgba(255, 255, 255, 0.95));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: var(--navbar-shadow-scrolled, 0 2px 10px rgba(0, 0, 0, 0.05));
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
  filter: var(--navbar-logo-filter, none);
  transition: filter 0.3s ease;
}

.navbar--scrolled .logo {
  filter: var(--navbar-logo-filter-scrolled, none);
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
  color: var(--navbar-link-color-transparent, #fff);
  text-decoration: none;
  letter-spacing: var(--letter-spacing-wide);
  position: relative;
  padding: 0.25rem 0;
  transition: color 0.3s ease;
  text-transform: uppercase;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.navbar--scrolled .nav-link {
  color: var(--navbar-link-color);
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
