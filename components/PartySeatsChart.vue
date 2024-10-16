<template>
    <div class="bg-gray-800 p-4 rounded-lg">
        <h3 class="text-xl font-bold text-amber-500 mb-4">{{ t('general.seat_distribution') }}</h3>
        <client-only>
            <Pie v-if="isDataReady" :data="chartData" :options="chartOptions" class="max-h-64" />
            <p v-else class="text-center text-gray-400">{{ t('general.loading_data') }}</p>
        </client-only>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
    parties: {
        type: Array,
        required: true
    }
});

const { t } = useI18n();

const isDataReady = ref(false);

const chartData = computed(() => {
    if (!isDataReady.value) {
        return { labels: [], datasets: [] };
    }
    return {
        labels: props.parties.map(party => party.name),
        datasets: [
            {
                data: props.parties.map(party => party.seats),
                backgroundColor: props.parties.map(party => party.color),
                borderColor: props.parties.map(party => party.color),
                borderWidth: 1
            }
        ]
    };
});

const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: {
            position: 'right',
            labels: {
                color: 'white',
                font: {
                    size: 12
                }
            }
        },
        tooltip: {
            callbacks: {
                label: (context) => {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${label}: ${value} seats (${percentage}%)`;
                }
            }
        }
    }
};

watch(() => props.parties, (newParties) => {
    isDataReady.value = newParties && newParties.length > 0 &&
        newParties.every(party => party.name && party.seats !== undefined && party.color);
}, { immediate: true });
</script>