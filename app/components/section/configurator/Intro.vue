<template>
  <section class="intro">
    <div class="intro__inner">
      <div class="intro__content">
        <BaseHeader size="big" as="h1" align="left" color="primary"> stel zelf je keuken samen </BaseHeader>
        <BaseParagraph size="medium" align="left" color="primary" class="intro__description"> maak hier alvast je keuze voor een greeploze kast of een kast met greep en start met samenstellen </BaseParagraph>
        <div class="intro__actions">
          <BaseButton variant="outlined" size="medium" rounded> kies met greep </BaseButton>
          <BaseButton variant="outlined" size="medium" rounded> kies greeploos </BaseButton>
        </div>
        <BaseLink to="/help" underline size="small" color="primary" class="intro__help">
          <template #iconLeft>
            <span class="intro__help-icon" aria-hidden="true">?</span>
          </template>
          hoe stel ik mijn keuken samen?
        </BaseLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.intro {
  background-color: var(--color-surface);
  padding: var(--intro-padding-y) var(--intro-padding-x);
}

.intro__inner {
  max-width: var(--intro-max-width);
  margin: 0 auto;
}

.intro__content {
  max-width: var(--intro-content-max-width);
}

.intro__description {
  margin-top: 1rem;
  margin-bottom: 1.5rem;
}

.intro__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.intro__help {
  display: inline-flex;
}

.intro__help-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background-color: var(--color-text-primary);
  color: var(--color-surface);
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
}

@media (min-width: 768px) {
  .intro {
    padding: var(--intro-padding-y-desktop) var(--intro-padding-x-desktop);
  }

  .intro__description {
    margin-top: 1.25rem;
    margin-bottom: 2rem;
  }

  .intro__actions {
    gap: 1.25rem;
    margin-bottom: 2rem;
  }
}
</style>
