<script setup>
import { onKeyStroke } from '@vueuse/core';

const { data: chordsData } = await useAsyncData('chords', () => queryCollection('chords').first(), {
    deep: false,
});

const { t } = useI18n();
const localePath = useLocalePath();

const chords = chordsData.value.chords;

const uniqueDegs = [...new Set(chords.map(chord => chord.deg))].toSorted((a, b) => {
    return a.replaceAll(/\D/g, '') < b.replaceAll(/\D/g, '') ? -1 : 1;
});
const uniqueFb = [...new Set(chords.map(chord => chord.fb))].toSorted((a, b) => {
    const aCount = a.split(' ').length;
    const bCount = b.split(' ').length;
    if (aCount === bCount) {
        return a.localeCompare(b);
    }
    return aCount - bCount;
});
const uniqueHint = [...new Set(chords.map(chord => chord.hint))].toSorted((a, b) => {
    const aCount = a.split(' ').length;
    const bCount = b.split(' ').length;
    if (aCount === bCount) {
        return a.replaceAll(/\D/g, '').localeCompare(b.replaceAll(/\D/g, ''));
    }
    return aCount - bCount;
});
const uniqueBeatWeights = [...new Set(chords.map(chord => chord.meterWeight))];

const { filters, filteredChords, resetFilters } = useChordFilter(chords);
const viewFbMode = ref('fb');

const fbGroupedChords = computed(() => {
    return Object.entries(filteredChords.value.reduce((obj, chord) => {
        const index = viewFbMode.value === 'fb' ? chord.fb : chord.hint;
        obj[index] = (obj[index] ?? 0) + 1;
        return obj;
    }, {})).sort((a, b) => b[1] - a[1]);;
});

const degGroupedChords = computed(() => {
    return Object.entries(filteredChords.value.reduce((obj, chord) => {
        const index = chord.deg;
        obj[index] = (obj[index] ?? 0) + 1;
        return obj;
    }, {})).sort((a, b) => b[1] - a[1]);;
});

const nextDegGroupedChords = computed(() => {
    return Object.entries(filteredChords.value.reduce((obj, chord) => {
        const index = chord.nextDeg;
        obj[index] = (obj[index] ?? 0) + 1;
        return obj;
    }, {})).sort((a, b) => b[1] - a[1]);;
});

const fbConfig = computed(() => ({
    type: 'bar',
    data: {
        datasets: [{
            label: viewFbMode.value === 'fb' ? t('fb') : t('exactIntervals'),
            data: fbGroupedChords.value.map(i => ({ x: i[0], y: i[1] })),
        }],
    },
    options: {
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false,
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                // display: false,
                onClick: (e) => e.stopPropagation(),
            },
            tooltip: {
                yAlign: 'bottom',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
            },
        },
    },
}));

const degConfig = computed(() => ({
    type: 'bar',
    data: {
        datasets: [{
            label: t('deg'),
            data: degGroupedChords.value.map(i => ({ x: i[0], y: i[1] })),
        }],
    },
    options: {
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false,
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                // display: false,
                onClick: (e) => e.stopPropagation(),
            },
            tooltip: {
                yAlign: 'bottom',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
            },
        },
    },
}));

const nextDegConfig = computed(() => ({
    type: 'bar',
    data: {
        datasets: [{
            label: t('nextDeg'),
            data: nextDegGroupedChords.value.map(i => ({ x: i[0], y: i[1] })),
        }],
    },
    options: {
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false,
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                // display: false,
                onClick: (e) => e.stopPropagation(),
            },
            tooltip: {
                yAlign: 'bottom',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
            },
        },
    },
}));

const chordsGroupById = computed(() => {
    return Object.entries(filteredChords.value.reduce((accumulator, elem) => {
        accumulator[elem.pieceId] = accumulator[elem.pieceId] ?? [];
        accumulator[elem.pieceId].push(elem);
        return accumulator;
    }, {})).map(([id, elements]) => ({
        id,
        chords: elements,
    }))
});

function useChordModal(chordsGroupById, chordsData) {
    const modalIsOpen = ref(false)
    const activeIndex = ref(null)

    async function loadIndex(index) {
        if (index < 0 || index >= chordsGroupById.value.length) return;
        activeIndex.value = index;
        modalIsOpen.value = true;
    };

    const currentGroup = computed(() => {
        return chordsGroupById.value[activeIndex.value] ?? {};
    });

    const hasPrevious = computed(() => activeIndex.value > 0);
    const hasNext = computed(() => activeIndex.value < chordsGroupById.value.length - 1);

    onKeyStroke('ArrowLeft', () => {
        if (modalIsOpen.value && activeIndex.value !== null && hasPrevious.value) loadIndex(activeIndex.value - 1);
    });

    onKeyStroke('ArrowRight', () => {
        if (modalIsOpen.value && activeIndex.value !== null && hasNext.value) loadIndex(activeIndex.value + 1);
    });

    const highlightLineNumbers = computed(() => {
        const pieceIntervalLength = chordsData.value.chords.filter(i => i.pieceId === currentGroup.value.id).length;

        let highlightLineNumbers = [];
        if (currentGroup.value.chords.length < pieceIntervalLength) {
            highlightLineNumbers = currentGroup.value.chords.filter(c => c.pieceId === currentGroup.value.id).map(c => c.lineNumber);
        }
        return highlightLineNumbers;
    });

    return {
        modalIsOpen,
        activeIndex,
        loadIndex,
        currentGroup,
        hasPrevious,
        hasNext,
        highlightLineNumbers,
    }
}

