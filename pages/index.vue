<template>
  <div class="min-h-screen bg-gray-900 text-white py-6 px-4 sm:px-6 lg:px-8 relative" :class="{ 'rtl': isRTL }">
    <div class="max-w-8xl mx-auto">
      <!-- Map and Election Info Box -->
      <div class="flex flex-col lg:flex-row justify-end mb-8">
        <div class="lg:w-[50%]">
          <KurdistanMap />
        </div>
      </div>

      <div class="absolute top-12 rtl:lg:right-8 ltr:lg:left-8 lg:left-auto w-[40%] z-10"
        :class="{ 'right-8': isRTL, 'left-8': !isRTL }">
        <ElectionInfoBox :voting-stats="votingStats" />
      </div>
      <div class=""></div>
      <!-- Party List and Candidates -->
      <div class="mt-16">
        <div class="flex flex-col lg:flex-row space-y-8 lg:space-y-0"
          :class="{ 'lg:space-x-8 lg:space-x-reverse': isRTL, 'lg:space-x-8': !isRTL }">
          <!-- Party List -->
          <div class="lg:w-1/4">
            <h2 class="text-2xl font-bold text-amber-500 mb-6">{{ t('general.political_parties') }}</h2>
            <PartyList :parties="parties" @partySelected="selectParty" />
          </div>

          <!-- Candidates -->
          <div class="lg:w-3/4">
            <h2 class="text-2xl font-bold text-amber-500 mb-6">
              {{ selectedParty ? t('general.candidates_of_party', { party: selectedParty.name }) :
                t('general.all_candidates') }}
            </h2>
            <CandidateList :candidates="candidatesToShow" :total-votes="totalVotes" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import KurdistanMap from '~/components/kurdistan-map.vue';
import ElectionInfoBox from '~/components/ElectionInfoBox.vue';
import PartyList from '~/components/PartyList.vue';
import CandidateList from '~/components/CandidateList.vue';

const { t, locale } = useI18n();

const isRTL = computed(() => ['ar', 'ckb', 'ku'].includes(locale.value));

const votingStats = computed(() => ({
  totalVoters: 0,
  votedCount: 0,
  validVotes: 0,
  invalidVotes: 0,
  participation: 0,
  totalSeats: 0
}));

const parties = ref([
  {
    id: 1,
    name: t('general.party_a'),
    logo: '',
    seats: 0,
    votes: 0,
    percentage: 0,
    candidates: [
      { id: 1, name: t('general.candidate_1'), image: '', votes: 0, seats: 0 },
      { id: 2, name: t('general.candidate_2'), image: '', votes: 0, seats: 0 },
    ]
  },
  {
    id: 2,
    name: t('general.party_b'),
    logo: '',
    seats: 0,
    votes: 0,
    percentage: 0,
    candidates: [
      { id: 3, name: t('general.candidate_3'), image: '', votes: 0, seats: 0 },
      { id: 4, name: t('general.candidate_4'), image: '', votes: 0, seats: 0 },
    ]
  },
]);

const selectedParty = ref(null);

const selectParty = (party) => {
  selectedParty.value = selectedParty.value === party ? null : party;
};

const candidatesToShow = computed(() => {
  if (selectedParty.value) {
    return selectedParty.value.candidates;
  } else {
    return parties.value.flatMap(party => party.candidates);
  }
});

const totalVotes = computed(() => {
  return parties.value.reduce((sum, party) => sum + party.votes, 0);
});
</script>