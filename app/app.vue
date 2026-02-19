<template>
  <div class="app-wrapper">
    <BaseNavbar />
    <NuxtPage />
    <BaseFooter />
  </div>
</template>

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
