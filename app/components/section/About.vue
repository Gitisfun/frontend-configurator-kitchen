<template>
  <section class="about-philosophy" aria-labelledby="about-philosophy-heading">
    <div class="about-philosophy__inner">
      <div class="about-philosophy__media">
        <img
          :src="imageSrc"
          alt=""
          class="about-philosophy__image"
          width="800"
          height="600"
          loading="lazy"
        />
      </div>
      <div class="about-philosophy__content">
        <p class="about-philosophy__eyebrow">{{ eyebrow }}</p>
        <h2 id="about-philosophy-heading" class="about-philosophy__title">
          {{ titleBefore }} <em>{{ titleEmphasis }}</em>
        </h2>
        <p class="about-philosophy__body">{{ body1 }}</p>
        <p class="about-philosophy__body">{{ body2 }}</p>
        <BaseButton variant="outlined" size="medium" rounded class="about-philosophy__cta">
          {{ ctaLabel }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  imageSrc?: string;
  eyebrow?: string;
  titleBefore?: string;
  titleEmphasis?: string;
  body1?: string;
  body2?: string;
  ctaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  imageSrc: '/section_about.jpg',
  eyebrow: 'Our philosophy',
  titleBefore: 'Form follows',
  titleEmphasis: 'feeling',
  body1: 'At De Keuken Fabriek we believe a kitchen is not merely functional — it is the heart of the home. Every surface, every join, every material choice is considered with the same rigour an architect brings to a building.',
  body2: 'We work with a select group of clients each year, designing bespoke kitchens that endure for decades. Natural materials, precise craftsmanship, and a timeless aesthetic that transcends trend.',
  ctaLabel: 'Begin your project',
});
</script>

<style scoped>
.about-philosophy {
  background-color: var(--about-philosophy-bg, #f8f5ef);
  padding: var(--section-padding-y) var(--intro-padding-x);
}

.about-philosophy__inner {
  max-width: var(--intro-max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: center;
}

.about-philosophy__media {
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  background-color: var(--color-surface-hover);
}

.about-philosophy__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.about-philosophy__content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.about-philosophy__eyebrow {
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin: 0 0 0.75rem;
}

.about-philosophy__title {
  font-family: var(--font-serif);
  font-size: 1.75rem;
  font-weight: 500;
  line-height: var(--line-height-heading);
  color: var(--color-text-primary);
  margin: 0 0 1.25rem;
}

.about-philosophy__title em {
  font-style: italic;
  font-weight: 500;
}

.about-philosophy__body {
  font-family: var(--font-sans);
  font-size: var(--paragraph-size-small);
  line-height: var(--line-height-body);
  color: var(--color-text-primary);
  margin: 0 0 1rem;
}

.about-philosophy__body:last-of-type {
  margin-bottom: 1.5rem;
}

.about-philosophy__cta {
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-button);
}

@media (min-width: 768px) {
  .about-philosophy {
    padding: var(--section-padding-y-desktop) var(--intro-padding-x-desktop);
  }

  .about-philosophy__inner {
    grid-template-columns: 3fr 2fr;
    gap: 3rem;
  }

  .about-philosophy__media {
    aspect-ratio: auto;
    min-height: 400px;
  }

  .about-philosophy__eyebrow {
    font-size: 13px;
    margin-bottom: 1rem;
  }

  .about-philosophy__title {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  .about-philosophy__body {
    font-size: var(--paragraph-size-medium);
  }

  .about-philosophy__body:last-of-type {
    margin-bottom: 2rem;
  }
}
</style>
