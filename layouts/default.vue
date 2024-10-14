<template>
    <div :dir="direction" class="min-h-screen bg-gray-900 text-white font-newrudaw">
        <Header />
        <main class="container mx-auto px-4">
            <slot />
        </main>
        <Footer />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNuxtApp } from '#app'
import Header from '@/layouts/Header.vue'
import Footer from '@/layouts/Footer.vue'

const { $isRTL } = useNuxtApp()
const { locale } = useI18n()

const direction = computed(() => $isRTL(locale.value) ? 'rtl' : 'ltr')
</script>

<style>
@font-face {
    font-family: 'NewRudaw';
    src: url('/fonts/NewRudaw-Bold.woff2') format('woff2'),
        url('/fonts/NewRudaw-Bold.woff') format('woff'),
        url('/fonts/NewRudaw-Bold.ttf') format('truetype'),
        url('/fonts/NewRudaw-Bold.eot') format('embedded-opentype');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
}

.font-newrudaw {
    font-family: 'NewRudaw', sans-serif;
}
</style>