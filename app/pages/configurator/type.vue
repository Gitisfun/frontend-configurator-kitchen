<template>
  <div class="configurator-page configurator-type-page">
    <NuxtLink to="/configurator" class="configurator-type-page__back-link">
      terug naar het ontwerp
    </NuxtLink>

    <section class="configurator-main">
      <div class="configurator-main__inner">
        <div class="configurator-type-page__content">
          <BaseHeader size="big" as="h1" align="left" color="primary" class="configurator-type-page__title">
            selecteer kasten
          </BaseHeader>
          <BaseParagraph size="medium" align="left" color="primary" class="configurator-type-page__description">
            selecteer hier de kast groep waar je mee wil beginnen
          </BaseParagraph>

          <div class="configurator-type-page__buttons">
            <BaseButton variant="outlined" size="medium" rounded full-width @click="selectType('base')">
              onderkasten
            </BaseButton>
            <BaseButton variant="outlined" size="medium" rounded full-width @click="selectType('wall')">
              bovenkasten
            </BaseButton>
            <BaseButton variant="outlined" size="medium" rounded full-width @click="selectType('tall')">
              hoge kasten
            </BaseButton>
          </div>

          <div class="configurator-type-page__design">
            <BaseHeader size="small" as="h2" align="left" color="primary" class="configurator-type-page__design-title">
              Jouw ontwerp
            </BaseHeader>
            <BaseParagraph size="small" align="left" color="primary" class="configurator-type-page__design-detail">
              Front: sneeuwwit mat kunststof Greep/knop: greep 174
            </BaseParagraph>
            <BaseParagraph size="small" align="left" color="primary" class="configurator-type-page__design-detail">
              Kastkleur: sneeuwwit Plintkleur: sneeuwwit mat kunststof
            </BaseParagraph>
            <NuxtLink to="/configurator" class="configurator-type-page__change-link">wijzigen</NuxtLink>
          </div>
        </div>

        <div class="configurator-type-page__media">
          <img
            src="/placeholder.png"
            alt="Cabinet preview"
            class="configurator-type-page__image"
            width="600"
            height="400"
          />
        </div>
      </div>

      <div class="configurator-main__actions">
        <BaseButtons back-label="Terug" next-label="Volgende" @back="onBack" @next="onNext" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function selectType(type: string) {
  router.push({ path: '/configurator/subcategories', query: { type } });
}

function onBack() {
  window.history.back();
}

function onNext() {
  // TODO: go to next step
  console.log('Next clicked');
}
</script>

<style scoped>
.configurator-type-page {
  position: relative;
  background-color: var(--color-surface);
  padding-top: calc(var(--navbar-height) + 1.5rem);
  padding-bottom: var(--intro-padding-y);
  padding-left: var(--intro-padding-x);
  padding-right: var(--intro-padding-x);
}

.configurator-main {
  padding: 0;
}

.configurator-main__inner {
  max-width: var(--intro-max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: start;
}

.configurator-type-page__back-link {
  position: absolute;
  top: 0;
  right: var(--intro-padding-x);
  font-family: var(--font-sans);
  font-size: var(--paragraph-size-small);
  color: var(--color-text-primary);
  text-decoration: underline;
}

.configurator-type-page__back-link:hover {
  color: var(--color-brand);
}

.configurator-type-page__content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.configurator-type-page__title {
  margin-bottom: 0;
}

.configurator-type-page__description {
  margin-top: 0;
}

.configurator-type-page__buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.configurator-type-page__design {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--picker-border);
}

.configurator-type-page__design-title {
  margin-bottom: 0.75rem;
}

.configurator-type-page__design-detail {
  margin: 0 0 0.35rem;
  font-size: 14px;
}

.configurator-type-page__change-link {
  display: inline-block;
  margin-top: 0.5rem;
  font-family: var(--font-sans);
  font-size: var(--paragraph-size-small);
  color: var(--color-text-primary);
  text-decoration: underline;
}

.configurator-type-page__change-link:hover {
  color: var(--color-brand);
}

.configurator-type-page__media {
  display: flex;
  align-items: center;
  justify-content: center;
}

.configurator-type-page__image {
  width: 100%;
  max-width: 480px;
  height: auto;
  display: block;
  border-radius: var(--picker-radius);
  background-color: #f5f2ee;
}

.configurator-main__actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--picker-border);
}

@media (min-width: 768px) {
  .configurator-type-page {
    padding-top: calc(var(--navbar-height-desktop) + 2rem);
    padding-bottom: var(--intro-padding-y-desktop);
    padding-left: var(--intro-padding-x-desktop);
    padding-right: var(--intro-padding-x-desktop);
  }

  .configurator-main__inner {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: start;
  }

  .configurator-type-page__back-link {
    right: var(--intro-padding-x-desktop);
  }

  .configurator-type-page__image {
    max-width: 100%;
  }

  .configurator-main__actions {
    margin-top: 2.5rem;
    padding-top: 2.5rem;
  }
}
</style>
