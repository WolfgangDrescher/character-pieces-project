<script setup>
import { useMagicKeys } from '@vueuse/core';

const { data: pieces } = await useAsyncData('pieces/search-palette', () => queryCollection('pieces').all());

const open = defineModel('open', { type: Boolean });

const searchTerm = ref('');

const localePath = useLocalePath();

function fuzzysearch(needle, haystack) {
    needle = needle.toLowerCase();
    haystack = haystack.toLowerCase();
    var hlen = haystack.length;
    var nlen = needle.length;
    if (nlen > hlen) {
        return false;
    }
    if (nlen === hlen) {
        return needle === haystack;
    }
    outer: for (var i = 0, j = 0; i < nlen; i++) {
        var nch = needle.charCodeAt(i);
        while (j < hlen) {
            if (haystack.charCodeAt(j++) === nch) {
                continue outer;
            }
        }
        return false;
    }
    return true;
}

const { meta } = useMagicKeys();

const groups = computed(() => {
    if (!pieces.value) return []

    const groupedPieces = Object.groupBy(pieces.value, p => p.repo)
    
    const commandGroups = Object.entries(groupedPieces).map(([key, groupPieces]) => {
        const { repo, largerWorkTitle, composer } = groupPieces[0];

        const filteredItems = groupPieces.map(p => {
            const title = p.title?.toLowerCase() !== p.slug?.toLowerCase() ? p.title : '';
            return {
                label: `${p.nr}. ${title}`,
                value: p.uid,
                search: `${composer} ${largerWorkTitle} ${p.nr}. ${title} ${p.movementDesignation}`,
                onSelect: () => {
                    navigateTo(
                        localePath({ name: 'pieces-uid', params: { uid: p.uid } }),
                        meta.value ? {
                            open: {
                                target: '_blank',
                            },
                        } : {}
                    );
                    if (!meta.value) {
                        open.value = false;
                    }
                },
            };
        }).filter(item => fuzzysearch(searchTerm.value, item.search))

        return {
            id: repo,
            label: `${composer.split(',').map(c => c.trim()).filter(Boolean)[0]}: ${largerWorkTitle}`,
            ignoreFilter: true,
            items: filteredItems,
        }
    })

    return commandGroups.filter(g => g.items.length > 0);
});
</script>

<template>
    <UModal v-model:open="open">
        <UButton
            :label="$t('search')"
            color="neutral"
            variant="soft"
            icon="i-lucide-search"
        >
            <template #trailing>
                <div class="hidden sm:flex gap-1">
                    <UKbd value="meta" />
                    <UKbd color="neutral" class="font-mono">K</UKbd>
                </div>
            </template>
        </UButton>
        
        <template #content>
            <UCommandPalette
                :groups="groups"
                :placeholder="$t('searchPieces')"
                v-model:search-term="searchTerm"
            />
        </template>
    </UModal>
</template>
