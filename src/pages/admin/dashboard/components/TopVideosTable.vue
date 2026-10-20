<template>
  <div
    class="p-5 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm space-y-4"
  >
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-800"
    >
      <div>
        <div class="flex items-center gap-2">
          <span class="material-icons text-amber-500 text-xl">trending_up</span>
          <h2 class="text-base font-bold text-gray-900 dark:text-white">
            {{ t('taifa.misc.topVideos.title') }}
          </h2>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {{ t('taifa.misc.topVideos.subtitle') }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <RouterLink
          :to="{ name: 'admin-videos' }"
          class="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
        >
          <span>{{ t('taifa.misc.topVideos.manageAll') }} &rarr;</span>
        </RouterLink>
      </div>
    </div>

    <!-- Table -->
    <VaDataTable :columns="columns" :items="topVideos" items-track-by="id">
      <!-- 1. Video Thumbnail + Title -->
      <template #cell(video)="{ rowData: v, rowIndex }">
        <div class="flex items-center gap-2.5 min-w-[200px]">
          <span class="font-extrabold text-gray-400 w-4 text-center">#{{ rowIndex + 1 }}</span>
          <div
            class="relative w-16 aspect-video rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 shrink-0 shadow-sm"
          >
            <img :src="v.thumbnail" :alt="v.title" class="w-full h-full object-cover" />
            <span class="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded bg-black/80 text-[9px] text-white font-bold">
              {{ v.duration_formatted }}
            </span>
          </div>
          <div class="min-w-0">
            <RouterLink
              :to="{ name: v.is_short ? 'short-detail' : 'watch', params: { id: v.id } }"
              class="font-bold text-gray-900 dark:text-white hover:text-amber-500 line-clamp-1 transition-colors text-xs"
            >
              {{ v.title }}
            </RouterLink>
            <span
              v-if="v.is_short"
              class="inline-block px-1 py-0.2 rounded bg-amber-400 text-gray-950 font-black text-[9px] uppercase mt-0.5"
            >
              {{ t('taifa.misc.topVideos.shortBadge') }}
            </span>
          </div>
        </div>
      </template>

      <!-- 2. Comedian -->
      <template #cell(artist)="{ rowData: v }">
        <div class="flex items-center gap-1.5 whitespace-nowrap">
          <img :src="v.comedian.avatar" :alt="v.comedian.stage_name" class="w-5 h-5 rounded-full object-cover" />
          <span class="font-semibold text-gray-800 dark:text-gray-200 text-xs">{{ v.comedian.stage_name }}</span>
        </div>
      </template>

      <!-- 3. Category -->
      <template #cell(category)="{ rowData: v }">
        <span
          class="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 font-medium text-xs whitespace-nowrap"
        >
          {{ v.category }}
        </span>
      </template>

      <!-- 4. Price -->
      <template #cell(price)="{ rowData: v }">
        <span
          v-if="v.access_type === 'paid'"
          class="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400 font-bold text-xs whitespace-nowrap"
        >
          Tsh {{ v.price_amount?.toLocaleString() }}
        </span>
        <span v-else class="text-emerald-600 dark:text-emerald-400 font-bold text-xs">
          {{ t('kicheko.home.free') }}
        </span>
      </template>

      <!-- 5. Views -->
      <template #cell(views)="{ rowData: v }">
        <span class="font-black text-gray-900 dark:text-white whitespace-nowrap text-xs">
          {{ v.views_count.toLocaleString() }}
        </span>
      </template>

      <!-- 6. Likes -->
      <template #cell(likes)="{ rowData: v }">
        <span class="text-gray-600 dark:text-gray-400 whitespace-nowrap text-xs">
          {{ v.likes_count.toLocaleString() }}
        </span>
      </template>

      <!-- 7. Action -->
      <template #cell(actions)="{ rowData: v }">
        <RouterLink
          :to="{ name: v.is_short ? 'short-detail' : 'watch', params: { id: v.id } }"
          target="_blank"
          class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 hover:text-amber-500 inline-flex items-center justify-center transition-colors"
          :title="t('taifa.misc.topVideos.watchVideo')"
        >
          <span class="material-icons text-base">open_in_new</span>
        </RouterLink>
      </template>
    </VaDataTable>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { defineVaDataTableColumns } from 'vuestic-ui'
import type { Video } from '../../../../services/api/video.api'

const { t } = useI18n()

const columns = computed(() =>
  defineVaDataTableColumns([
    { label: t('taifa.misc.topVideos.thVideo'), key: 'video' },
    { label: t('taifa.misc.topVideos.thArtist'), key: 'artist' },
    { label: t('taifa.misc.topVideos.thCategory'), key: 'category' },
    { label: t('taifa.misc.topVideos.thPrice'), key: 'price' },
    { label: t('taifa.misc.topVideos.thViews'), key: 'views', thAlign: 'right', tdAlign: 'right' },
    { label: t('taifa.misc.topVideos.thLikes'), key: 'likes', thAlign: 'right', tdAlign: 'right' },
    { label: t('taifa.misc.topVideos.thAction'), key: 'actions', thAlign: 'center', tdAlign: 'center' },
  ]),
)

const props = defineProps<{
  videos: Video[]
}>()

const topVideos = computed(() => {
  return [...props.videos].sort((a, b) => b.views_count - a.views_count).slice(0, 6)
})
</script>
