import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export const CART_STORAGE_KEY = 'configurator-cart';

/** Form snapshot when adding to cart */
export interface CartItemForm {
  width: string;
  height: string;
  depth: string;
  plinth: string;
  doorSide: 'left' | 'right';
  equipment: string;
  addOns: string[];
}

export interface CartLineItem {
  id: string;
  productId: string;
  title: string;
  image: string;
  form: CartItemForm;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

function getStoredCart(): CartLineItem[] {
  if (import.meta.server) return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw == null) return [];
    const parsed = JSON.parse(raw) as CartLineItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartLineItem[]): void {
  if (import.meta.server) return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartLineItem[]>(getStoredCart());

  watch(
    items,
    (value) => {
      saveCart(value);
    },
    { deep: true }
  );

  const itemCount = computed(() => items.value.reduce((sum, line) => sum + line.quantity, 0));
  const total = computed(() => items.value.reduce((sum, line) => sum + line.lineTotal, 0));

  /** For navbar dropdown: { name, price } per line */
  const itemsForDropdown = computed(() =>
    items.value.map((line) => ({
      name: line.title + (line.form.width ? ` ${line.form.width}×${line.form.height} cm` : ''),
      price: line.lineTotal,
    }))
  );

  function addItem(item: Omit<CartLineItem, 'id'>): void {
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `cart-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    items.value = [...items.value, { ...item, id }];
  }

  function removeItem(id: string): void {
    items.value = items.value.filter((line) => line.id !== id);
  }

  function updateQuantity(id: string, quantity: number): void {
    const q = Math.max(1, Math.min(99, Math.floor(quantity)));
    const idx = items.value.findIndex((line) => line.id === id);
    if (idx === -1) return;
    const line = items.value[idx];
    items.value = items.value.slice();
    items.value[idx] = { ...line, quantity: q, lineTotal: line.unitPrice * q };
  }

  function clear(): void {
    items.value = [];
  }

  /** When true, BaseCart should open its dropdown (e.g. after add-to-cart + navigate to /cart). */
  const shouldOpenDropdown = ref(false);

  function requestDropdownOpen(): void {
    shouldOpenDropdown.value = true;
  }

  function clearDropdownOpen(): void {
    shouldOpenDropdown.value = false;
  }

  return {
    items,
    itemCount,
    total,
    itemsForDropdown,
    shouldOpenDropdown,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    requestDropdownOpen,
    clearDropdownOpen,
  };
});
