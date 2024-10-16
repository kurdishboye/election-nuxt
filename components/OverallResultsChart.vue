<template>
    <div class="bg-gray-800 p-4 rounded-lg">
      <h3 class="text-xl font-bold text-amber-500 mb-4">{{ t('general.overall_results') }}</h3>
      <client-only>
        <Bar v-if="isDataReady" :chart-data="chartData" :chart-options="chartOptions" class="h-64" />
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
    if (!props.parties || props.parties.length === 0) {
      return null;
    }
    return {
      labels: props.parties.map(party => party.name),
      datasets: [
        {
          label: t('general.votes'),
          data: props.parties.map(party => party.votes),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        {
          label: t('general.seats'),
          data: props.parties.map(party => party.seats),
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
        }
      ]
    };
  });
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  
  watch(() => props.parties, (newParties) => {
    isDataReady.value = newParties && newParties.length > 0;
  }, { immediate: true });
  </script>