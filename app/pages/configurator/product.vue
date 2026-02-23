<template>
  <div class="configurator-page configurator-product-page">
    <section class="configurator-main">
      <div class="configurator-main__inner">
        <header class="configurator-product-page__header">
          <BaseHeader size="big" as="h1" align="left" color="primary" class="configurator-product-page__title"> Apparatenkast, met inbouwnis 178cm hoog</BaseHeader>
        </header>

        <div class="configurator-product-page__media">
          <img src="/placeholder.png" alt="Product" class="configurator-product-page__image" width="600" height="400" />
          <img src="/placeholder.png" alt="Product variant" class="configurator-product-page__thumb" width="120" height="120" />
        </div>

        <div class="configurator-product-page__column configurator-product-page__column--formaat">
          <div class="configurator-product-page__section">
            <BaseHeader size="small" as="h2" align="left" color="primary" class="configurator-product-page__section-title"> Selecteer formaat </BaseHeader>
            <div class="configurator-product-page__selects">
              <BaseSelect v-model="form.width" :options="widthOptions" label="Breedte" />
              <BaseSelect v-model="form.height" :options="heightOptions" label="Hoogte" />
              <BaseSelect v-model="form.depth" :options="depthOptions" label="Diepte" />
              <BaseSelect v-model="form.plinth" :options="plinthOptions" label="Plint" />
            </div>
            <fieldset class="configurator-product-page__radios" aria-label="Deurrichting">
              <BaseRadioButton v-model="form.doorSide" name="doorSide" value="left" label="Deur links" />
              <BaseRadioButton v-model="form.doorSide" name="doorSide" value="right" label="Deur rechts" />
            </fieldset>
          </div>
          <div class="configurator-product-page__section">
            <BaseHeader size="small" as="h2" align="left" color="primary" class="configurator-product-page__section-title"> Maak je aankoop compleet </BaseHeader>
            <div class="configurator-product-page__checkboxes">
              <BaseCheckbox v-model="form.addOns" value="front">
                Frontverlenging voor onderkastdeur + 53,-
                <span class="configurator-product-page__info-icon" aria-hidden="true">i</span>
              </BaseCheckbox>
              <BaseCheckbox v-model="form.addOns" value="top">
                Opzetkast + 158,-
                <span class="configurator-product-page__info-icon" aria-hidden="true">i</span>
              </BaseCheckbox>
            </div>
          </div>
          <div class="configurator-product-page__quantity-price">
            <BaseNumberfield v-model="quantity" label="Selecteer aantal" :min="1" :max="99" aria-label="Aantal" />
            <div class="configurator-product-page__price">
              <span class="configurator-product-page__price-amount">{{ price }},-</span>
              <BaseParagraph size="small" align="left" color="primary" class="configurator-product-page__price-unit"> per stuk </BaseParagraph>
            </div>
          </div>
        </div>

        <div class="configurator-product-page__column configurator-product-page__column--details">
          <div class="configurator-product-page__section">
            <BaseHeader size="small" as="h2" align="left" color="primary" class="configurator-product-page__section-title"> Productinformatie </BaseHeader>
            <ul class="configurator-product-page__bullets">
              <li>
                <BaseParagraph size="small" align="left" color="primary"> hoogte 208cm excl. plinthoogte, met 2 deuren (onderste deur 77,6cm hoog) en een nis voor een geïntegreerde koel/vries combinatie 178,5cm </BaseParagraph>
              </li>
              <li>
                <BaseParagraph size="small" align="left" color="primary"> draairichting deur volgens afbeelding </BaseParagraph>
              </li>
              <li>
                <BaseParagraph size="small" align="left" color="primary"> kast wordt volledig voorgemonteerd geleverd </BaseParagraph>
              </li>
              <li>
                <BaseParagraph size="small" align="left" color="primary"> Blum Clip Top scharnieren zijn standaard voorzien van ingebouwde demping met softclose </BaseParagraph>
              </li>
              <li>
                <BaseParagraph size="small" align="left" color="primary"> stelpoten, grepen en plintmateriaal zijn inbegrepen </BaseParagraph>
              </li>
            </ul>
          </div>
          <div class="configurator-product-page__section">
            <BaseHeader size="small" as="h2" align="left" color="primary" class="configurator-product-page__section-title">
              Voeg apparatuur toe
              <span class="configurator-product-page__info-icon" aria-hidden="true">i</span>
            </BaseHeader>
            <BaseTextfield v-model="form.equipment" placeholder="Merk en type nummer" aria-label="Merk en type nummer" max-width="320px" />
          </div>
        </div>
      </div>

      <div class="configurator-main__actions">
        <BaseButtons back-label="terug" next-label="voeg toe aan winkelwagen" @back="onBack" @next="addToCart" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = ref({
  width: '60',
  height: '207.8',
  depth: '58',
  plinth: '12.5',
  doorSide: 'left' as 'left' | 'right',
  equipment: '',
  addOns: [] as string[],
});

