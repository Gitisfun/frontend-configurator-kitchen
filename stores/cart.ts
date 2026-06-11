import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

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

export const useCartStore = defineStore(
  'cart',
  () => {
    const items = ref<CartLineItem[]>([]);
    const shouldOpenDropdown = ref(false);

    const itemCount = computed(() => items.value.reduce((sum, line) => sum + line.quantity, 0));

    const total = computed(() => items.value.reduce((sum, line) => sum + line.lineTotal, 0));

    const itemsForDropdown = computed(() =>
      items.value.map((line) => ({
        name: line.title + (line.form.width ? ` ${line.form.width}×${line.form.height} cm` : ''),
        price: line.lineTotal,
      })),
    );

    function addItem(item: Omit<CartLineItem, 'id'>): void {
      const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `cart-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

      items.value.push({
        ...item,
        id,
      });
    }

    function removeItem(id: string): void {
      items.value = items.value.filter((line) => line.id !== id);
    }

    function updateQuantity(id: string, quantity: number): void {
      const q = Math.max(1, Math.min(99, Math.floor(quantity)));

      const line = items.value.find((item) => item.id === id);

      if (line) {
        line.quantity = q;
        line.lineTotal = line.unitPrice * q;
      }
    }

    function clear(): void {
      items.value = [];
    }

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
  },
  {
    persist: {
      pick: ['items'],
    },
  },
);
