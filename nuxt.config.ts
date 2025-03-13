// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },
    ssr: true,
    modules: ['@scalar/nuxt'],
    scalar: {
        theme: 'kepler',
        darkMode: false,
        hideDownloadButton: false,
        metaData: {
            title: 'Документация API',
            description: 'Документация API тестового задания',
        },
        showSidebar: true,
        hideModels: false,
        spec: {
            url: '/api/openapi',
        },
    },
});
