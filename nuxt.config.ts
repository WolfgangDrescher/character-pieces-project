// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: false },
    modules: [
        '@nuxt/ui',
    ],
    css: ['~/assets/css/main.css'],
    i18n: {
        strategy: 'prefix_except_default',
        locales: [
            { code: 'de', language: 'de-DE', file: 'de.yaml', dir: 'ltr' },
        ],
        defaultLocale: 'de',
        langDir: 'locales/',
    },
});
