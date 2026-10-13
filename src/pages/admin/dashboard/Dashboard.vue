<template>
  <div class="space-y-6">
    <!-- Studio Header -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm"
    >
      <div class="flex items-center gap-3.5">
        <div
          class="w-12 h-12 rounded-2xl bg-amber-400 text-gray-950 flex items-center justify-center font-black shadow-md shrink-0"
        >
          <img src="/image/kicheko-icon.png" alt="Kicheko" class="w-8 h-8 object-contain" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Studio ya Kicheko
            </h1>
            <span
              class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 text-[11px] font-bold"
            >
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Mtandaoni
            </span>
          </div>
          <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Dashibodi kuu ya takwimu za video, mapato ya TZS na ushiriki wa watazamaji Tanzania
          </p>
        </div>
      </div>

      <!-- Quick Action Controls -->
      <div class="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          class="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 transition-colors"
          title="Pakia Upya Takwimu"
          :disabled="isLoading"
          @click="loadPlatformData"
        >
          <span class="material-icons text-lg" :class="{ 'animate-spin': isLoading }">refresh</span>
        </button>

        <RouterLink
          to="/"
          target="_blank"
          class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <span class="material-icons text-base">smart_display</span>
          <span>Tazama Jukwaa</span>
          <span class="material-icons text-xs">open_in_new</span>
        </RouterLink>

        <RouterLink
          :to="{ name: 'admin-videos' }"
          class="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-gray-950 text-xs font-black shadow-md hover:shadow-amber-400/30 flex items-center gap-1.5 transition-all"
        >
          <span class="material-icons text-base">video_call</span>
          <span>Pakia Video Mpya</span>
        </RouterLink>
      </div>
    </div>

    <!-- 1. Real Platform Key Performance Indicators (KPIs) -->
    <KichekoStudioMetrics :videos="videos" :comedians="comedians" />

    <!-- 2. Charts Section: Views & Engagement Trend + Payment Method Breakdown -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <ViewsAnalyticsChart class="lg:col-span-2" />
      <RevenuePaymentBreakdown class="lg:col-span-1" />
    </div>

    <!-- 3. Tables & Leaderboard Row: Top Videos & Top Creators -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <TopVideosTable :videos="videos" class="lg:col-span-2" />
      <TopComediansLeaderboard :comedians="comedians" class="lg:col-span-1" />
    </div>

    <!-- 4. Live Platform Activity Stream -->
    <RecentActivityFeed />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { videoApi, type Video, type Comedian } from '../../../services/api/video.api'
import KichekoStudioMetrics from './components/KichekoStudioMetrics.vue'
import ViewsAnalyticsChart from './components/ViewsAnalyticsChart.vue'
import RevenuePaymentBreakdown from './components/RevenuePaymentBreakdown.vue'
import TopVideosTable from './components/TopVideosTable.vue'
import TopComediansLeaderboard from './components/TopComediansLeaderboard.vue'
import RecentActivityFeed from './components/RecentActivityFeed.vue'

const videos = ref<Video[]>([])
const comedians = ref<Comedian[]>([])
const isLoading = ref(false)

const loadPlatformData = async () => {
  isLoading.value = true
  try {
    const [fetchedVideos, fetchedShorts, fetchedComedians] = await Promise.all([
      videoApi.getVideos(),
      videoApi.getShorts(),
      videoApi.getComedians(),
    ])
    videos.value = [...fetchedVideos, ...fetchedShorts]
    comedians.value = fetchedComedians
  } catch (err) {
    console.error('Failed to load dashboard studio data:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadPlatformData()
})
</script>
