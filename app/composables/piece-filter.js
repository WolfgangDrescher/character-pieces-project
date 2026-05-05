import { defineStore } from 'pinia';

function createDefaultPieceFilterOptions() {
    return {
        composer: [],
        title: [],
        tempo: [],
        key: [],
        meter: [],
    };
};

export const usePieceFilterOptions = defineStore('piece_filter_options', {
    state: () => (createDefaultPieceFilterOptions()),
    actions: {
        reset() {
            this.$patch(createDefaultPieceFilterOptions());
        },
    },
});

function queryBuidler(store, queryBuidler) {
    if (store.meter.length) {
        if (store.meter.length) {
            queryBuidler.orWhere(q => {
                store.meter.forEach(meter => q.where('meter', 'LIKE', `%${meter}%`))
                return q;
            });
        }
    }

    if (store.tempo.length) {
        if (store.tempo.length) {
            queryBuidler.orWhere(q => {
                // TODO case insensitive
                store.tempo.forEach(tempo => q.where('movementDesignation', 'LIKE', `%${tempo}%`))
                return q;
            });
        }
    }

    if (store.key.length) {
        queryBuidler.where('key', 'IN', [...store.key]);
    }

    if (store.title.length) {
        // TODO case insensitive
        queryBuidler.where('title', 'IN', [...store.title]);
    }

    if (store.composer.length) {
        // TODO case insensitive
        queryBuidler.where('composer', 'IN', [...store.composer]);
    }

    return queryBuidler;
};

export async function useAsyncDataPiecesCollectionSurroundings(path) {
    const store = usePieceFilterOptions();
    return await useAsyncData(`pieces/${path}/surroundings`, () => {
        return queryBuidler(store, queryCollectionItemSurroundings('pieces', path, {
            fields: ['uid'],
        }));
    }, {
        server: false, // used for nuxt generate deployment
        watch: [store.$state],
        // deep: true,
    });
};
