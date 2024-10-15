<template>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <div v-for="candidate in candidatesWithPercentage" :key="candidate.id"
            class="bg-gray-700 p-4 rounded-lg text-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <img :src="candidate.image || defaultImage" :alt="candidate.name"
                class="w-24 h-24 rounded-full mx-auto mb-2 object-cover">
            <h3 class="text-lg font-semibold">{{ candidate.name }}</h3>
            <p class="text-sm text-gray-300">{{ t('general.votes') }}: {{ formatNumber(candidate.votes) }}</p>
            <p class="text-sm text-gray-300">{{ t('general.seats') }}: {{ candidate.seats || 0 }}</p>
            <div class="mt-2">
                <p class="text-sm text-gray-300">{{ t('general.percentage') }}: {{ candidate.percentage.toFixed(2) }}%
                </p>
                <div class="w-full bg-gray-600 rounded-full h-2 mt-1">
                    <div class="bg-amber-500 h-2 rounded-full transition-all duration-1000 ease-out"
                        :style="{ width: `${candidate.percentage}%` }"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
    candidates: {
        type: Array,
        required: true
    },
    totalVotes: {
        type: Number,
        required: true
    }
});

const defaultImage = 'https://s3.amazonaws.com/rudawelections.com.storage/tmp-images/logo-header.svg';

const formatNumber = (number) => {
    return new Intl.NumberFormat('ku-IQ').format(number);
};

const candidatesWithPercentage = computed(() => {
    return props.candidates.map(candidate => ({
        ...candidate,
        percentage: props.totalVotes > 0 ? (candidate.votes / props.totalVotes) * 100 : 0
    }));
});

onMounted(() => {
    setTimeout(() => {
        const bars = document.querySelectorAll('.bg-amber-500');
        bars.forEach(bar => {
            bar.style.width = bar.parentElement.dataset.percentage;
        });
    }, 100);
});
</script>