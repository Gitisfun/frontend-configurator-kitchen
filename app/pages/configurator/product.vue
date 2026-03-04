<template>
  <div class="configurator-page configurator-product-page">
    <section class="configurator-main">
      <div class="configurator-main__inner">
        <header class="configurator-product-page__header">
          <BaseHeader size="big" as="h1" align="left" color="primary" class="configurator-product-page__title">
            {{ product?.title ?? 'Product' }}
          </BaseHeader>
        </header>

        <div class="configurator-product-page__media">
          <img :src="product?.image ?? '/placeholder.png'" alt="Product" class="configurator-product-page__image" width="600" height="400" />
          <img :src="product?.thumb ?? product?.image ?? '/placeholder.png'" alt="Product variant" class="configurator-product-page__thumb" width="120" height="120" />
        </div>

        <div class="configurator-product-page__column configurator-product-page__column--formaat">
          <div class="configurator-product-page__section">
            <BaseHeader size="small" as="h2" align="left" color="primary" class="configurator-product-page__section-title"> Selecteer formaat </BaseHeader>
            <div class="configurator-product-page__selects">
              <BaseSelect v-model="form.width" :options="product?.dimensions.width ?? []" label="Breedte" />
              <BaseSelect v-model="form.height" :options="product?.dimensions.height ?? []" label="Hoogte" />
              <BaseSelect v-model="form.depth" :options="product?.dimensions.depth ?? []" label="Diepte" />
              <BaseSelect v-if="(product?.dimensions.plinth?.length ?? 0) > 0" v-model="form.plinth" :options="product?.dimensions.plinth ?? []" label="Plint" />
            </div>
            <fieldset v-if="product?.doorSwing.leftLabel || product?.doorSwing.rightLabel" class="configurator-product-page__radios" aria-label="Deurrichting">
              <BaseRadioButton v-model="form.doorSide" name="doorSide" value="left" :label="product?.doorSwing.leftLabel ?? 'Deur links'" />
              <BaseRadioButton v-model="form.doorSide" name="doorSide" value="right" :label="product?.doorSwing.rightLabel ?? 'Deur rechts'" />
            </fieldset>
          </div>
          <div v-if="product?.addOns?.length" class="configurator-product-page__section">
            <BaseHeader size="small" as="h2" align="left" color="primary" class="configurator-product-page__section-title"> Maak je aankoop compleet </BaseHeader>
            <div class="configurator-product-page__checkboxes">
              <BaseCheckbox v-for="addon in product.addOns" :key="addon.id" v-model="form.addOns" :value="addon.id">
                {{ addon.name }} + {{ addon.price }},-
                <span class="configurator-product-page__info-icon" aria-hidden="true">i</span>
              </BaseCheckbox>
            </div>
          </div>
          <div class="configurator-product-page__quantity-price">
            <BaseNumberfield v-model="quantity" label="Selecteer aantal" :min="1" :max="99" aria-label="Aantal" />
            <div class="configurator-product-page__price">
              <span class="configurator-product-page__price-amount">{{ totalPrice }},-</span>
              <BaseParagraph size="small" align="left" color="primary" class="configurator-product-page__price-unit"> per stuk </BaseParagraph>
            </div>
          </div>
        </div>

        <div class="configurator-product-page__column configurator-product-page__column--details">
          <div class="configurator-product-page__section">
            <BaseHeader size="small" as="h2" align="left" color="primary" class="configurator-product-page__section-title"> Productinformatie </BaseHeader>
            <ul class="configurator-product-page__bullets">
              <li v-for="(info, i) in product?.productInformation" :key="i">
                <BaseParagraph size="small" align="left" color="primary">{{ info }}</BaseParagraph>
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../../../stores/cart';
import { CONFIGURATOR_PRODUCTS, type ConfiguratorProduct } from '../../constants/dummy';

const router = useRouter();
const cartStore = useCartStore();

const product = ref<ConfiguratorProduct | null>(null);

const form = ref({
  width: '',
  height: '',
  depth: '',
  plinth: '',
  doorSide: 'left' as 'left' | 'right',
  equipment: '',
  addOns: [] as string[],
});

const quantity = ref(1);

function pickRandomProduct() {
  if (CONFIGURATOR_PRODUCTS.length === 0) return;
  const index = Math.floor(Math.random() * CONFIGURATOR_PRODUCTS.length);
  const p = CONFIGURATOR_PRODUCTS[index];
  if (p) product.value = p;
}

function initFormFromProduct() {
  const p = product.value;
  if (!p) return;
  form.value = {
    width: p.dimensions.width[0]?.value ?? '',
    height: p.dimensions.height[0]?.value ?? '',
    depth: p.dimensions.depth[0]?.value ?? '',
    plinth: p.dimensions.plinth[0]?.value ?? '',
    doorSide: p.doorSwing.default,
    equipment: form.value.equipment,
    addOns: [],
  };
}

onMounted(() => {
  pickRandomProduct();
  initFormFromProduct();
});

watch(product, () => initFormFromProduct(), { immediate: false });

const totalPrice = computed(() => {
  const p = product.value;
  if (!p) return 0;
  let total = p.basePrice;
  for (const id of form.value.addOns) {
    const addon = p.addOns.find((a) => a.id === id);
    if (addon) total += addon.price;
  }
  return total * quantity.value;
});

function onBack() {
  router.back();
}

function addToCart() {
  const p = product.value;
  if (!p) return;
  const unitPrice = totalPrice.value / quantity.value;
  cartStore.addItem({
    productId: p.id,
    title: p.title,
    image: p.thumb ?? p.image ?? '/placeholder.png',
    form: {
      width: form.value.width,
      height: form.value.height,
      depth: form.value.depth,
      plinth: form.value.plinth,
      doorSide: form.value.doorSide,
      equipment: form.value.equipment,
      addOns: [...form.value.addOns],
    },
    quantity: quantity.value,
    unitPrice,
    lineTotal: totalPrice.value,
  });
  cartStore.requestDropdownOpen();
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
