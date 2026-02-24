<template>
  <div class="app-wrapper">
    <BaseNavbar :light-page="isLightPage" />
    <NuxtPage />
    <BaseFooter />
    <BaseToastContainer />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const LIGHT_PAGE_PATHS = ['/configurator', '/about', '/contact'];

const isLightPage = computed(() => LIGHT_PAGE_PATHS.some((path) => route.path === path || route.path.startsWith(path + '/')));
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap');
@import './assets/css/theme.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100%;
  overflow-x: hidden;
}

#__nuxt {
  width: 100%;
  min-height: 100vh;
}
</style>

<style scoped>
.app-wrapper {
  margin: 0;
  padding: 0;
  width: 100%;
}
</style>
