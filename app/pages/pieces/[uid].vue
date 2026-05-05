<script setup>
const localePath = useLocalePath();
const { params: { uid } } = useRoute();
const { data: piece } = await useAsyncData(`pieces/${uid}`, () => queryCollection('pieces').where('stem', '=', `pieces/${uid}`).first());

if (!piece.value) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Page Not Found',
    });
}

const { data: surroundData } = await useAsyncDataPiecesCollectionSurroundings(piece.value.path);
const prevPiece = computed(() => surroundData.value?.[0] ?? null);
const nextPiece = computed(() => surroundData.value?.[1] ?? null);

const { localScoreUrlGenerator, githubScoreUrlGenerator, vhvScoreUrlGenerator } = useScoreUrlGenerator();

useScoreKeyboardShortcuts({
    prevPiece,
    nextPiece,
});
</script>

<template>
    <UContainer>
        <div class="flex flex-col gap-8">
            <div>
                <Heading>
                    {{ `${piece.nr}. ${piece.title}` }}
                    <div class="text-2xl">
                        {{ `${piece.largerWorkTitle}  Op. ${piece.op}` }}
                    </div>
                    <div class="text-base font-normal">
                        {{ piece.composer }}
                    </div>
                </Heading>
                <div class="flex gap-2">
                    <UButton :disabled="!prevPiece" :to="localePath({ name: 'pieces-uid', params: { uid: prevPiece?.uid }, hash: $route.hash })" size="xs">
                        <template #leading>
                            <UKbd color="neutral">
                                <UIcon name="lucide:arrow-left" />
                            </UKbd>
                        </template>
                        {{ $t('previous') }}
                    </UButton>
                    <UButton :disabled="!nextPiece" :to="localePath({ name: 'pieces-uid', params: { uid: nextPiece?.uid }, hash: $route.hash })" size="xs">
                        {{ $t('next') }}
                        <template #trailing>
                            <UKbd color="neutral">
                                <UIcon name="lucide:arrow-right" />
                            </UKbd>
                        </template>
                    </UButton>
                </div>
            </div>

            <div class="flex flex-col md:flex-row items-center gap-4">
                <div>
                    <ScoreOptionsPalette />
                </div>
                <div class="shrink-0 flex gap-2 ml-auto md:order-2">
                    <MidiPlayer :url="localScoreUrlGenerator(piece.repo, piece.slug)" class="text-2xl"/>
                    <UButton :to="githubScoreUrlGenerator(piece.repo, piece.slug)" target="_blank">
                        {{ $t('github') }}
                    </UButton>
                    <UButton :to="vhvScoreUrlGenerator(piece.repo, piece.slug)" target="_blank">
                        {{ $t('vhv') }}
                    </UButton>
                </div>
            </div>

            <VerovioCanvas
                :url="localScoreUrlGenerator(piece.repo, piece.slug)"
                :verovio-options="{
                    header: true,
                    spacingSystem: 15,
                    pageMarginLeft: 50,
                    pageMarginRight: 0,
                    pageMarginTop: 50,
                    pageMarginBottom: 50,
                }"
            />

        </div>
    </UContainer>
</template>
