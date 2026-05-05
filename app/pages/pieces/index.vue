<script setup>
const { data: allPieces } = await useAsyncData('all-pieces', () => queryCollection('pieces').all());

const { t } = useI18n();
const localePath = useLocalePath();

const pieces = computed(() => {
    return allPieces.value.map(item => ({
        uid: item.uid,
        slug: item.slug,
        repo: item.repo,
        composer: item.composer,
        key: item.key,
        largerWorkTitle: item.largerWorkTitle,
        majorMinor: item.majorMinor,
        meter: item.meter,
        movementDesignation: item.movementDesignation,
        nr: item.nr,
        op: item.op,
        opnr: `${item.op} / ${item.nr}`,
        title: item.title,
    }));
});

const columns = [
    { accessorKey: 'audio', header: '' },
    { accessorKey: 'composer', header: t('composer') },
    { accessorKey: 'op', header: t('op') },
    { accessorKey: 'nr', header: t('nr') },
    { accessorKey: 'title', header: t('title') },
    { accessorKey: 'movementDesignation', header: t('movementDesignation') },
    { accessorKey: 'key', header: t('key')  },
    { accessorKey: 'majorMinor', header: t('majorMinor') },
    { accessorKey: 'meter', header: t('meter') },
    { accessorKey: 'actions', header: '' },
];

const { localScoreUrlGenerator, vhvScoreUrlGenerator } = useScoreUrlGenerator();
</script>

<template>
    <UContainer>
        <Heading>{{ $t('pieces') }}</Heading>
        <UTable :data="pieces" :columns="columns" :get-row-id="(item) => item.slug" class="mt-8">
            <template #audio-cell="{ row }">
                <MidiPlayer :url="localScoreUrlGenerator(row.original.repo, row.original.slug)" class="text-2xl"/>
            </template>
            <template #id-cell="{ row }">
                <NuxtLink :to="localePath({ name: 'piece-id', params: { id: row.original.slug } })">
                    <UBadge color="neutral" variant="outline" class="font-mono w-[11ch] inline-flex items-center justify-center text-center" :label="row.original.slug" />
                </NuxtLink>
            </template>
            <template #title-cell="{ row }">
                <NuxtLink :to="localePath({ name: 'piece-id', params: { id: row.original.slug } })">
                    {{ row.original.title ?? '' }}
                </NuxtLink>
            </template>
            <template #meter-cell="{ row }">
                <div class="flex flex-wrap gap-2">
                    <UBadge
                        v-for="(meter, index) in row.original.meter"
                        :key="index"
                        :label="meter"
                        class="cursor-pointer"
                        @click="toggleMeter(meter)"
                    />
                </div>
            </template>
            <template #actions-cell="{ row }">
                <div class="flex gap-1 justify-end">
                    <UButton size="sm" color="primary" variant="solid" :label="t('vhv')" :to="vhvScoreUrlGenerator(row.original.slug)" target="_blank" />
                    <UButton size="sm" color="primary" variant="solid" :label="t('view')" :to="localePath({ name: 'piece-id', params: { id: row.original.slug } })" />
                </div>
            </template>
        </UTable>
    </UContainer>
</template>
