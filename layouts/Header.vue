<template>
    <header class="mt-6">
        <nav class="p-4">
            <div
                class="flex justify-between items-center px-5 py-1 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full">
                <div class="flex items-center">
                    <div class="election-logo animate__animated animate__fadeIn">
                        <a href="#"><img
                                src="https://s3.amazonaws.com/rudawelections.com.storage/tmp-images/election-logo.svg"
                                class="w-[60px] h-auto" alt="Rudaw" title="Rudaw"></a>
                    </div>
                    <div class="logo animate__animated animate__fadeIn ltr:ml-4 rtl:mr-4">
                        <NuxtLink :to="localePath('/')"><img
                                src="https://s3.amazonaws.com/rudawelections.com.storage/tmp-images/logo-header.svg"
                                class="w-[120px] h-auto" alt="Rudaw" title="Rudaw"></NuxtLink>
                    </div>
                </div>

                <div class="hidden md:block">
                    <ul :class="['flex text-lg', isRTL ? 'flex-row-reverse' : 'flex-row']">
                        <li v-for="item in menuItems" :key="item.route"
                            class="ltr:ml-10 rtl:mr-10 first:ltr:ml-0 first:rtl:mr-0 animate__animated animate__fadeIn relative"
                            :class="{ 'active': isActive(item.route) }">
                            <NuxtLink :to="localePath(item.route)" class="text-gray-300 hover:text-white">
                                {{ $t(item.label) }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>
                <div class="md:hidden cursor-pointer" @click="openMenu">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-8 h-8 text-white"
                        viewBox="0 0 16 16">
                        <path fill-rule="evenodd"
                            d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
                    </svg>
                </div>
            </div>
        </nav>
        <div v-if="isMobileMenuOpen" class="mt-5 bg-gray-800 bg-opacity-40 rounded-3xl p-4">
            <div class="flex flex-col items-center">
                <div v-for="item in menuItems" :key="item.route" class="text-center text-2xl mb-5 last:mb-0"
                    :class="{ 'active': isActive(item.route) }">
                    <NuxtLink :to="localePath(item.route)" class="text-gray-300 hover:text-white">
                        {{ $t(item.label) }}
                    </NuxtLink>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNuxtApp, useRoute } from '#app'

const { locale, t } = useI18n()
const { $isRTL } = useNuxtApp()
const route = useRoute()

const isRTL = computed(() => $isRTL(locale.value))

const isMobileMenuOpen = ref(false)

const menuItems = [
    { route: '/', label: 'general.interactive_map', activeClass: 'interactive_map_active' },
    { route: '/raprsy', label: 'general.raprsy', activeClass: 'survey_active' },
    { route: '/ancamakan', label: 'general.results', activeClass: 'ancam_active' }
]

function openMenu() {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function isActive(routePath) {
    return route.path.includes(routePath)
}
</script>

<style scoped>
.active::after {
    content: "";
    @apply absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-gray-800 to-orange-500;
    animation: slideInRight 1s;
}

@keyframes slideInRight {
    from {
        transform: translateX(-100%);
    }

    to {
        transform: translateX(0);
    }
}

[dir="rtl"] .active::after {
    animation: slideInLeft 1s;
}

@keyframes slideInLeft {
    from {
        transform: translateX(100%);
    }

    to {
        transform: translateX(0);
    }
}
</style>