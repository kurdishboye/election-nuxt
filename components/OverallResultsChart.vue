<template>
  <div class="bg-gray-800 p-4 rounded-lg">
    <h3 class="text-xl font-bold text-amber-500 mb-4">{{ t('general.overall_results') }}</h3>
    <client-only>
      <Bar v-if="isDataReady" :data="chartData" :options="chartOptions" class="max-h-64" />
      <p v-else class="text-center text-gray-400">{{ t('general.loading_data') }}</p>
    </client-only>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

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
        label: t('general.seats'),
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
  scales: {
    y: {
      beginAtZero: true
    }
  },
  plugins: {
    legend: {
      display: false // Hide legend as colors are already distinct
    }
  }
};

watch(() => props.parties, (newParties) => {
  isDataReady.value = newParties && newParties.length > 0 &&
    newParties.every(party => party.name && party.seats !== undefined && party.color);
}, { immediate: true });
</script>