<template>
    <div class="custom-datatable bg-gray-900 p-6 rounded-lg shadow-xl" :class="{ 'rtl': isRTL }">
        <!-- Search input -->
        <div class="mb-6 relative">
            <input v-model="searchQuery" :placeholder="t('general.search')"
                class="w-full p-3 pr-10 rtl:pl-10 bg-gray-800 border-none rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-300" />
            <svg xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-500 absolute top-1/2 transform -translate-y-1/2 transition-all duration-300"
                :class="{ 'right-3': isRTL, 'left-3': !isRTL }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>

        <!-- Table Header (Sticky) -->
        <div class="sticky top-0 bg-gray-900 z-10 mb-4 py-2 border-b border-gray-700">
            <div class="grid" :class="gridColsClass">
                <div v-for="column in columns" :key="column"
                    class="px-4 text-amber-500 font-semibold transition-all duration-300 hover:text-amber-400"
                    :class="{ 'text-right': isRTL && column !== 'img' }">
                    {{ t(`general.${column}`) }}
                </div>
            </div>
        </div>

        <!-- Table Body -->
        <div class="space-y-4">
            <div v-for="(item, index) in paginatedData" :key="item.id"
                class="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] hover:bg-gray-750"
                :class="{ 'animate-fade-in': !isLoading }" :style="{ animationDelay: `${index * 50}ms` }">
                <div class="grid items-center" :class="gridColsClass">
                    <div v-for="column in columns" :key="column"
                        class="px-4 py-3 text-white transition-all duration-300"
                        :class="{ 'text-right': isRTL && column !== 'img' }">
                        <template v-if="column === 'img'">
                            <img :src="item[column]" :alt="item.name" class="w-10 h-10 object-cover rounded-full">
                        </template>
                        <template v-else>
                            {{ item[column] }}
                        </template>
                    </div>
                </div>
            </div>
            <!-- Loading skeleton -->
            <div v-if="isLoading" v-for="i in itemsPerPage" :key="i" class="animate-pulse bg-gray-800 rounded-lg p-4">
                <div class="grid" :class="gridColsClass">
                    <div v-for="column in columns" :key="column"
                        :class="{ 'h-10 w-10 rounded-full': column === 'img', 'h-8': column !== 'img' }"
                        class="bg-gray-700 rounded"></div>
                </div>
            </div>
        </div>

        <!-- Pagination controls -->
        <div class="mt-6 flex flex-col sm:flex-row justify-between items-center">
            <div class="flex items-center space-x-4 mb-4 sm:mb-0" :class="{ 'space-x-reverse': isRTL }">
                <span class="text-white">{{ t('general.total') }}: {{ totalItems }}</span>
                <select v-model="itemsPerPage"
                    class="p-2 bg-gray-800 border-none rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-300">
                    <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
                        {{ option }} {{ t('general.per_page') }}
                    </option>
                </select>
            </div>
            <div class="flex items-center space-x-2" :class="{ 'space-x-reverse': isRTL }">
                <button @click="prevPage" :disabled="currentPage === 1"
                    class="p-2 bg-gray-800 text-white rounded-full hover:bg-amber-500 focus:outline-none transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-300"
                        :class="{ 'transform rotate-180': isRTL }" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <span class="text-white">{{ t('general.page') }} {{ currentPage }} {{ t('general.of') }} {{ totalPages
                    }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="p-2 bg-gray-800 text-white rounded-full hover:bg-amber-500 focus:outline-none transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-300"
                        :class="{ 'transform rotate-180': isRTL }" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

interface Props {
    data: Array<Record<string, any>>;
    columns: string[];
    isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    isLoading: false
});

const isRTL = computed(() => ['ar', 'ku', 'ckb'].includes(locale.value));

const gridColsClass = computed(() => {
    return `grid-cols-7`;
});

const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const itemsPerPageOptions = [5, 10, 20, 50];

const filteredData = computed(() => {
    return props.data.filter(item =>
        Object.values(item).some(value =>
            value.toString().toLowerCase().includes(searchQuery.value.toLowerCase())
        )
    );
});

const totalItems = computed(() => filteredData.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredData.value.slice(start, end);
});

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

watch(itemsPerPage, () => {
    currentPage.value = 1;
});

watch(searchQuery, () => {
    currentPage.value = 1;
});
</script>

<style scoped>
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
}

.rtl {
    direction: rtl;
}
</style>