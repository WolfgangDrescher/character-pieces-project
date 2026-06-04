import { defineCollection, defineContentConfig, z } from '@nuxt/content';

export default defineContentConfig({
    collections: {
        pieces: defineCollection({
            source: 'pieces/**/*.yaml',
            type: 'page',
            schema: z.object({
                composer: z.string(),
                key: z.string(),
                largerWorkTitle: z.string(),
                majorMinor: z.string(),
                meter: z.array(z.string()),
                movementDesignation: z.array(z.string()),
                nr: z.number(),
                op: z.number(),
                uid: z.string(),
                repo: z.string(),
                slug: z.string(),
                title: z.string(),
            }),
        }),
        chords: defineCollection({
            source: 'chords.yaml',
            type: 'data',
            schema: z.object({
                chords: z.array(z.object({
                    beat: z.number(),
                    fb: z.string(),
                    hint: z.string(),
                    deg: z.string(),
                    lineNumber: z.number(),
                    uid: z.string(),
                    nextDeg: z.string(),
                    // meterWeight: z.string(),
                })),
            }),
        }),
    },
});
