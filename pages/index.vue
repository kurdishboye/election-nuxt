<template>
  <div class="min-h-screen bg-gray-900 text-white py-6 px-4 sm:px-6 lg:px-8 relative" :class="{ 'rtl': isRTL }">
    <div class="max-w-8xl mx-auto">
      <!-- Map and Election Info Box -->
      <div class="flex flex-col lg:flex-row justify-end mb-8">
        <div class="lg:w-[50%]">
          <KurdistanMap ref="kurdistanMap" @citySelected="selectCity" />
        </div>
      </div>

      <div class="absolute top-12 rtl:lg:right-8 ltr:lg:left-8 lg:left-auto w-[40%] z-10"
        :class="{ 'right-8': isRTL, 'left-8': !isRTL }">
        <ElectionInfoBox :voting-stats="rawVotingStats" :selected-city="selectedCity.name" />
      </div>

      <div class="mb-12">
        <h2 class="text-2xl font-bold text-amber-500 mb-4">{{ t('general.overall_results') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <OverallResultsChart :parties="parties_chart" />
          <PartySeatsChart :parties="parties_chart" />
          <ParliamentVisualization :parties="parties_chart" />
        </div>
      </div>

      <div class="mt-16 py-4 border-t border-gray-800">
        <h2 class="text-2xl font-bold text-amber-500 mb-6">{{ t('general.political_parties') }}</h2>
        <CustomDataTable :data="partiesTableData" :columns="partiesTableColumns" :isLoading="isLoadingData" />
      </div>


    </div>
  </div>
</template>



<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAsyncData } from '#app';
import KurdistanMap from '~/components/kurdistan-map.vue';
import ElectionInfoBox from '~/components/ElectionInfoBox.vue';
import CustomDataTable from '~/components/CustomDataTable.vue';

const { t, locale } = useI18n();

const isRTL = computed(() => ['ar', 'ckb', 'ku'].includes(locale.value));

const rawVotingStats = ref({
  totalVoters: 0,
  participation: 0,
  openbox: 0,
  average: 0,
  totalSeats: 0
});

const partiesTableColumns = ['id', 'img', 'name', 'votes', 'seats', 'percentage', 'openbox'];

const partiesTableData = computed(() => {
  return parties.value.map(party => ({
    id: party.id,
    img: party.logo || 'https://via.placeholder.com/40', // Fallback image if logo is not available
    name: party.name,
    votes: formatNumber(party.votes),
    seats: party.seats || 0, // Assuming seats data is available, otherwise default to 0
    percentage: `${party.percentage}%`,
    openbox: party.openbox || 0 // Assuming openbox data is available, otherwise default to 0
  }));
});


const parties_chart = computed(() => {
  return parties.value.map(party => ({
    id: party.id,
    name: party.name,
    logo: 'https://elections.ava.news/parties_photos/kdp.png',
    seats: party.votes,
    votes: formatNumber(party.votes),
    color: party.color,
    candidates: [],
    percentage: `${party.percentage}%`
  }));
});

const parties = ref([]);
const selectedParty = ref(null);
const selectedCity = ref({ id: 0, name: t('general.all') });
const isLoadingData = ref(false);
const kurdistanMap = ref(null);

const processApiData = (data) => {
  console.log('API Response:', data);

  if (!data || !data.results || !Array.isArray(data.results)) {
    console.error('Invalid data structure received from API');
    return;
  }

  const results = data.results;
  const circle = data.circles && data.circles.length > 0 ? data.circles[0] : null;

  // Update rawVotingStats
  rawVotingStats.value = {
    totalVoters: results.find(r => r.data_type === 'votes')?.data || 0,
    participation: circle?.number_of_voters || 0,
    openbox: results.find(r => r.data_type === 'opened_boxes')?.data || 0,
    average: results.find(r => r.data_type === 'percentage')?.data || 0,
    totalSeats: circle?.number_of_seats || 0
  };

  // Update parties
  parties.value = data.parties
    .filter(party => party !== null)
    .map(party => ({
      id: party.id,
      name: party.name,
      logo: party.logo,
      color: party.color,
      votes: results.find(r => r.party_id === party.id && r.data_type === 'votes')?.data || 0,
      percentage: results.find(r => r.party_id === party.id && r.data_type === 'percentage')?.data || 0,
      seats: results.find(r => r.party_id === party.id && r.data_type === 'seats')?.data || 0,
      openbox: results.find(r => r.party_id === party.id && r.data_type === 'opened_boxes')?.data || 0,
      candidates: [] // We don't have candidate data in this structure
    }));
};

const formatNumber = (number) => {
  return new Intl.NumberFormat('ku-IQ').format(number);
};

const fetchData = async () => {
  isLoadingData.value = true;
  try {
    const data = await $fetch(`https://election.rudaw.dev/main?circle_id=${selectedCity.value.id}`);
    processApiData(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    isLoadingData.value = false;
  }
};

const selectParty = (party) => {
  selectedParty.value = selectedParty.value === party ? null : party;
};

const selectCity = async (city) => {
  selectedCity.value = {
    id: city.id,
    name: t(`general.${city.name}`)
  };

  isLoadingData.value = true;
  try {
    const data = await $fetch(`https://election.rudaw.dev/main?circle_id=${city.id}`);
    processApiData(data);

    // Check for map_file in the API response
    if (data.circles && data.circles[0] && data.circles[0].map_file) {
      const mapResponse = await fetch(data.circles[0].map_file);
      if (mapResponse.ok) {
        const svgContent = await mapResponse.text();
        kurdistanMap.value.loadCityMap(svgContent);
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    isLoadingData.value = false;
  }
};

// Computed properties
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

// Fetch initial data using useAsyncData
const { data: initialData } = await useAsyncData('initialElectionData', () =>
  $fetch('https://election.rudaw.dev/main?circle_id=0')
);

// Process the initial data
if (initialData.value) {
  processApiData(initialData.value);
} else {
  console.error('No initial data received');
}
</script>