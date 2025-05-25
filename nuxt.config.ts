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
runtimeConfig: {
  public: {
    gtm: {
      id: process.env.GTM_ID || '',
      enabled: true,
      debug: process.env.NODE_ENV === 'development',
      loadScript: true,
      enableRouterSync: false
    },
    BQ_PROJECT_ID: process.env.BQ_PROJECT_ID,
    BQ_EMULATOR_HOST: process.env.BQ_EMULATOR_HOST
  }
},
primevue: {
  options: {
      ripple: true,
      inputVariant: 'filled',
      theme: {
          preset: Aura,
          options: {
              prefix: 'p',
              darkModeSelector: null, // 'system' から null に変更してダークモードを無効化
              cssLayer: false
          }
      }
  }
},
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  
})
