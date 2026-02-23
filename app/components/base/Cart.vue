<template>
  <div class="cart-wrap" @mouseenter="dropdownOpen = true" @mouseleave="dropdownOpen = false">
    <NuxtLink :to="to" class="cart" :class="{ 'cart--pill': itemCount > 0 }" :aria-label="itemCount > 0 ? `Winkelwagen: ${itemCount} artikelen, ${total},-` : 'Winkelwagen'" :aria-expanded="dropdownOpen && itemCount > 0">
      <template v-if="itemCount > 0">
        <span class="cart__text">
          <span class="cart__count">{{ itemCount }} {{ itemCount === 1 ? 'artikel' : 'artikelen' }}</span>
          <span class="cart__total">{{ total }},-</span>
        </span>
        <span class="cart__icon-wrap">
          <svg class="cart__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </span>
      </template>
      <template v-else>
        <svg class="cart__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      </template>
    </NuxtLink>

    <Transition name="cart-drop">
      <div v-if="itemCount > 0 && dropdownOpen" class="cart-dropdown" role="dialog" aria-label="Winkelwagen overzicht">
        <div class="cart-dropdown__header">
          <span class="cart-dropdown__summary">{{ itemCount }} {{ itemCount === 1 ? 'artikel' : 'artikelen' }}</span>
          <span class="cart-dropdown__total">{{ total }},-</span>
        </div>

        <ul class="cart-dropdown__list" role="list">
          <li v-for="(line, i) in cartLines" :key="i" class="cart-dropdown__item">
            <span class="cart-dropdown__item-name">{{ line.name }}</span>
            <span class="cart-dropdown__item-price">{{ line.price }},-</span>
          </li>
        </ul>

        <div class="cart-dropdown__footer">
          <div class="cart-dropdown__row">
            <span class="cart-dropdown__label">Totaalbedrag</span>
            <span class="cart-dropdown__total">{{ total }},-</span>
          </div>

          <div class="cart-dropdown__actions">
            <BaseButton variant="primary" size="small" rounded full-width class="cart-dropdown__btn" @click.prevent="goToCart">
              <template #iconLeft>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </template>
              Winkelwagen bekijken
            </BaseButton>
            <BaseButton variant="outlined" size="small" rounded full-width class="cart-dropdown__btn" @click.prevent="onSaveCart">
              <template #iconLeft>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </template>
              Winkelwagen opslaan
            </BaseButton>
            <NuxtLink to="/configurator" class="cart-dropdown__link" @click="dropdownOpen = false"> verder winkelen </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

interface Props {
  itemCount?: number;
  total?: number;
  to?: string;
  /** Line items for dropdown (hardcoded for now). */
  items?: { name: string; price: number }[];
}

const props = withDefaults(defineProps<Props>(), {
  itemCount: 0,
  total: 0,
  to: '/cart',
  items: () => [],
});

const router = useRouter();
const dropdownOpen = ref(false);

const cartLines = computed(() => {
  if (props.items.length > 0) return props.items;
  if (props.itemCount > 0 && props.total > 0) {
    const priceEach = Math.round(props.total / props.itemCount);
    return Array.from({ length: props.itemCount }, () => ({
      name: 'Bovenkast voor magnetron',
      price: priceEach,
    }));
  }
  return [];
});

function goToCart() {
  dropdownOpen.value = false;
  router.push(props.to);
}

function onSaveCart() {
  dropdownOpen.value = false;
  console.log('Save cart');
}
</script>

<style scoped>
.cart-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.cart {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--nav-link-color, var(--navbar-link-color));
  text-decoration: none;
  padding: 0.35rem;
  margin-left: 0.5rem;
  border-radius: var(--button-radius-rounded);
  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.cart:hover {
  color: var(--navbar-link-color-active);
}

.cart:focus-visible {
  outline: var(--button-focus-ring);
  outline-offset: var(--button-focus-offset);
}

