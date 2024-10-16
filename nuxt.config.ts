// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  ssr:false,
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n'],
  plugins: [
    '~/plugins/i18n.js'
  ],
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
  },
  i18n: {
    langDir: 'lang',
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json' },
      { code: 'ku', iso: 'ku', file: 'ku.json' },
      { code: 'ckb', iso: 'ckb', file: 'ckb.json' },
      { code: 'ar', iso: 'ar-AR', file: 'ar.json' },
      { code: 'tr', iso: 'tr-TR', file: 'tr.json' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',  // recommended
    },
  },
})