<template>
    <div class="space-y-4">
        <div v-for="party in parties" :key="party.id" @click="$emit('partySelected', party)"
            class="bg-gray-700 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:bg-gray-600 hover:shadow-lg">
            <div class="flex items-center space-x-4 rtl:space-x-reverse">
                <img :src="party.logo || defaultImage" :alt="party.name" class="w-16 h-16 rounded-full object-cover">
                <div class="flex-grow">
                    <h3 class="text-lg font-semibold text-white">{{ party.name }}</h3>
                    <p class="text-sm text-gray-300">{{ t('general.seats') }}: {{ party.seats }}</p>
                    <p class="text-sm text-gray-300">{{ t('general.votes') }}: {{ formatNumber(party.votes) }}</p>
                    <div class="mt-2">
                        <p class="text-sm text-gray-300">{{ t('general.percentage') }}: {{ party.percentage }}%</p>
                        <div class="w-full bg-gray-600 rounded-full h-2 mt-1">
                            <div class="bg-amber-500 h-2 rounded-full transition-all duration-1000 ease-out"
                                :style="{ width: `${party.percentage}%` }"></div>
                        </div>
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
    parties: {
        type: Array,
        required: true
    }
});

defineEmits(['partySelected']);

const defaultImage = 'https://s3.amazonaws.com/rudawelections.com.storage/tmp-images/logo-header.svg';

const formatNumber = (number) => {
    return new Intl.NumberFormat('ku-IQ').format(number);
};

onMounted(() => {
    setTimeout(() => {
        const bars = document.querySelectorAll('.bg-amber-500');
        bars.forEach(bar => {
            bar.style.width = bar.parentElement.dataset.percentage;
        });
    }, 100);
});
</script>