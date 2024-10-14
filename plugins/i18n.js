export default defineNuxtPlugin(() => {
    return {
        provide: {
            isRTL: (locale) => ['ar', 'ckb'].includes(locale)
        }
    }
})