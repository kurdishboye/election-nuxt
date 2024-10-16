<template>
    <div class="bg-gray-800 p-4 rounded-lg">
      <h3 class="text-xl font-bold text-amber-500 mb-4">{{ t('general.regional_results') }}</h3>
      <KurdistanMap @regionClick="selectRegion" />
      <div v-if="selectedRegion" class="mt-4">
        <h4 class="text-lg font-semibold mb-2">{{ selectedRegion.region }}</h4>
        <ul>
          <li v-for="result in selectedRegion.partyResults" :key="result.partyId" class="mb-2">
            <span>{{ getPartyName(result.partyId) }}: {{ result.votes }} votes ({{ result.percentage }}%)</span>
            <div class="w-full bg-gray-600 rounded-full h-2 mt-1">
              <div class="bg-amber-500 h-2 rounded-full" :style="{ width: `${result.percentage}%` }"></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import KurdistanMap from '~/components/kurdistan-map.vue';
  
  const props = defineProps({
    regionalData: {
      type: Array,
      required: true
    },
    parties: {
      type: Array,
      required: true
    }
  });
  
  const { t } = useI18n();
  
  const selectedRegion = ref(null);
  
  const selectRegion = (regionName) => {
    selectedRegion.value = props.regionalData.find(region => region.region === regionName);
  };
  
  const getPartyName = (partyId) => {
    const party = props.parties.find(p => p.id === partyId);
    return party ? party.name : 'Unknown Party';
  };
  </script>