<template>
    <div class="bg-gray-800 p-4 rounded-lg mb-6">
      <h3 class="text-xl font-bold text-amber-500 mb-4">{{ t('general.party_details') }}</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p>{{ t('general.total_votes') }}: {{ formatNumber(party.votes) }}</p>
          <p>{{ t('general.seats_won') }}: {{ party.seats }}</p>
          <p>{{ t('general.vote_percentage') }}: {{ party.percentage }}%</p>
        </div>
        <div>
          <client-only>
            <Pie :chart-data="chartData" :chart-options="chartOptions" class="h-40" />
          </client-only>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Pie } from 'vue-chartjs';
  import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
  
  ChartJS.register(Title, Tooltip, Legend, ArcElement);
  
  const props = defineProps({
    party: {
      type: Object,
      required: true
    }
  });
  
  const { t } = useI18n();
  
  const formatNumber = (number) => {
    return new Intl.NumberFormat('ku-IQ').format(number);
  };
  
  const chartData = computed(() => ({
    labels: [t('general.party_votes'), t('general.other_votes')],
    datasets: [{
      data: [props.party.votes, 100 - props.party.votes],
      backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(201, 203, 207, 0.6)']
    }]
  }));
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };
  </script>