const {
    modalIsOpen,
    activeIndex,
    loadIndex,
    currentGroup,
    hasPrevious,
    hasNext,
    highlightLineNumbers,
} = useChordModal(chordsGroupById, chordsData);

const { localScoreUrlGenerator } = useScoreUrlGenerator();

function chartClickHandler(type, chart, event) {
    const points = chart.getElementsAtEventForMode(event, 'nearest', { intersect: false, axis: 'x' }, true);
    if (points.length) {
        const firstPoint = points[0];
        const prop = filters[type];
        const value = chart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index].x;
        filters[type] = (prop === value || prop.includes?.(value)) ? [] : [value];
    }
}
</script>

<template>
    <UContainer>
        <Heading>{{ $t('chords') }}</Heading>
        <div>

            <UCard>
                <template #header>
                    <div class="font-medium leading-5">
                        {{ $t('filter') }}
                    </div>
                </template>
                <div class="flex flex-wrap gap-2">
                    <UFormField :label="$t('mode')" class="w-40">
                        <USelectMenu v-model="viewFbMode" :items="[{id: 'fb', label: $t('figuredBassNumbers')}, {id: 'hint', label: $t('exactIntervals')}]" value-key="id" class="w-full" :search-input="false" />
                    </UFormField>
                    <UFormField :label="$t('deg')" class="w-32">
                        <USelectMenu v-model="filters.deg" :items="uniqueDegs" multiple class="w-full" :search-input="false" />
                    </UFormField>
                    <UFormField :label="$t('nextDeg')" class="w-32">
                        <USelectMenu v-model="filters.nextDeg" :items="uniqueDegs" multiple class="w-full" :search-input="false" />
                    </UFormField>
                    <UFormField :label="$t('fb')" class="w-32">
                        <USelectMenu v-model="filters.fb" :items="uniqueFb" multiple class="w-full" />
                    </UFormField>
                    <UFormField :label="$t('hint')" class="w-32">
                        <USelectMenu v-model="filters.hint" :items="uniqueHint" multiple class="w-full" />
                    </UFormField>
                    <UFormField :label="$t('intervalSearch')" class="w-32">
                        <UInput v-model="filters.search" class="w-full" />
                    </UFormField>
                    <UFormField :label="$t('meterWeight')" class="w-32">
                        <USelectMenu v-model="filters.meterWeight" :items="uniqueBeatWeights" multiple class="w-full" :search-input="false" />
                        <template #help>
                            <UModal :title="$t('meterWeightsTitle')">
                                <UButton icon="i-lucide-info" :label="$t('explanation')" color="neutral" variant="ghost" size="xs" />
                                <template #body>
                                    <MeterWeightInfo />
                                </template>
                            </UModal>
                        </template>
                    </UFormField>
                    <UFormField label="&nbsp;" class="w-32">
                        <UButton icon="i-lucide-funnel-x" color="warning" variant="subtle" @click="resetFilters">
                            {{ $t('reset') }}
                        </UButton>
                    </UFormField>
                </div>
            </UCard>

            <div class="my-4">
                {{ filteredChords.length }} / {{ chords.length }}
            </div>

            <div class="grid md:grid-cols-4 gap-4">
                <div class="col-span-2">
                    <div class="h-[300px]">
                        <Chart :config="fbConfig" @chart-click="(chart, event) => chartClickHandler(viewFbMode, chart, event)" />
                    </div>
                </div>
                <div>
                    <div class="h-[300px]">
                        <Chart :config="degConfig" @chart-click="(chart, event) => chartClickHandler('deg', chart, event)" />
                    </div>
                </div>
                <div>
                    <div class="h-[300px]">
                        <Chart :config="nextDegConfig" @chart-click="(chart, event) => chartClickHandler('nextDeg', chart, event)" />
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-wrap gap-2 mt-8">
            <div v-for="(group, index) in chordsGroupById" :key="group.id">
                <UButton :label="`${group.id} (${group.chords.length})`" @click="loadIndex(index)" />
            </div>
            <UModal v-model:open="modalIsOpen" :title="currentGroup.id">
                <template #body>
                    <div :key="`${currentGroup.id}${highlightLineNumbers.join(',')}`">
                        <div class="flex gap-1 justify-end">
                            <MidiPlayer :url="localScoreUrlGenerator(currentGroup.id)" class="text-2xl" />
                            <UButton size="sm" color="primary" variant="solid" :label="t('view')" :to="localePath({ name: 'piece-id', params: { id: currentGroup.id } })" />
                        </div>
                        <HighlightedScore
                            :piece-id="currentGroup.id"
                            :lines="highlightLineNumbers"
                            :verovio-options="{
                                scale: 25,
                                pageMargin: 50,
                            }"
                            :filters="[
                                'deg -k1 --box',
                                `shed -e 's/fb/fba/gX'`,
                            ]"
                        />
                    </div>
                </template>
                <template #footer>
                    <UButton class="mr-auto" v-if="hasPrevious" @click="loadIndex(activeIndex - 1)">
                        {{ $t('previous') }}
                    </UButton>
                    <UButton class="ml-auto" v-if="hasNext" @click="loadIndex(activeIndex + 1)">
                        {{ $t('next') }}
                    </UButton>
                </template>
            </UModal>
        </div>

    </UContainer>
</template>
