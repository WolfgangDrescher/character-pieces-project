<script setup>
const { t } = useI18n();

useHead({
    title: t('home'),
});
</script>

 <template>
    <UContainer>
        <section class="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
                <Heading>Character Pieces Project</Heading>
            </div>
        </section>
    </UContainer>
</template>
