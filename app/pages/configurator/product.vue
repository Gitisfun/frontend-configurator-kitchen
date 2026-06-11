<template>
  <BaseConfiguratorTemplate class="configurator-product-page" :title="product?.title ?? ''" :show-actions="pending || !!fetchError || (!productId && !seriesId) || !!product">
    <template #before>
      <NuxtLink :to="subcategoriesRoute" class="configurator-product-page__back-link"> terug naar kasten </NuxtLink>
    </template>

    <template #default>
      <p v-if="!productId && !seriesId" class="configurator-product-page__notice">Geen product geselecteerd. Ga terug en kies een product of serie.</p>
      <p v-else-if="fetchError" class="configurator-product-page__notice">Kon het product niet laden. Probeer het opnieuw.</p>
      <template v-else-if="pending">
        <div class="configurator-main__inner configurator-product-page__skeleton-layout" aria-busy="true" aria-label="Product laden">
          <header class="configurator-product-page__header">
            <div class="product-skeleton product-skeleton--title product-skeleton__shimmer" />
          </header>

          <div class="configurator-product-page__media">
            <div class="product-skeleton product-skeleton--image product-skeleton__shimmer" />
            <div class="product-skeleton product-skeleton--thumb product-skeleton__shimmer" />
          </div>

          <div class="configurator-product-page__column configurator-product-page__column--formaat">
            <div class="product-skeleton product-skeleton--section-title product-skeleton__shimmer" />
            <div v-for="n in 4" :key="`select-${n}`" class="product-skeleton product-skeleton--select product-skeleton__shimmer" />
            <div class="product-skeleton-radios">
              <div class="product-skeleton product-skeleton--radio product-skeleton__shimmer" />
              <div class="product-skeleton product-skeleton--radio product-skeleton__shimmer" />
            </div>
            <div class="product-skeleton-qty-price">
              <div class="product-skeleton product-skeleton--qty product-skeleton__shimmer" />
              <div class="product-skeleton product-skeleton--price product-skeleton__shimmer" />
            </div>
          </div>

          <div class="configurator-product-page__column configurator-product-page__column--details">
            <div class="product-skeleton product-skeleton--section-title product-skeleton__shimmer" />
            <div class="product-skeleton-lines">
              <div v-for="(width, i) in detailLineWidths" :key="`line-${i}`" class="product-skeleton product-skeleton--line product-skeleton__shimmer" :style="{ width }" />
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="product">
        <div class="configurator-main__inner">
          <div class="configurator-product-page__media">
            <img :src="product.image" alt="Product" class="configurator-product-page__image" width="600" height="400" />
            <img :src="product.thumb ?? product.image" alt="Product variant" class="configurator-product-page__thumb" width="120" height="120" />
          </div>

          <div class="configurator-product-page__column configurator-product-page__column--formaat">
            <div class="configurator-product-page__section">
              <BaseHeader size="small" as="h2" align="left" color="primary" class="configurator-product-page__section-title"> Selecteer formaat </BaseHeader>
              <div class="configurator-product-page__selects">
                <BaseSelect v-model="form.width" :options="product.dimensions.width" label="Breedte" />
                <BaseSelect v-model="form.height" :options="product.dimensions.height" label="Hoogte" />
                <BaseSelect v-model="form.depth" :options="product.dimensions.depth" label="Diepte" />
                <BaseSelect v-if="product.dimensions.plinth.length > 0" v-model="form.plinth" :options="product.dimensions.plinth" label="Plint" />
              </div>
              <fieldset v-if="product.doorSwing.leftLabel || product.doorSwing.rightLabel" class="configurator-product-page__radios" aria-label="Deurrichting">
                <BaseRadioButton v-model="form.doorSide" name="doorSide" value="left" :label="product.doorSwing.leftLabel ?? 'Deur links'" />
                <BaseRadioButton v-model="form.doorSide" name="doorSide" value="right" :label="product.doorSwing.rightLabel ?? 'Deur rechts'" />
              </fieldset>
            </div>
            <div v-if="product.addOns.length" class="configurator-product-page__section">
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
            <div v-if="product.productInformation.length > 0" class="configurator-product-page__section">
              <BaseHeader size="small" as="h2" align="left" color="primary" class="configurator-product-page__section-title"> Productinformatie </BaseHeader>
              <ul class="configurator-product-page__bullets">
                <li v-for="(info, i) in product.productInformation" :key="i">
                  <BaseParagraph size="small" align="left" color="primary">{{ info }}</BaseParagraph>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </template>
    </template>

    <template #actions>
      <div v-if="pending" class="configurator-main__actions--skeleton" aria-hidden="true">
        <div class="product-skeleton product-skeleton--btn-back product-skeleton__shimmer" />
        <div class="product-skeleton product-skeleton--btn-next product-skeleton__shimmer" />
      </div>
      <BaseButtons v-else-if="fetchError || (!productId && !seriesId) || product" back-label="terug" next-label="voeg toe aan winkelwagen" :show-next="!!product && !fetchError" @back="onBack" @next="addToCart" />
    </template>
  </BaseConfiguratorTemplate>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useConfiguratorCategoryStep } from '../../composables/useConfiguratorCategoryStep';
import { useConfiguratorProduct } from '../../composables/api/useConfiguratorProduct';
import { useCartStore } from '../../../stores/cart';
import { trimmedRouteQueryParam } from '../../utils/routeQuery';
import { useStepperStore } from '../../../stores/stepper';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const stepperStore = useStepperStore();

