// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/fonts', '@pinia/nuxt', '@nuxtjs/i18n', 'pinia-plugin-persistedstate/nuxt'],
  runtimeConfig: {
    strapiUrl: '', // overridden by NUXT_STRAPI_URL
    strapiToken: '', // overridden by NUXT_STRAPI_TOKEN
  },
  i18n: {
    defaultLocale: 'nl',
    locales: [
      { code: 'nl', language: 'nl-BE', name: 'Nederlands', file: 'nl.json' },
      { code: 'en', language: 'en-GB', name: 'English', file: 'en.json' },
    ],
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      fallbackLocale: 'nl',
    },
  },
});
