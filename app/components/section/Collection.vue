<template>
  <section class="about" aria-labelledby="collection-heading">
    <div class="about__inner">
      <header class="about__header">
        <p class="about__eyebrow">{{ eyebrow }}</p>
        <h2 id="collection-heading" class="about__title">{{ title }}</h2>
      </header>
      <div class="about__grid">
      <div class="about__left">
        <div class="about__card about__card--large">
          <img :src="primary.image" :alt="primary.name" class="about__image" width="800" height="600" loading="lazy" />
          <div class="about__overlay">
            <span class="about__overlay-meta">{{ primary.collectionNo }}</span>
            <span class="about__overlay-title">{{ primary.name }}</span>
            <span class="about__overlay-meta">{{ primary.materials }}</span>
          </div>
        </div>
      </div>
      <div class="about__right">
        <div class="about__card">
          <img :src="secondary[0].image" :alt="secondary[0].name" class="about__image" width="400" height="300" loading="lazy" />
          <div class="about__overlay">
            <span class="about__overlay-meta">{{ secondary[0].collectionNo }}</span>
            <span class="about__overlay-title">{{ secondary[0].name }}</span>
            <span class="about__overlay-meta">{{ secondary[0].materials }}</span>
          </div>
        </div>
        <div class="about__card">
          <img :src="secondary[1].image" :alt="secondary[1].name" class="about__image" width="400" height="300" loading="lazy" />
          <div class="about__overlay">
            <span class="about__overlay-meta">{{ secondary[1].collectionNo }}</span>
            <span class="about__overlay-title">{{ secondary[1].name }}</span>
            <span class="about__overlay-meta">{{ secondary[1].materials }}</span>
          </div>
        </div>
      </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  eyebrow?: string;
  title?: string;
}

withDefaults(defineProps<Props>(), {
  eyebrow: 'Our work',
  title: 'The Collections',
});

interface Collection {
  image: string;
  collectionNo: string;
  name: string;
  materials: string;
}

const collections: [Collection, Collection, Collection] = [
  {
    image: '/section_about_one.jpg',
    collectionNo: 'Collection no. 01',
    name: 'Natura',
    materials: 'Walnut · Calacatta Marble',
  },
  {
    image: '/section_about_two.jpg',
    collectionNo: 'Collection no. 02',
    name: 'Obscura',
    materials: 'Smoked Oak · Brushed Brass',
  },
  {
    image: '/section_about_three.jpg',
    collectionNo: 'Collection no. 03',
    name: 'Blanc',
    materials: 'Matte White · Natural Oak',
  },
];

const primary = collections[0];
const secondary: [Collection, Collection] = [collections[1], collections[2]];
</script>

<style scoped>
.about {
  padding: var(--section-padding-y) var(--intro-padding-x);
}

.about__inner {
  max-width: var(--intro-max-width, 1200px);
  margin: 0 auto;
}

.about__header {
  margin-bottom: 1.5rem;
}

.about__eyebrow {
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin: 0 0 0.5rem;
}

.about__title {
  font-family: var(--font-serif);
  font-size: 1.75rem;
  font-weight: 500;
  line-height: var(--line-height-heading);
  color: var(--color-text-primary);
  margin: 0;
}

.about__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.about__left,
.about__right {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.about__card {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  background-color: var(--color-surface-hover, #f5f2ee);
}

.about__card--large {
  aspect-ratio: 4 / 3;
}

.about__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.about__overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 1.5rem 1.25rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, transparent 100%);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.about__overlay-meta {
  font-family: var(--font-sans);
  font-size: 12px;
  letter-spacing: var(--letter-spacing-wide);
  color: rgba(255, 255, 255, 0.85);
}

.about__overlay-title {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  line-height: 1.2;
}

@media (min-width: 768px) {
  .about {
    padding: var(--section-padding-y-desktop) var(--intro-padding-x-desktop);
  }

  .about__header {
    margin-bottom: 2rem;
  }

  .about__eyebrow {
    font-size: 13px;
  }

  .about__title {
    font-size: 2rem;
  }

  .about__grid {
    grid-template-columns: 2fr 1fr;
    gap: 0.75rem;
  }

  .about__card--large {
    min-height: 100%;
    aspect-ratio: auto;
  }

  .about__right .about__card {
    aspect-ratio: 4 / 3;
    min-height: 0;
    flex: 1;
  }

  .about__right .about__card:first-child {
    flex: 1;
  }

  .about__right .about__card:last-child {
    flex: 1;
  }

  .about__overlay {
    padding: 1.75rem 1.5rem;
  }

  .about__overlay-meta {
    font-size: 13px;
  }

  .about__overlay-title {
    font-size: 1.75rem;
  }
}
</style>
