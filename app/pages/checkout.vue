<template>
  <div class="checkout">
    <section class="checkout__main">
      <div class="checkout__inner">
        <!-- Stepper -->
        <nav class="checkout__stepper" aria-label="Checkout stappen">
          <NuxtLink to="/cart" class="checkout__step checkout__step--done">
            <span class="checkout__step-num">1</span>
            <span class="checkout__step-label">Winkelwagen</span>
          </NuxtLink>
          <span class="checkout__step-divider" />
          <span class="checkout__step checkout__step--active">
            <span class="checkout__step-num">2</span>
            <span class="checkout__step-label">Gegevens</span>
          </span>
          <span class="checkout__step-divider" />
          <span class="checkout__step">
            <span class="checkout__step-num">3</span>
            <span class="checkout__step-label">Betaling</span>
          </span>
        </nav>

        <div class="checkout__layout">
          <!-- Left column: form -->
          <form class="checkout__form" @submit.prevent="onSubmit">
            <!-- Persoonlijke gegevens -->
            <div class="checkout__card">
              <BaseHeader size="small" as="h2" align="left" color="primary" class="checkout__card-title">
                Persoonlijke gegevens
              </BaseHeader>
              <div class="checkout__fields">
                <BaseTextfield v-model="form.firstName" label="Voornaam" aria-label="Voornaam" />
                <BaseTextfield v-model="form.lastName" label="Achternaam" aria-label="Achternaam" />
                <BaseTextfield v-model="form.email" label="E-mail adres" aria-label="E-mail adres" />
                <BaseTextfield v-model="form.phone" label="Telefoonnummer" aria-label="Telefoonnummer" />
              </div>
            </div>

            <!-- Factuuradres -->
            <div class="checkout__card">
              <BaseHeader size="small" as="h2" align="left" color="primary" class="checkout__card-title">
                Factuuradres
              </BaseHeader>
              <div class="checkout__fields">
                <div class="checkout__row-2">
                  <BaseTextfield v-model="form.postcode" label="Postcode" aria-label="Postcode" />
                  <BaseTextfield v-model="form.houseNumber" label="Huisnummer" aria-label="Huisnummer" />
                </div>
                <BaseTextfield v-model="form.street" label="Straatnaam" aria-label="Straatnaam" />
                <BaseTextfield v-model="form.city" label="Woonplaats" aria-label="Woonplaats" />
              </div>
              <div class="checkout__checkbox-wrap">
                <BaseCheckbox
                  :checked="form.deliverySameAsBilling"
                  aria-label="Afleveradres is hetzelfde als factuuradres"
                  @update:checked="form.deliverySameAsBilling = $event"
                >
                  Afleveradres is hetzelfde als factuuradres
                </BaseCheckbox>
              </div>
            </div>

            <!-- Opmerkingen -->
            <div class="checkout__group">
              <BaseHeader size="small" as="h2" align="left" color="primary" class="checkout__group-title">
                Opmerkingen
              </BaseHeader>
              <textarea
                v-model="form.remarks"
                class="checkout__textarea"
                placeholder="Eventuele opmerkingen..."
                rows="4"
                aria-label="Opmerkingen"
              />
            </div>

            <!-- Wijze van levering -->
            <div class="checkout__group">
              <BaseHeader size="small" as="h2" align="left" color="primary" class="checkout__group-title">
                Wijze van levering
              </BaseHeader>
              <div class="checkout__radios">
                <BaseRadioButton
                  v-model="form.deliveryMethod"
                  name="delivery"
                  value="delivery"
                  :label="`Verstuur naar het opgegeven adres (+${shippingCost},-)`"
                />
                <BaseRadioButton
                  v-model="form.deliveryMethod"
                  name="delivery"
                  value="pickup"
                  label="Ik kom de producten zelf ophalen"
                />
              </div>
            </div>

            <!-- Algemene voorwaarden -->
            <div class="checkout__group">
              <BaseHeader size="small" as="h2" align="left" color="primary" class="checkout__group-title">
                Algemene voorwaarden
              </BaseHeader>
              <BaseCheckbox
                :checked="form.agreedToTerms"
                aria-label="Akkoord met algemene voorwaarden"
                @update:checked="form.agreedToTerms = $event"
              >
                Ja, ik ga akkoord met de algemene voorwaarden
              </BaseCheckbox>
            </div>

            <!-- Back link (mobile only, desktop has it in sidebar) -->
            <NuxtLink to="/cart" class="checkout__back-link checkout__back-link--mobile">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Terug naar winkelwagen
            </NuxtLink>
          </form>

          <!-- Right column: order summary -->
          <aside class="checkout__sidebar">
            <div class="checkout__summary">
              <BaseHeader size="small" as="h2" align="left" color="primary" class="checkout__summary-heading">
                Bestelling
              </BaseHeader>

              <ul class="checkout__summary-items">
                <li v-for="line in cartStore.items" :key="line.id" class="checkout__summary-item">
                  <div class="checkout__summary-item-img-wrap">
                    <img :src="line.image" :alt="line.title" class="checkout__summary-item-img" width="48" height="48" />
                  </div>
                  <div class="checkout__summary-item-info">
                    <span class="checkout__summary-item-name">{{ line.title }}</span>
                    <span class="checkout__summary-item-qty">× {{ line.quantity }}</span>
                  </div>
                  <span class="checkout__summary-item-price">€ {{ line.lineTotal }},-</span>
                </li>
              </ul>

              <div class="checkout__summary-divider" />

              <div class="checkout__summary-lines">
                <div class="checkout__summary-line">
                  <span>Subtotaal</span>
                  <span>€ {{ cartStore.total }},-</span>
                </div>
                <div class="checkout__summary-line">
                  <span>Verzending</span>
                  <span>{{ form.deliveryMethod === 'pickup' ? 'Gratis' : `€ ${shippingCost},-` }}</span>
                </div>
              </div>

              <div class="checkout__summary-divider" />

              <div class="checkout__summary-total-row">
                <span class="checkout__summary-total-label">Totaal</span>
                <span class="checkout__summary-total">€ {{ orderTotal }},-</span>
              </div>

              <BaseButton
                type="submit"
                variant="primary"
                size="large"
                rounded
                full-width
                :disabled="!form.agreedToTerms"
                class="checkout__summary-cta"
                @click="onSubmit"
              >
                Ga verder naar de betaling
              </BaseButton>

              <NuxtLink to="/cart" class="checkout__back-link checkout__back-link--desktop">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Terug naar winkelwagen
              </NuxtLink>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../../stores/cart';

