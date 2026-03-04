<template>
  <div class="cart-page">
    <section class="cart-page__main">
      <div class="cart-page__inner">
        <header class="cart-page__header">
          <BaseHeader size="big" as="h1" align="left" color="primary" class="cart-page__title"> Mijn winkelwagen </BaseHeader>
          <BaseBadge v-if="cartStore.itemCount > 0"> {{ cartStore.itemCount }} {{ cartStore.itemCount === 1 ? 'artikel' : 'artikelen' }} </BaseBadge>
        </header>

        <template v-if="cartStore.items.length === 0">
          <div class="cart-page__empty">
            <div class="cart-page__empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <BaseHeader size="small" as="h2" align="center" color="primary">Je winkelwagen is leeg</BaseHeader>
            <BaseParagraph size="small" align="center" color="muted" class="cart-page__empty-text"> Begin met het samenstellen van jouw droomkeuken </BaseParagraph>
            <NuxtLink to="/configurator">
              <BaseButton variant="primary" size="medium" rounded>Start de configurator</BaseButton>
            </NuxtLink>
          </div>
        </template>

        <template v-else>
          <div class="cart-page__card-link-wrap">
            <BaseCardLink to="/configurator" title="Mijn opstelling" description="Bekijken en aanpassen">
              <template #icon>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </template>
            </BaseCardLink>
          </div>

          <ul class="cart-page__list" role="list">
            <li v-for="line in cartStore.items" :key="line.id" class="cart-page__item">
              <div class="cart-page__item-image-wrap">
                <img :src="line.image" :alt="line.title" class="cart-page__item-image" width="120" height="120" />
              </div>
              <div class="cart-page__item-body">
                <div class="cart-page__item-top">
                  <div class="cart-page__item-info">
                    <BaseHeader size="small" as="h3" align="left" color="primary" class="cart-page__item-title">{{ line.title }}</BaseHeader>
                    <BaseParagraph v-if="line.form.width || line.form.height || line.form.depth" size="small" align="left" color="muted" class="cart-page__item-spec">
                      {{ [line.form.width, line.form.height, line.form.depth].filter(Boolean).join(' × ') }} cm
                      <span v-if="line.form.plinth"> · Plint {{ line.form.plinth }}</span>
                    </BaseParagraph>
                  </div>
                  <button type="button" class="cart-page__item-remove" aria-label="Verwijderen" @click="cartStore.removeItem(line.id)">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
                <div class="cart-page__item-bottom">
                  <BaseNumberfield :model-value="line.quantity" label="Aantal" :min="1" :max="99" aria-label="Aantal" class="cart-page__item-qty" @update:model-value="cartStore.updateQuantity(line.id, $event)" />
                  <span class="cart-page__item-price">€ {{ line.lineTotal }},-</span>
                </div>
              </div>
            </li>
          </ul>

          <div class="cart-page__continue">
            <NuxtLink to="/configurator" class="cart-page__continue-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Verder winkelen
            </NuxtLink>
          </div>

          <div class="cart-page__summary">
            <BaseHeader size="small" as="h2" align="left" color="primary" class="cart-page__summary-heading">Overzicht</BaseHeader>
            <div class="cart-page__summary-lines">
              <div class="cart-page__summary-line">
                <span>Subtotaal ({{ cartStore.itemCount }} {{ cartStore.itemCount === 1 ? 'artikel' : 'artikelen' }})</span>
                <span>€ {{ cartStore.total }},-</span>
              </div>
              <div class="cart-page__summary-line">
                <span>Verzending</span>
                <span class="cart-page__summary-shipping">Berekend bij checkout</span>
              </div>
            </div>
            <div class="cart-page__summary-divider" />
            <div class="cart-page__summary-total-row">
              <span class="cart-page__summary-total-label">Totaal</span>
              <span class="cart-page__summary-total">€ {{ cartStore.total }},-</span>
            </div>
            <div class="cart-page__summary-actions">
              <NuxtLink to="/checkout" class="cart-page__summary-btn-wrap">
                <BaseButton type="button" variant="primary" size="large" rounded full-width class="cart-page__summary-btn">Bestellen</BaseButton>
              </NuxtLink>
              <BaseButton variant="outlined" size="medium" rounded full-width class="cart-page__summary-btn" @click="onPlanAppointment">Plan een afspraak</BaseButton>
            </div>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '../../stores/cart';

const cartStore = useCartStore();

function onPlanAppointment() {
  console.log('Plan appointment');
}
</script>

<style scoped>
.cart-page {
  background-color: var(--color-surface);
  padding-top: calc(var(--navbar-height) + 2rem);
  padding-bottom: var(--intro-padding-y);
  padding-left: var(--intro-padding-x);
  padding-right: var(--intro-padding-x);
  min-height: 70vh;
}

.cart-page__main {
  padding: 0;
}

