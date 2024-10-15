<template>
    <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden p-6 transition-all duration-500 hover:shadow-2xl">
        <h2 class="text-2xl font-bold text-amber-500 mb-6 text-center">{{ t('general.voting_box') }}</h2>
        <div class="grid grid-cols-2 gap-4">
            <div v-for="(item, index) in electionData" :key="index"
                class="bg-gray-700 rounded-lg p-4 transition-all duration-300 hover:bg-gray-600"
                :class="{ 'col-span-2': index === electionData.length - 1 }">
                <h3 class="text-amber-400 text-sm mb-2">{{ t(item.label) }}</h3>
                <p class="text-white text-lg font-bold">{{ item.value }}</p>
                <div v-if="item.percentage" class="mt-2">
                    <div class="w-full bg-gray-600 rounded-full h-2">
                        <div class="bg-amber-500 h-2 rounded-full transition-all duration-1000 ease-out"
                            :style="{ width: `${item.percentage}%` }"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
    votingStats: {
        type: Object,
        required: true
    }
});

const electionData = ref([
    { label: 'general.total_voters', value: '0' },
    { label: 'general.total_participants', value: '0' },
    { label: 'general.valid_votes', value: '0' },
    { label: 'general.invalid_votes', value: '0' },
    { label: 'general.total_seats', value: '0' },
    { label: 'general.participation_rate', value: '0%', percentage: 0 }
]);

onMounted(() => {
    setTimeout(() => {
        electionData.value = [
            { label: 'general.total_voters', value: props.votingStats.totalVoters },
            { label: 'general.total_participants', value: props.votingStats.votedCount },
            { label: 'general.valid_votes', value: props.votingStats.validVotes },
            { label: 'general.invalid_votes', value: props.votingStats.invalidVotes },
            { label: 'general.total_seats', value: props.votingStats.totalSeats },
            { label: 'general.participation_rate', value: `${props.votingStats.participation}%`, percentage: props.votingStats.participation }
        ];
    }, 500);
});
</script>