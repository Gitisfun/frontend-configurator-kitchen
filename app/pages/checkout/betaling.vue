<template>
  <div class="betaling-page">
    <section class="betaling-page__main">
      <div class="betaling-page__inner">
        <BaseHeader size="big" as="h1" align="center" color="primary" class="betaling-page__title">
          Betaling
        </BaseHeader>
        <BaseParagraph size="medium" align="center" color="primary" class="betaling-page__intro">
          Deze pagina wordt binnenkort toegevoegd.
        </BaseParagraph>
        <div class="betaling-page__actions">
          <NuxtLink to="/checkout">
            <BaseButton variant="outlined" size="medium" rounded>Ga terug</BaseButton>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.betaling-page {
  background-color: var(--color-surface);
  padding-top: calc(var(--navbar-height) + 1.5rem);
  padding-bottom: var(--intro-padding-y);
  padding-left: var(--intro-padding-x);
  padding-right: var(--intro-padding-x);
  min-height: 60vh;
}

.betaling-page__inner {
  max-width: var(--intro-max-width);
  margin: 0 auto;
  text-align: center;
}

.betaling-page__title {
  margin-bottom: 1rem;
}

.betaling-page__intro {
  margin-bottom: 2rem;
}

.betaling-page__actions {
  display: flex;
  justify-content: center;
}
</style>
