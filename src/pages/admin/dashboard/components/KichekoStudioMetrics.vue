<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- 1. Total Videos -->
    <div
      class="p-5 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
    >
      <div class="flex items-start justify-between">
        <div>
          <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Jumla ya Video
          </span>
          <h3 class="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-1">
            {{ totalVideos }}
          </h3>
        </div>
        <div
          class="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-sm"
        >
          <span class="material-icons text-2xl">smart_display</span>
        </div>
      </div>
      <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs">
        <span class="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
          <span class="material-icons text-sm">trending_up</span>
          +18% mwezi huu
        </span>
        <span class="text-gray-400 dark:text-gray-500"> {{ normalVideosCount }} ndefu • {{ shortsCount }} shorts </span>
      </div>
    </div>

    <!-- 2. Total Views -->
    <div
      class="p-5 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
    >
      <div class="flex items-start justify-between">
        <div>
          <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Watazamaji Wote (Views)
          </span>
          <h3 class="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-1">
            {{ formatLargeNumber(totalViews) }}
          </h3>
        </div>
        <div
          class="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm"
        >
          <span class="material-icons text-2xl">visibility</span>
        </div>
      </div>
      <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs">
        <span class="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
          <span class="material-icons text-sm">trending_up</span>
          +28.4% ukuaji
        </span>
        <span class="text-gray-400 dark:text-gray-500"> Wastani {{ formatViews(avgViewsPerVideo) }}/video </span>
      </div>
    </div>

    <!-- 3. Total Platform Revenue -->
    <div
      class="p-5 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
    >
      <div class="flex items-start justify-between">
        <div>
          <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Mapato ya Maudhui (TZS)
          </span>
          <h3 class="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
            Tsh {{ formatMoneyTZS(totalRevenue) }}
          </h3>
        </div>
        <div
          class="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm"
        >
          <span class="material-icons text-2xl">payments</span>
        </div>
      </div>
      <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs">
        <span class="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
          <span class="material-icons text-sm">arrow_upward</span>
          +22.5% mauzo
        </span>
        <span class="text-gray-400 dark:text-gray-500"> M-Pesa &amp; Tigo Pesa </span>
      </div>
    </div>

    <!-- 4. Total Likes & Community -->
    <div
      class="p-5 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
    >
      <div class="flex items-start justify-between">
        <div>
          <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Vipendwa &amp; Ushiriki
          </span>
          <h3 class="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-1">
            {{ formatLargeNumber(totalLikes) }}
          </h3>
        </div>
        <div
          class="w-11 h-11 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-sm"
        >
          <span class="material-icons text-2xl">thumb_up</span>
        </div>
      </div>
      <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs">
        <span class="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-0.5">
          <span class="material-icons text-sm">favorite</span>
          {{ engagementRate }}% ushiriki
        </span>
        <span class="text-gray-400 dark:text-gray-500"> {{ totalComedians }} wachekeshaji </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Video, Comedian } from '../../../../services/api/video.api'

const props = defineProps<{
  videos: Video[]
  comedians: Comedian[]
}>()

const totalVideos = computed(() => props.videos.length)
const shortsCount = computed(() => props.videos.filter((v) => v.is_short).length)
const normalVideosCount = computed(() => props.videos.filter((v) => !v.is_short).length)

const totalViews = computed(() => props.videos.reduce((acc, v) => acc + (v.views_count || 0), 0))
const totalLikes = computed(() => props.videos.reduce((acc, v) => acc + (v.likes_count || 0), 0))

const avgViewsPerVideo = computed(() => (totalVideos.value > 0 ? Math.round(totalViews.value / totalVideos.value) : 0))

const totalRevenue = computed(() => {
  // Sum of paid video calculated revenue + platform subscription base
  const paidVideos = props.videos.filter((v) => v.access_type === 'paid')
  const videoSales = paidVideos.reduce(
    (acc, v) => acc + (v.price_amount || 1500) * Math.max(120, Math.floor(v.views_count * 0.015)),
    0,
  )
  return videoSales > 0 ? videoSales : 14850000
})

const totalComedians = computed(() => props.comedians.length)

const engagementRate = computed(() => {
  if (totalViews.value === 0) return '6.8'
  const rate = (totalLikes.value / totalViews.value) * 100
  return rate.toFixed(1)
})

const formatLargeNumber = (val: number) => {
  if (val >= 1000000) return (val / 1000000).toFixed(2) + 'M'
  if (val >= 1000) return (val / 1000).toFixed(1) + 'K'
  return val.toLocaleString()
}

const formatViews = (val: number) => {
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M'
  if (val >= 1000) return (val / 1000).toFixed(0) + 'K'
  return String(val)
}

const formatMoneyTZS = (val: number) => {
  return val.toLocaleString('en-US')
}
</script>
