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
    <div class="overflow-x-auto custom-scrollbar">
      <table class="w-full text-left border-collapse text-xs">
        <thead>
          <tr class="border-b border-gray-100 dark:border-gray-800 text-gray-400 uppercase tracking-wider text-[11px]">
            <th class="py-2.5 px-3">{{ t('taifa.misc.topVideos.thVideo') }}</th>
            <th class="py-2.5 px-3">{{ t('taifa.misc.topVideos.thArtist') }}</th>
            <th class="py-2.5 px-3">{{ t('taifa.misc.topVideos.thCategory') }}</th>
            <th class="py-2.5 px-3">{{ t('taifa.misc.topVideos.thPrice') }}</th>
            <th class="py-2.5 px-3 text-right">{{ t('taifa.misc.topVideos.thViews') }}</th>
            <th class="py-2.5 px-3 text-right">{{ t('taifa.misc.topVideos.thLikes') }}</th>
            <th class="py-2.5 px-3 text-center">{{ t('taifa.misc.topVideos.thAction') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800/60">
          <tr
            v-for="(v, idx) in topVideos"
            :key="v.id"
            class="hover:bg-gray-50/80 dark:hover:bg-zinc-800/40 transition-colors"
          >
            <!-- 1. Video Thumbnail + Title -->
            <td class="py-3 px-3">
              <div class="flex items-center gap-2.5 min-w-[200px]">
                <span class="font-extrabold text-gray-400 w-4 text-center">#{{ idx + 1 }}</span>
                <div
                  class="relative w-16 aspect-video rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 shrink-0 shadow-sm"
                >
                  <img :src="v.thumbnail" :alt="v.title" class="w-full h-full object-cover" />
                  <span
                    class="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded bg-black/80 text-[9px] text-white font-bold"
                  >
                    {{ v.duration_formatted }}
                  </span>
                </div>
                <div class="min-w-0">
                  <RouterLink
                    :to="{ name: v.is_short ? 'short-detail' : 'watch', params: { id: v.id } }"
                    class="font-bold text-gray-900 dark:text-white hover:text-amber-500 line-clamp-1 transition-colors"
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
            </td>

            <!-- 2. Comedian -->
            <td class="py-3 px-3">
              <div class="flex items-center gap-1.5 whitespace-nowrap">
                <img :src="v.comedian.avatar" :alt="v.comedian.stage_name" class="w-5 h-5 rounded-full object-cover" />
                <span class="font-semibold text-gray-800 dark:text-gray-200">{{ v.comedian.stage_name }}</span>
              </div>
            </td>

            <!-- 3. Category -->
            <td class="py-3 px-3 whitespace-nowrap">
              <span
                class="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 font-medium"
              >
                {{ v.category }}
              </span>
            </td>

            <!-- 4. Price -->
            <td class="py-3 px-3 whitespace-nowrap">
              <span
                v-if="v.access_type === 'paid'"
                class="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400 font-bold"
              >
                Tsh {{ v.price_amount?.toLocaleString() }}
              </span>
              <span v-else class="text-emerald-600 dark:text-emerald-400 font-bold">
                {{ t('kicheko.home.free') }}
              </span>
            </td>

            <!-- 5. Views -->
            <td class="py-3 px-3 text-right font-black text-gray-900 dark:text-white whitespace-nowrap">
              {{ v.views_count.toLocaleString() }}
            </td>

            <!-- 6. Likes -->
            <td class="py-3 px-3 text-right text-gray-600 dark:text-gray-400 whitespace-nowrap">
              {{ v.likes_count.toLocaleString() }}
            </td>

            <!-- 7. Action -->
            <td class="py-3 px-3 text-center whitespace-nowrap">
              <RouterLink
                :to="{ name: v.is_short ? 'short-detail' : 'watch', params: { id: v.id } }"
                target="_blank"
                class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 hover:text-amber-500 inline-flex items-center justify-center transition-colors"
                :title="t('taifa.misc.topVideos.watchVideo')"
              >
                <span class="material-icons text-base">open_in_new</span>
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Video } from '../../../../services/api/video.api'

const { t } = useI18n()

const props = defineProps<{
  videos: Video[]
}>()

const topVideos = computed(() => {
  return [...props.videos].sort((a, b) => b.views_count - a.views_count).slice(0, 6)
})
</script>
