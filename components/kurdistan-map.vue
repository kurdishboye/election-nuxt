<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits(['citySelected'])

const selectedCity = ref(null)
const currentMap = ref('main')
const svgContent = ref('')

const selectCity = (city) => {
    selectedCity.value = city.id
    emit('citySelected', city)
}

const loadSvg = async () => {
    try {
        const response = await fetch('/images/kurdistan-map.svg')
        svgContent.value = await response.text()
    } catch (error) {
        console.error('Error loading SVG:', error)
    }
}

onMounted(() => {
    loadSvg()
})

const returnToMainMap = () => {
    currentMap.value = 'main'
    selectedCity.value = null
    emit('citySelected', { id: 0, name: 'all' })
}
</script>

<template>
    <div class="relative w-full h-full">
        <div v-if="svgContent" v-html="svgContent" class="w-full h-full" ref="svgContainer"></div>
        <div v-else>{{ t('general.loading_data') }}</div>

        <button v-if="currentMap !== 'main'" @click="returnToMainMap"
            class="absolute top-4 left-4 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition duration-300">
            {{ t('general.back') }}
        </button>
    </div>
</template>

<script>
export default {
    mounted() {
        this.$nextTick(() => {
            if (this.$refs.svgContainer) {
                const svgElement = this.$refs.svgContainer.querySelector('svg')
                if (svgElement) {
                    svgElement.setAttribute('class', 'w-full h-full')

                    const cityPaths = svgElement.querySelectorAll('path[id^="area-"]')
                    cityPaths.forEach(path => {
                        const cityId = parseInt(path.id.split('-')[1])
                        path.classList.add('cursor-pointer', 'transition-all', 'duration-300', 'stroke-gray-500', 'fill-gray-700', 'hover:fill-rudaw-orange')
                        path.addEventListener('click', () => this.selectCity({ id: cityId, name: path.id.split('-')[1] }))
                    })

                    const cityTexts = svgElement.querySelectorAll('text')
                    cityTexts.forEach(text => {
                        text.setAttribute('class', 'text-1x fill-current text-white')
                        const cityName = text.textContent
                        text.textContent = this.t(`general.${cityName.toLowerCase()}`)
                    })
                }
            }
        })
    }
}
</script>