.cart-page__inner {
  max-width: var(--intro-max-width);
  margin: 0 auto;
}

/* ---- Header ---- */
.cart-page__header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.75rem 1rem;
  margin-bottom: 2.5rem;
}

.cart-page__title {
  margin-bottom: 0;
}

/* ---- Empty state ---- */
.cart-page__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 5rem 2rem;
  text-align: center;
}

.cart-page__empty-icon {
  color: var(--color-text-muted-light);
  margin-bottom: 0.5rem;
}

.cart-page__empty-text {
  margin: 0;
  max-width: 280px;
}

/* ---- Card link wrapper ---- */
.cart-page__card-link-wrap {
  margin-bottom: 0.25rem;
}

/* ---- Item list ---- */
.cart-page__list {
  margin: 0 0 1.5rem;
  padding: 0;
  list-style: none;
}

.cart-page__item {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 1.25rem;
  align-items: center;
  padding: 1.5rem 0.5rem;
  margin: 0 -0.5rem;
  border-bottom: 1px solid var(--picker-border);
  border-radius: 4px;
  transition: background-color 0.15s ease;
}

.cart-page__item:first-child {
  border-top: 1px solid var(--picker-border);
}

.cart-page__item:hover {
  background-color: var(--color-surface-hover);
}

.cart-page__item-image-wrap {
  width: 120px;
  height: 120px;
  border-radius: var(--panel-radius);
  overflow: hidden;
  background-color: var(--color-surface-hover);
  border: 1px solid var(--picker-border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  flex-shrink: 0;
}

.cart-page__item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cart-page__item-body {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cart-page__item-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
}

.cart-page__item-info {
  min-width: 0;
}

.cart-page__item-title {
  margin-bottom: 0.2rem;
}

.cart-page__item-spec {
  margin: 0;
}

.cart-page__item-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  padding: 0;
  border: none;
  border-radius: var(--button-radius-rounded);
  background: transparent;
  color: var(--color-text-muted-light);
  cursor: pointer;
  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    transform 0.15s ease;
}

.cart-page__item-remove:hover {
  color: var(--color-error);
  background-color: color-mix(in srgb, var(--color-error) 6%, transparent);
}

.cart-page__item-remove:active {
  transform: scale(0.9);
}

.cart-page__item-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.cart-page__item-qty {
  max-width: 6rem;
}

.cart-page__item-price {
  font-family: var(--font-sans);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

/* ---- Continue shopping ---- */
.cart-page__continue {
  margin-bottom: 2rem;
}

.cart-page__continue-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-sans);
  font-size: var(--paragraph-size-small);
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 0.2s ease;
}

.cart-page__continue-link svg {
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.cart-page__continue-link:hover {
  color: var(--color-brand);
}

.cart-page__continue-link:hover svg {
  transform: translateX(-2px);
}

/* ---- Summary ---- */
.cart-page__summary {
  padding: 1.5rem;
  border: 1px solid var(--picker-border);
  border-radius: var(--panel-radius);
  background: var(--color-surface);
  box-shadow: 0 2px 12px color-mix(in srgb, var(--color-text-primary) 6%, transparent);
}

.cart-page__summary-heading {
  margin-bottom: 1.25rem;
}

.cart-page__summary-lines {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cart-page__summary-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-sans);
  font-size: var(--paragraph-size-small);
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;
}

.cart-page__summary-shipping {
  font-style: italic;
  font-size: 13px;
}

.cart-page__summary-divider {
  height: 1px;
  background: var(--picker-border);
  margin: 1.25rem 0;
}

.cart-page__summary-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.cart-page__summary-total-label {
  font-family: var(--font-sans);
  font-size: var(--paragraph-size-medium);
  font-weight: 600;
  color: var(--color-text-primary);
}

.cart-page__summary-total {
  font-family: var(--font-sans);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-primary);
  font-variant-numeric: tabular-nums;
}

.cart-page__summary-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cart-page__summary-btn-wrap {
  display: block;
  text-decoration: none;
}

.cart-page__summary-btn {
  width: 100%;
}

/* ---- Desktop ---- */
@media (min-width: 768px) {
  .cart-page {
    padding-top: calc(var(--navbar-height-desktop) + 2.5rem);
    padding-bottom: var(--intro-padding-y-desktop);
    padding-left: var(--intro-padding-x-desktop);
    padding-right: var(--intro-padding-x-desktop);
  }

  .cart-page__inner {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 3rem;
    align-items: start;
  }

  .cart-page__header {
    grid-column: 1 / -1;
  }

  .cart-page__card-link-wrap,
  .cart-page__list,
  .cart-page__continue {
    grid-column: 1;
  }

  .cart-page__summary {
    grid-column: 2;
    grid-row: 2 / 5;
    position: sticky;
    top: calc(var(--navbar-height-desktop) + 1rem);
    padding: 1.75rem;
  }
}
</style>
