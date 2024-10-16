<template>
    <div class="bg-gray-800 p-4 rounded-lg">
      <h3 class="text-xl font-bold text-amber-500 mb-4">{{ t('general.parliament_seats') }}</h3>
      <svg :width="width" :height="height" class="mx-auto">
        <g :transform="`translate(${width / 2}, ${height})`">
          <path
            d="M-250,0 A250,250 0 0,1 250,0"
            fill="none"
            stroke="#666"
            stroke-width="2"
          />
          <circle
            v-for="seat in seats"
            :key="seat.id"
            :cx="seat.x"
            :cy="seat.y"
            :r="seatSize"
            :fill="seat.color"
          />
        </g>
      </svg>
      <div class="flex flex-wrap justify-center mt-4">
        <div v-for="party in parties" :key="party.id" class="flex items-center mx-2 mb-2">
          <div :style="{ backgroundColor: party.color }" class="w-4 h-4 rounded-full mr-2"></div>
          <span>{{ party.name }} ({{ party.seats }})</span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  
  const props = defineProps({
    parties: {
      type: Array,
      required: true
    }
  });
  
  const { t } = useI18n();
  
  const width = 500;
  const height = 250;
  const seatSize = 5;
  const radius = 240;
  
  const totalSeats = computed(() => props.parties.reduce((sum, party) => sum + party.seats, 0));
  
  const seats = computed(() => {
    let allSeats = [];
    let seatCount = 0;
    const angleStep = Math.PI / (totalSeats.value - 1);
  
    props.parties.forEach((party, index) => {
      const color = `hsl(${index * 360 / props.parties.length}, 70%, 50%)`;
      for (let i = 0; i < party.seats; i++) {
        const angle = seatCount * angleStep;
        allSeats.push({
          id: seatCount,
          x: Math.cos(angle) * radius,
          y: -Math.sin(angle) * radius,
          color: color
        });
        seatCount++;
      }
    });
  
    return allSeats;
  });
  </script>