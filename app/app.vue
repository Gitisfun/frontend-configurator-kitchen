<template>
  <div>
    <nav class="navbar">
      <NuxtLink to="/" class="logo-link">
        <img src="/logo_dekeukenfabriek_kleur.png" alt="DE KEUKEN FABRIEK" class="logo" />
      </NuxtLink>
      <div class="nav-links">
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/about">About</NuxtLink>
        <NuxtLink to="/contact">Contact</NuxtLink>
      </div>
    </nav>
    <NuxtPage />
  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.logo-link {
  display: flex;
  align-items: center;
}

.logo {
  height: 80px;
  width: auto;
}

.nav-links {
  display: flex;
  gap: 2rem;
}
</style>