console.log('stepperStore', stepperStore.stepOne);
console.log('stepperStore', stepperStore.stepTwo);

const { subcategoriesRoute } = useConfiguratorCategoryStep();

const productId = computed(() => trimmedRouteQueryParam(route.query.product));
const seriesId = computed(() => trimmedRouteQueryParam(route.query.series));

const { product, pending, error: fetchError } = await useConfiguratorProduct(productId, seriesId);

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

/** Varied widths for product-info skeleton lines. */
const detailLineWidths = ['100%', '88%', '72%', '94%', '65%', '80%'];

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

watch(product, () => initFormFromProduct(), { immediate: true });

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
  router.push(subcategoriesRoute.value);
}

function addToCart() {
  const p = product.value;
  if (!p) return;
  const unitPrice = totalPrice.value / quantity.value;
  cartStore.addItem({
    productId: p.id,
    title: p.title,
    image: p.thumb ?? p.image,
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
.configurator-product-page__back-link {
  position: absolute;
  top: 0;
  right: var(--intro-padding-x);
  font-family: var(--font-sans);
  font-size: var(--paragraph-size-small);
  color: var(--color-text-primary);
  text-decoration: underline;
}

.configurator-product-page__back-link:hover {
  color: var(--color-brand);
}

.configurator-product-page__notice {
  margin: 0 auto;
  max-width: var(--intro-max-width);
  font-family: var(--font-sans);
  font-size: var(--paragraph-size-medium);
  color: var(--color-text-muted);
}

.product-skeleton {
  border-radius: var(--picker-radius);
  background-color: var(--color-surface-hover);
}

.product-skeleton__shimmer {
  position: relative;
  overflow: hidden;
}

.product-skeleton__shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 0%, transparent 40%, rgba(255, 255, 255, 0.55) 50%, transparent 60%, transparent 100%);
  transform: translateX(-100%);
  animation: product-skeleton-shimmer 1.5s ease-in-out infinite;
}

.product-skeleton--title {
  height: 2.25rem;
  width: min(420px, 70%);
  border-radius: 6px;
}

.product-skeleton--image {
  width: 100%;
  max-width: 480px;
  aspect-ratio: 4 / 3;
  border: 1px solid #e8e3da;
  background-color: #f5f1ec;
  border-radius: var(--picker-radius);
}

.product-skeleton--thumb {
  width: 80px;
  height: 80px;
  border: 1px solid #e8e3da;
  background-color: #f5f1ec;
  border-radius: var(--picker-radius);
}

.product-skeleton--section-title {
  height: 1.125rem;
  width: 55%;
  max-width: 200px;
  margin-bottom: 0.25rem;
}

.product-skeleton--select {
  height: 52px;
  width: 100%;
  border: 1px solid var(--picker-border);
  background-color: var(--color-surface);
}

.product-skeleton-radios {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 0.25rem;
}

.product-skeleton--radio {
  height: 1.25rem;
  width: 7.5rem;
  border-radius: 999px;
}

.product-skeleton-qty-price {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
}

.product-skeleton--qty {
  height: 72px;
  width: 5.5rem;
}

.product-skeleton--price {
  height: 1.75rem;
  width: 6.5rem;
}

.product-skeleton-lines {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin-top: 0.5rem;
  padding-left: 0.25rem;
}

.product-skeleton--line {
  height: 0.8125rem;
  border-radius: 4px;
}

.configurator-product-page__skeleton-layout .configurator-product-page__column--formaat {
  gap: 0.75rem;
}

.configurator-product-page__skeleton-layout .configurator-product-page__column--details {
  gap: 0.5rem;
}

.configurator-main__actions--skeleton {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.product-skeleton--btn-back {
  height: 44px;
  width: 7.5rem;
  border: 1px solid var(--picker-border);
  background-color: var(--color-surface);
}

.product-skeleton--btn-next {
  height: 44px;
  width: min(280px, 55%);
  background-color: color-mix(in srgb, var(--color-brand) 35%, var(--color-surface-hover));
}

.configurator-product-page__skeleton-layout .product-skeleton--image::after {
  animation-delay: 0.05s;
}

.configurator-product-page__skeleton-layout .product-skeleton--thumb::after {
  animation-delay: 0.1s;
}

.configurator-product-page__skeleton-layout .product-skeleton--select:nth-child(2)::after {
  animation-delay: 0.08s;
}

.configurator-product-page__skeleton-layout .product-skeleton--select:nth-child(3)::after {
  animation-delay: 0.12s;
}

.configurator-product-page__skeleton-layout .product-skeleton--select:nth-child(4)::after {
  animation-delay: 0.16s;
}

.configurator-product-page__skeleton-layout .product-skeleton--select:nth-child(5)::after {
  animation-delay: 0.2s;
}

@keyframes product-skeleton-shimmer {
  100% {
    transform: translateX(100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .product-skeleton__shimmer::after {
    animation: none;
    opacity: 0.35;
  }
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
  background-color: #f5f1ec;
  object-fit: contain;
}

.configurator-product-page__thumb {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: var(--picker-radius);
  border: 1px solid var(--picker-border);
  background-color: #f5f1ec;
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
  .configurator-product-page__back-link {
    right: var(--intro-padding-x-desktop);
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
}
</style>