const widthOptions = [
  { value: '60', label: '60 cm breed' },
  { value: '80', label: '80 cm breed' },
  { value: '100', label: '100 cm breed' },
];

const heightOptions = [
  { value: '207.8', label: '207.8 cm hoog' },
  { value: '194.8', label: '194.8 cm hoog' },
  { value: '220.8', label: '220.8 cm hoog' },
];

const depthOptions = [
  { value: '58', label: '58 cm diep' },
  { value: '60', label: '60 cm diep' },
];

const plinthOptions = [
  { value: '12.5', label: '12.5 cm hoge plint' },
  { value: '15', label: '15 cm hoge plint' },
];

const quantity = ref(1);

const basePrice = 528;
const addOnPrices: Record<string, number> = { front: 53, top: 158 };

const price = computed(() => {
  let total = basePrice;
  for (const id of form.value.addOns) {
    total += addOnPrices[id] ?? 0;
  }
  return total * quantity.value;
});

function onBack() {
  router.push('/configurator/subcategories');
}

function addToCart() {
  console.log('Add to cart', { form: form.value, quantity: quantity.value, price: price.value });
}
</script>

<style scoped>
.configurator-product-page {
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

.configurator-product-page__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.configurator-product-page__title {
  margin-bottom: 0;
}

.configurator-product-page__back-link {
  font-family: var(--font-sans);
  font-size: var(--paragraph-size-small);
  color: var(--color-text-primary);
  text-decoration: underline;
}

.configurator-product-page__back-link:hover {
  color: var(--color-brand);
}

.configurator-product-page__media {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
}

.configurator-product-page__image {
  width: 100%;
  max-width: 480px;
  height: auto;
  display: block;
  border-radius: var(--picker-radius);
  background-color: #f5f2ee;
}

.configurator-product-page__thumb {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--picker-radius);
  border: 1px solid var(--picker-border);
  background-color: #f5f2ee;
}

.configurator-product-page__column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.configurator-product-page__section {
  padding-top: 0.5rem;
}

.configurator-product-page__section-title {
  margin-bottom: 0.75rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.configurator-product-page__info-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 50%;
  border: 1px solid var(--color-text-muted);
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-muted);
}

.configurator-product-page__selects {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.configurator-product-page__radios {
  border: 0;
  margin: 1rem 0 0;
  padding: 0;
  display: flex;
  gap: 1.5rem;
}

.configurator-product-page__bullets {
  margin: 0;
  padding-left: 1.25rem;
  list-style: disc;
}

.configurator-product-page__bullets li {
  margin-bottom: 0.5rem;
}

.configurator-product-page__bullets li :deep(p) {
  margin: 0;
}

.configurator-product-page__checkboxes {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.configurator-main__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--picker-border);
  max-width: var(--intro-max-width);
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--intro-padding-x);
  padding-right: var(--intro-padding-x);
}

.configurator-product-page__quantity-price {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
}

.configurator-product-page__price {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 0.25rem;
}

.configurator-product-page__price-amount {
  font-family: var(--font-sans);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.configurator-product-page__price-unit {
  margin: 0;
  font-size: 13px;
  color: var(--color-text-muted);
}

@media (min-width: 768px) {
  .configurator-product-page {
    padding-top: calc(var(--navbar-height-desktop) + 2rem);
    padding-bottom: var(--intro-padding-y-desktop);
    padding-left: var(--intro-padding-x-desktop);
    padding-right: var(--intro-padding-x-desktop);
  }

  .configurator-main__inner {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 3rem;
    align-items: start;
  }

  .configurator-product-page__header {
    grid-column: 1 / -1;
  }

  .configurator-product-page__image {
    max-width: 100%;
  }

  .configurator-main__actions {
    margin-top: 2.5rem;
    padding-top: 2.5rem;
    padding-left: var(--intro-padding-x-desktop);
    padding-right: var(--intro-padding-x-desktop);
  }
}
</style>