const router = useRouter();
const cartStore = useCartStore();

const shippingCost = 295;

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  postcode: '',
  houseNumber: '',
  street: '',
  city: '',
  deliverySameAsBilling: true,
  remarks: '',
  deliveryMethod: 'delivery' as 'delivery' | 'pickup',
  agreedToTerms: false,
});

const orderTotal = computed(() =>
  cartStore.total + (form.deliveryMethod === 'pickup' ? 0 : shippingCost)
);

function onSubmit() {
  if (!form.agreedToTerms) return;
  router.push('/checkout/betaling');
}
</script>

<style scoped>
.checkout {
  background-color: var(--color-surface);
  padding-top: calc(var(--navbar-height) + 1.5rem);
  padding-bottom: var(--intro-padding-y);
  padding-left: var(--intro-padding-x);
  padding-right: var(--intro-padding-x);
  min-height: 70vh;
}

.checkout__main {
  padding: 0;
}

.checkout__inner {
  max-width: var(--intro-max-width);
  margin: 0 auto;
}

/* ---- Stepper ---- */
.checkout__stepper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-bottom: 2.5rem;
}

.checkout__step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-sans);
  font-size: var(--paragraph-size-small);
  color: var(--color-text-muted-light);
  text-decoration: none;
  transition: color 0.2s ease;
}

.checkout__step--done {
  color: var(--color-brand);
  cursor: pointer;
}

.checkout__step--done:hover {
  color: var(--color-brand-hover);
}

.checkout__step--active {
  color: var(--color-text-primary);
  font-weight: 600;
}

.checkout__step-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  flex-shrink: 0;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 600;
  border: 1.5px solid currentColor;
}

