import { fileURLToPath } from 'node:url';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: false },
    modules: [
        '@nuxt/ui',
        '@nuxtjs/i18n',
        '@nuxt/content',
        '@pinia/nuxt',
    ],
    css: ['~/assets/css/main.css'],
    app: {
        head: {
            meta: [
                { name: 'robots', content: process.env.DEPLOY_ENV === 'prod' ? 'all' : 'noindex' },
            ],
        },
    },
    vite: {
        worker: {
            format: 'es',
        },
        optimizeDeps: {
            exclude: ['verovio'],
        },
    },
    i18n: {
        strategy: 'prefix_except_default',
        locales: [
            { code: 'de', language: 'de-DE', file: 'de.yaml', dir: 'ltr' },
        ],
        defaultLocale: 'de',
        langDir: 'locales/',
    },
    colorMode: {
        preference: 'light',
    },
    nitro: {
        routeRules: {
            '/kern/**': { prerender: false },
        },
       publicAssets: [
            {
                baseURL: 'kern/schumann-kinderszenen',
                dir: fileURLToPath(new URL('./corpus/schumann-kinderszenen/kern', import.meta.url)),
                maxAge: 3600,
            },
            {
                baseURL: 'kern/debussy-childrens-corner',
                dir: fileURLToPath(new URL('./corpus/debussy-childrens-corner/kern', import.meta.url)),
                maxAge: 3600,
            },
            {
                baseURL: 'kern/schumann-album-fuer-die-jugend',
                dir: fileURLToPath(new URL('./corpus/schumann-album-fuer-die-jugend/kern', import.meta.url)),
                maxAge: 3600,
            },
            {
                baseURL: 'kern/tchaikovsky-the-seasons',
                dir: fileURLToPath(new URL('./corpus/tchaikovsky-the-seasons/kern', import.meta.url)),
                maxAge: 3600,
            },
            {
                baseURL: 'kern/tchaikovsky-childrens-album',
                dir: fileURLToPath(new URL('./corpus/tchaikovsky-childrens-album/kern', import.meta.url)),
                maxAge: 3600,
            },
            {
                baseURL: 'kern/faure-dolly-suite',
                dir: fileURLToPath(new URL('./corpus/faure-dolly-suite/kern', import.meta.url)),
                maxAge: 3600,
            },
        ],
    },
});
