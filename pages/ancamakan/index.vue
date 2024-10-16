<template>
  <div class="min-h-screen bg-gray-900 text-white py-6 px-4 sm:px-6 lg:px-8" :class="{ 'rtl': isRTL }">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-amber-500 mb-8">{{ t('general.election_results') }}</h1>

      <!-- Overall Results Summary -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-amber-500 mb-4">{{ t('general.overall_results') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <OverallResultsChart :parties="parties" />
          <PartySeatsChart :parties="parties" />
          <ParliamentVisualization :parties="parties" />
        </div>
      </div>

      <!-- Party List and Detailed Results -->
      <div class="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8">
        <!-- Party List -->
        <div class="lg:w-1/3">
          <h2 class="text-2xl font-bold text-amber-500 mb-4">{{ t('general.political_parties') }}</h2>
          <PartyList :parties="parties" @partySelected="selectParty" />
        </div>

        <!-- Detailed Party Results -->
        <div class="lg:w-2/3">
          <h2 class="text-2xl font-bold text-amber-500 mb-4">
            {{ selectedParty ? t('general.party_details', { party: selectedParty.name }) : t('general.select_party') }}
          </h2>
          <div v-if="selectedParty">
            <PartyDetailedResults :party="selectedParty" />
            <CandidateList :candidates="selectedParty.candidates" :total-votes="selectedParty.votes" />
          </div>
        </div>
      </div>

      <!-- Regional Results -->
      <div class="mt-12">
        <RegionalResultsMap :regional-data="regionalData" :parties="parties" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import PartyList from '~/components/PartyList.vue';
import CandidateList from '~/components/CandidateList.vue';
import OverallResultsChart from '~/components/OverallResultsChart.vue';
import ParliamentVisualization from '~/components/ParliamentVisualization.vue';
import PartyDetailedResults from '~/components/PartyDetailedResults.vue';
import RegionalResultsMap from '~/components/RegionalResultsMap.vue';
import PartySeatsChart from '~/components/PartySeatsChart.vue';

const { t, locale } = useI18n();

const isRTL = computed(() => ['ar', 'ckb', 'ku'].includes(locale.value));

const parties = ref([
  {
    id: 1,
    name: t('general.party_a'),
    logo: 'https://elections.ava.news/parties_photos/kdp.png',
    seats: 45,
    votes: 500000,
    color: "#FFD700",
    percentage: 40,
    candidates: [
      { id: 1, name: t('general.candidate_1'), image: '', votes: 100000, seats: 20 },
      { id: 2, name: t('general.candidate_2'), image: '', votes: 80000, seats: 20 },
    ]
  },
  {
    id: 2,
    name: t('general.party_b'),
    logo: 'https://elections.ava.news/parties_photos/puk.png',
    seats: 50,
    votes: 400000,
    color: "#32CD32",
    percentage: 30,
    candidates: [
      { id: 3, name: t('general.candidate_3'), image: '', votes: 90000, seats: 15 },
      { id: 4, name: t('general.candidate_4'), image: '', votes: 70000, seats: 15 },
    ]
  },
  // Add more parties as needed
]);

const selectedParty = ref(null);

const selectParty = (party) => {
  selectedParty.value = party;
};

const regionalData = ref([
  {
    region: 'Erbil', partyResults: [
      { partyId: 1, votes: 200000, percentage: 45 },
      { partyId: 2, votes: 150000, percentage: 35 },
      // Add results for other parties
    ]
  },
  {
    region: 'Sulaymaniyah', partyResults: [
      { partyId: 1, votes: 180000, percentage: 38 },
      { partyId: 2, votes: 160000, percentage: 32 },
      // Add results for other parties
    ]
  },
  // Add data for other regions
]);
</script>