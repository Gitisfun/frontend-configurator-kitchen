// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/fonts', '@pinia/nuxt'],
  runtimeConfig: {
    strapiUrl: '',    // overridden by NUXT_STRAPI_URL
    strapiToken: '',  // overridden by NUXT_STRAPI_TOKEN
  },
})