.checkout__step--active .checkout__step-num {
  background: var(--color-text-primary);
  color: var(--color-text-light);
  border-color: var(--color-text-primary);
}

.checkout__step--done .checkout__step-num {
  background: var(--color-brand);
  color: var(--color-text-light);
  border-color: var(--color-brand);
}

.checkout__step-divider {
  width: 2.5rem;
  height: 1px;
  background: var(--picker-border);
  margin: 0 0.75rem;
}

/* ---- Layout ---- */
.checkout__layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* ---- Form ---- */
.checkout__form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Card sections (with border) */
.checkout__card {
  padding: 1.5rem;
  background: var(--color-surface);
  border: 1px solid var(--picker-border);
  border-radius: var(--panel-radius);
}

.checkout__card-title {
  margin-bottom: 1.25rem;
}

/* Borderless group sections */
.checkout__group {
  padding: 0;
}

.checkout__group-title {
  margin-bottom: 1rem;
}

.checkout__fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.checkout__row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.checkout__checkbox-wrap {
  margin-top: 1.25rem;
}

.checkout__textarea {
  font-family: var(--font-sans);
  font-size: var(--picker-value-font-size);
  color: var(--color-text-primary);
  background-color: var(--picker-bg);
  border: 1px solid var(--picker-border);
  border-radius: var(--picker-radius);
  padding: var(--picker-padding-y) var(--picker-padding-x);
  width: 100%;
  resize: vertical;
  min-height: 5rem;
}

.checkout__textarea::placeholder {
  color: var(--color-text-muted-light);
}

.checkout__textarea:focus {
  outline: none;
  border-color: var(--color-text-muted-light);
  box-shadow: 0 0 0 2px var(--picker-focus-ring);
}

.checkout__radios {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* ---- Back link ---- */
.checkout__back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-sans);
  font-size: var(--paragraph-size-small);
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 0.2s ease;
}

.checkout__back-link:hover {
  color: var(--color-brand);
}

.checkout__back-link--desktop {
  display: none;
}

/* ---- Sidebar ---- */
.checkout__sidebar {
  order: -1;
}

.checkout__summary {
  padding: 1.5rem;
  background: var(--color-surface);
  border: 1px solid var(--picker-border);
  border-radius: var(--panel-radius);
}

.checkout__summary-heading {
  margin-bottom: 1.25rem;
}

.checkout__summary-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.checkout__summary-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.checkout__summary-item-img-wrap {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: var(--button-radius-rounded);
  overflow: hidden;
  border: 1px solid var(--picker-border);
  background: var(--color-surface-hover);
}

.checkout__summary-item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.checkout__summary-item-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.checkout__summary-item-name {
  font-family: var(--font-sans);
  font-size: var(--paragraph-size-small);
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.checkout__summary-item-qty {
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--color-text-muted);
}

.checkout__summary-item-price {
  font-family: var(--font-sans);
  font-size: var(--paragraph-size-small);
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
}

.checkout__summary-divider {
  height: 1px;
  background: var(--picker-border);
  margin: 1rem 0;
}

.checkout__summary-lines {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkout__summary-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-sans);
  font-size: var(--paragraph-size-small);
  color: var(--color-text-muted);
}

.checkout__summary-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.checkout__summary-total-label {
  font-family: var(--font-sans);
  font-size: var(--paragraph-size-medium);
  font-weight: 600;
  color: var(--color-text-primary);
}

.checkout__summary-total {
  font-family: var(--font-sans);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.checkout__summary-cta {
  margin-bottom: 1rem;
}

/* ---- Desktop ---- */
@media (min-width: 768px) {
  .checkout {
    padding-top: calc(var(--navbar-height-desktop) + 2rem);
    padding-bottom: var(--intro-padding-y-desktop);
    padding-left: var(--intro-padding-x-desktop);
    padding-right: var(--intro-padding-x-desktop);
  }

  .checkout__layout {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 3rem;
    align-items: start;
  }

  .checkout__sidebar {
    order: 0;
    position: sticky;
    top: calc(var(--navbar-height-desktop) + 1rem);
  }

  .checkout__back-link--mobile {
    display: none;
  }

  .checkout__back-link--desktop {
    display: inline-flex;
  }
}
</style>
