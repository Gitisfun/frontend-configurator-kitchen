<template>
  <div
    :class="['locale-switcher', variant === 'navbar' ? 'locale-switcher--navbar' : 'locale-switcher--standalone']"
    role="group"
    :aria-label="t('common.locale.ariaLabel')"
  >
    <component
      :is="variant === 'navbar' ? 'span' : 'button'"
      v-for="loc in localeOptions"
      :key="loc.code"
      :type="variant === 'navbar' ? undefined : 'button'"
      role="button"
      :tabindex="variant === 'navbar' ? 0 : undefined"
      :class="[
        'locale-switcher__btn',
        variant === 'navbar' ? 'locale-switcher__btn--navbar' : 'locale-switcher__btn--standalone',
        { 'locale-switcher__btn--active': locale === loc.code },
      ]"
      :aria-pressed="locale === loc.code"
      @click="selectLocale(loc.code)"
      @keydown.enter.prevent="selectLocale(loc.code)"
      @keydown.space.prevent="selectLocale(loc.code)"
    >
      {{ loc.label }}
    </component>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
type LocaleCode = 'nl' | 'en';

withDefaults(
  defineProps<{
    /** `navbar` matches site header links; `standalone` for embedded forms. */
    variant?: 'navbar' | 'standalone';
  }>(),
  { variant: 'navbar' },
);

const { t, locale, locales, setLocale } = useI18n();

const localeOptions = computed(() =>
  locales.value.map((loc) => ({
    code: loc.code as LocaleCode,
    label: t(`common.locale.${loc.code as LocaleCode}`),
  })),
);

function selectLocale(code: LocaleCode) {
  if (locale.value === code) return;
  void setLocale(code);
}
</script>

<style scoped>
.locale-switcher {
  display: inline-flex;
  align-items: center;
  gap: 0;
}

.locale-switcher--navbar {
  gap: 0.75rem;
}

.locale-switcher__btn {
  margin: 0;
  cursor: pointer;
}

.locale-switcher--standalone {
  padding: 0.125rem;
  border: 1px solid var(--picker-border);
  border-radius: var(--button-radius-rounded);
  background: var(--color-surface);
}

.locale-switcher__btn--standalone {
  font: inherit;
  line-height: inherit;
  appearance: none;
  -webkit-appearance: none;
  box-shadow: none;
  font-family: var(--font-sans);
  font-size: var(--paragraph-size-small);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-muted);
  background: transparent;
  border: none;
  border-radius: var(--button-radius-rounded);
  padding: 0.35rem 0.75rem;
  transition:
    color 0.2s ease,
    background-color 0.2s ease;
}

.locale-switcher__btn--standalone:hover {
  color: var(--color-text-primary);
  background: var(--color-surface-hover);
}

.locale-switcher__btn--standalone.locale-switcher__btn--active {
  color: var(--color-text-primary);
  background: var(--color-surface-hover);
}

</style>
