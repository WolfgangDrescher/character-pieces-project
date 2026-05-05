<script setup>
import { useMagicKeys } from '@vueuse/core';

const localePath = useLocalePath();

const isSearchOpen = ref(false);
const { meta, k } = useMagicKeys();

watchEffect(() => {
    if (meta.value && k.value) isSearchOpen.value = true;
});
</script>

<template>    
    <header class="bg-primary-500 text-white bg-pattern">
        <div class="flex justify-between items-center py-2 px-4 gap-4">
            <img src="/mhfr-logo-white.svg" class="hidden md:block max-h-[50px] mx-auto" alt="Hochschule für Musik Freiburg" />
            <div class="grow flex items-center gap-4">
                <div class="font-extrabold text-lg md:text-2xl">
                    <NuxtLink :to="localePath('/')">
                        Character Pieces Project
                    </NuxtLink>
                </div>
            </div>
            <div class="flex gap-2 justify-end items-center">
                <UButton
                    icon="i-simple-icons-github"
                    to="https://github.com/WolfgangDrescher/character-pieces-project"
                    target="_blank"
                    variant="ghost"
                    color="neutral"
                    square
                    :ui="{ label: 'hidden', base: 'text-white hover:text-black' }"
                />
                <SearchPiecePalette v-model:open="isSearchOpen" />
            </div>
        </div>
    </header>
</template>