.cart--pill {
  padding: 0.5rem 0.5rem 0.5rem 1rem;
  margin-left: 0.75rem;
  border-radius: 9999px;
  border: 1px solid var(--picker-border);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  box-shadow: 0 1px 3px rgba(27, 58, 92, 0.06);
  gap: 0;
}

.cart--pill:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-text-muted-light);
  color: var(--color-text-primary);
  box-shadow: 0 2px 8px rgba(27, 58, 92, 0.08);
}

.cart__text {
  display: inline-flex;
  align-items: baseline;
  gap: 0.375rem;
  font-family: var(--font-sans);
  font-size: var(--picker-value-font-size);
  letter-spacing: var(--letter-spacing-body);
  white-space: nowrap;
}

.cart__count {
  color: var(--color-text-muted);
  font-weight: var(--font-weight-medium);
}

.cart__total {
  color: var(--color-text-primary);
  font-weight: 600;
}

.cart__icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.25rem;
  height: 2.25rem;
  margin-left: 0.5rem;
  border-radius: 50%;
  background-color: var(--color-text-primary);
  color: var(--color-text-light);
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.cart--pill:hover .cart__icon-wrap {
  background-color: var(--color-brand-secondary-hover);
}

.cart--pill .cart__icon {
  display: block;
}

.cart__icon {
  display: block;
}

/* Dropdown */
.cart-dropdown {
  position: absolute;
  top: calc(100% + 0.25rem);
  right: 0;
  width: min(360px, calc(100vw - 2rem));
  background: var(--color-surface);
  border: 1px solid var(--picker-border);
  border-radius: var(--panel-radius);
  box-shadow: var(--panel-shadow);
  z-index: 101;
  overflow: hidden;
}

.cart-dropdown__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--panel-header-padding);
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: var(--picker-value-font-size-desktop);
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--picker-border);
}

.cart-dropdown__summary {
  color: var(--color-text-muted);
}

.cart-dropdown__total {
  color: var(--color-text-primary);
}

.cart-dropdown__list {
  margin: 0;
  padding: 0;
  list-style: none;
  max-height: 240px;
  overflow-y: auto;
}

.cart-dropdown__item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5rem;
  padding: var(--picker-padding-y) var(--panel-body-padding);
  border-bottom: 1px solid var(--picker-border);
  font-family: var(--font-sans);
  font-size: var(--picker-value-font-size);
  color: var(--color-text-primary);
}

.cart-dropdown__item-name {
  flex: 1;
  min-width: 0;
}

.cart-dropdown__item-price {
  flex-shrink: 0;
  color: var(--color-text-muted);
}

.cart-dropdown__footer {
  padding: var(--panel-body-padding);
  border-top: 1px solid var(--picker-border);
}

.cart-dropdown__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-family: var(--font-sans);
  font-size: var(--picker-value-font-size);
  color: var(--color-text-primary);
}

.cart-dropdown__label {
  color: var(--color-text-muted);
}

.cart-dropdown__actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cart-dropdown__btn {
  margin: 0;
  gap: 0.75rem;
  text-transform: capitalize;
}

.cart-dropdown__link {
  display: block;
  text-align: center;
  margin-top: 0.75rem;
  font-family: var(--font-sans);
  font-size: var(--paragraph-size-small);
  color: var(--color-text-primary);
  text-decoration: underline;
  transition: color 0.2s ease;
}

.cart-dropdown__link:hover {
  color: var(--color-brand);
}

.cart-drop-enter-active,
.cart-drop-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.cart-drop-enter-from,
.cart-drop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (min-width: 768px) {
  .cart__text {
    font-size: var(--picker-value-font-size-desktop);
  }

  .cart--pill {
    padding: 0.5625rem 0.5625rem 0.5625rem 1.125rem;
  }

  .cart__icon-wrap {
    width: 2.375rem;
    height: 2.375rem;
    margin-left: 0.625rem;
  }

  .cart--pill .cart__icon {
    width: 22px;
    height: 22px;
  }
}
</style>
