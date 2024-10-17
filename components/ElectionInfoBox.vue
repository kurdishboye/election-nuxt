<template>
    <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden p-6 transition-all duration-500 hover:shadow-2xl">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-amber-500">{{ t('general.voting_box') }}</h2>
            <span class="text-white text-lg bg-gray-700 px-3 py-1 rounded-full">{{ selectedCity }}</span>
        </div>

        <div class="grid gap-4">
            <div v-for="(item, index) in electionData" :key="index"
                class="bg-gray-700 rounded-lg p-4 transition-all duration-300 hover:bg-gray-600"
                :class="{ 'col-span-2': index === electionData.length - 1 }">
                <div class="flex justify-between items-center">
                    <AnimatedNumber :value="item.value" class="text-white text-2xl font-bold" :duration="1000" />
                    <h3 class="text-amber-400 text-sm text-right">{{ t(item.label) }}</h3>
                </div>
                <div v-if="item.percentage !== undefined" class="mt-2">
                    <div class="w-full bg-gray-600 rounded-full h-2 overflow-hidden">
                        <div class="bg-amber-500 h-full rounded-full transition-all duration-1000 ease-out"
                            :style="{ width: `${item.percentage}%` }"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AnimatedNumber from './AnimatedNumber.vue';

const { t } = useI18n();

const props = defineProps({
    votingStats: {
        type: Object,
        required: true
    },
    selectedCity: {
        type: String,
        default: 'All'
    }
});

const electionData = ref([]);

const updateElectionData = () => {
    electionData.value = [
        { label: 'general.total_voters', value: props.votingStats.totalVoters },
        { label: 'general.total_participants', value: props.votingStats.participation },
        { label: 'general.openbox', value: props.votingStats.openbox },
        { label: 'general.total_seats', value: props.votingStats.totalSeats },
        {
            label: 'general.participation_rate',
            value: props.votingStats.average,
            percentage: parseFloat(props.votingStats.average)
        }
    ];
};

watch(() => props.votingStats, updateElectionData, { immediate: true, deep: true });
</script>

<style scoped>
.grid {
    display: grid;
    transition: all 0.3s ease;
}

.grid>div {
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.bg-amber-500 {
    animation: progressAnimation 1s ease-out;
}

@keyframes progressAnimation {
    from {
        width: 0%;
    }

    to {
        width: 100%;
    }
}
</style>