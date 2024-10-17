<template>
    <span>{{ displayValue }}</span>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
    value: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        default: 1000
    }
});

const displayValue = ref(0);

const animateNumber = (newValue) => {
    const startValue = displayValue.value;
    const endValue = newValue;
    const startTime = performance.now();
    const duration = props.duration;

    const updateNumber = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        if (elapsedTime < duration) {
            const progress = elapsedTime / duration;
            displayValue.value = Math.round(startValue + (endValue - startValue) * progress);
            requestAnimationFrame(updateNumber);
        } else {
            displayValue.value = endValue;
        }
    };

    requestAnimationFrame(updateNumber);
};

watch(() => props.value, (newValue) => {
    animateNumber(newValue);
});

onMounted(() => {
    animateNumber(props.value);
});
</script>