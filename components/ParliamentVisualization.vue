<template>
  <div class="bg-gray-800 p-4 rounded-lg relative">
    <h3 class="text-xl font-bold text-amber-500 mb-4">{{ t('general.parliament_seats') }}</h3>
    <svg :width="width" height="250" class="mx-auto">
      <g :transform="`translate(${width / 2}, ${height / 2})`">
        <!-- Seats -->
        <circle v-for="seat in seats" :key="seat.id" :cx="seat.x" :cy="seat.y" :r="seatSize" :fill="seat.color"
          @mouseenter="showPartyInfo(seat.party)" @mouseleave="hidePartyInfo"
          class="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2" />

        <!-- Central display -->
        <g v-if="hoveredParty" class="p-3">
          <circle r="50" style="fill: transparent;" />
          <image :href="hoveredParty.logo" x="-25" y="-25" width="50" height="50" />
          <text y="50" text-anchor="middle" fill="white" class="font-bold text-2xl">{{ hoveredParty.seats }}</text>
        </g>
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

const width = 400;
const height = 400;
const seatSize = 6;
const rowCount = 5;
const innerRadius = 80;
const rowSpacing = 25;

const hoveredParty = ref(null);

const totalSeats = computed(() => props.parties.reduce((sum, party) => sum + party.seats, 0));

const seats = computed(() => {
  let allSeats = [];
  let seatCount = 0;

  props.parties.forEach((party) => {
    for (let i = 0; i < party.seats; i++) {
      const row = Math.floor(seatCount / (totalSeats.value / rowCount));
      const seatsInRow = totalSeats.value / rowCount;
      const angleStep = Math.PI / (seatsInRow - 1);
      const angle = (seatCount % seatsInRow) * angleStep;
      const radius = innerRadius + row * rowSpacing;

      allSeats.push({
        id: seatCount,
        x: Math.cos(angle) * radius,
        y: -Math.sin(angle) * radius,
        color: party.color,
        party: party
      });
      seatCount++;
    }
  });

  return allSeats;
});

const showPartyInfo = (party) => {
  hoveredParty.value = party;
};

const hidePartyInfo = () => {
  hoveredParty.value = null;
};
</script>

<style scoped>
/* Add any additional styles here */
</style>