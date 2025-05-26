import Aura from '@primeuix/themes/aura'

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  modules: [
    '@primevue/nuxt-module',
    '@zadigetvoltaire/nuxt-gtm',
  ],
  gtm: {
    id: process.env.GTM_ID || '',
    enabled: true,
    debug: process.env.NODE_ENV === 'development',
    loadScript: true,
    enableRouterSync: false
  },
  primevue: {
    options: {
      ripple: true,
      inputVariant: 'filled',
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: null,
          cssLayer: false
        }
      }
    }
  },
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
})
