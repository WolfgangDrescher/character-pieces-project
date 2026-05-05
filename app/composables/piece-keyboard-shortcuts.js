import { onKeyStroke } from '@vueuse/core';

function ignoreIfInput () {
    const el = document.activeElement;
    return el && (['input', 'textarea'].includes(el.tagName.toLowerCase()) || el.isContentEditable);
};

export function useScoreKeyboardShortcuts(options = {}) {
    const route = useRoute();
    const localePath = useLocalePath();

    const { prevPiece, nextPiece } = options ?? {};
    const prev = computed(() => unref(prevPiece));
    const next = computed(() => unref(nextPiece));

    onKeyStroke('ArrowLeft', () => {
        if (ignoreIfInput() || !prev.value) return;
        navigateTo(localePath({ name: 'pieces-uid', params: { uid: prev.value.uid }, hash: route.hash }));
    });

    onKeyStroke('ArrowRight', () => {
        if (ignoreIfInput() || !next.value) return;
        navigateTo(localePath({ name: 'pieces-uid', params: { uid: next.value.uid }, hash: route.hash }));
    });
}
