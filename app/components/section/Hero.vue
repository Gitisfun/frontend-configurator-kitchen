<template>
  <div class="hero-section">
    <div class="hero-image">
      <img src="/hero-kitchen-closets.jpg" alt="Luxury Kitchen" />
    </div>
    <div class="hero-overlay" />
    <div class="hero-content">
      <BaseHeader size="big" as="h1" align="center" color="light">
        Customize Your Cabinet
      </BaseHeader>
      <BaseParagraph size="large" align="center" color="light" max-width="800px">
        Select colors and handle styles to create your perfect kitchen piece.
      </BaseParagraph>
      <div class="button-container">
        <BaseButton variant="secondary" size="large" rounded>
          Continue
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-section {
  position: relative;
  width: 100%;
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.hero-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 2;
}

.hero-content {
  position: relative;
  z-index: 3;
  text-align: center;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2.5rem;
  flex-wrap: wrap;
}

@media (min-width: 768px) {
  .hero-content {
    padding: 3rem;
  }

  .button-container {
    gap: 1.5rem;
    margin-top: 3rem;
  }
}
</style>
