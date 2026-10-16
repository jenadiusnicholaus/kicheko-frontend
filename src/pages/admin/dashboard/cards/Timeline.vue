<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import VaTimelineItem from '../../../../components/va-timeline-item.vue'

const { t } = useI18n()
</script>

<template>
  <VaCard>
    <VaCardTitle class="flex justify-between">
      <h1 class="card-title text-secondary font-bold uppercase">{{ t('taifa.misc.cards.timeline') }}</h1>
    </VaCardTitle>
    <VaCardContent>
      <table class="mt-4">
        <tbody>
          <VaTimelineItem date="25m ago">
            <RouterLink class="va-link font-semibold" to="/users">Donald</RouterLink>
            {{ t('taifa.misc.timeline.updatedStatusOf') }}
            <RouterLink class="va-link font-semibold" to="/users">Refund #1234</RouterLink>
            {{ t('taifa.misc.timeline.toAwaitingResponse') }}
          </VaTimelineItem>
          <VaTimelineItem date="1h ago">
            <RouterLink class="va-link font-semibold" to="/users">Lycy Peterson</RouterLink>
            {{ t('taifa.misc.timeline.addedToGroup') }},
            {{ t('taifa.misc.timeline.groupNamed', { name: 'Overtake' }) }}
          </VaTimelineItem>
          <VaTimelineItem date="2h ago">
            <RouterLink class="va-link font-semibold" to="/users">Joseph Rust</RouterLink>
            {{ t('taifa.misc.timeline.openedShowcase') }}
            <RouterLink class="va-link font-semibold" to="/users">Mannat #112233</RouterLink>
            {{ t('taifa.misc.timeline.withTheme', { theme: 'market' }) }}
          </VaTimelineItem>
          <VaTimelineItem date="3d ago">
            <RouterLink class="va-link font-semibold" to="/users">Donald</RouterLink>
            {{ t('taifa.misc.timeline.updatedStatusTo') }}
          </VaTimelineItem>
          <VaTimelineItem date="Nov 14, 2023">
            <RouterLink class="va-link font-semibold" to="/users">Lycy Peterson</RouterLink>
            {{ t('taifa.misc.timeline.addedToGroup') }}
          </VaTimelineItem>
          <VaTimelineItem date="Nov 14, 2023">
            <RouterLink class="va-link font-semibold" to="/users">Dan Rya</RouterLink>
            {{ t('taifa.misc.timeline.addedToGroup') }}
          </VaTimelineItem>
          <VaTimelineItem date="Nov 15, 2023">
            {{ t('taifa.misc.timeline.projectWord') }}
            <RouterLink class="va-link font-semibold" to="/projects">Vuestic 2023</RouterLink>
            {{ t('taifa.misc.timeline.wasCreated') }}
          </VaTimelineItem>
        </tbody>
      </table>
    </VaCardContent>
  </VaCard>
</template>
