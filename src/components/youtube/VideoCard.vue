<template>
  <div class="video-card flex flex-col group cursor-pointer" @click="goToWatch">
    <!-- Thumbnail Container (16:9 ratio) -->
    <div
      class="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-800"
    >
      <img
        :src="video.thumbnail"
        :alt="video.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
        loading="lazy"
      />

      <!-- Play Icon Overlay on Hover -->
      <div
        class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
      >
        <div
          class="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform"
        >
          <span class="material-icons text-2xl ml-0.5">play_arrow</span>
        </div>
      </div>

      <!-- Access Type Badge -->
      <div class="absolute top-2 left-2 flex gap-1 z-10">
        <span
          v-if="video.access_type === 'paid'"
          class="px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wide uppercase shadow-sm bg-black/80 backdrop-blur-sm text-white flex items-center gap-1"
        >
          <span class="material-icons text-xs">workspace_premium</span>
          <span>Tsh {{ video.price_amount.toLocaleString() }}</span>
        </span>
        <span
          v-else
          class="px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wide uppercase shadow-sm bg-black/70 backdrop-blur-sm text-white/90"
        >
          Bure
        </span>
      </div>

      <!-- Duration Badge -->
      <div
        class="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm text-white text-xs font-semibold tracking-wider"
      >
        {{ video.duration_formatted }}
      </div>
    </div>

    <!-- Details Section -->
    <div class="flex gap-3 mt-3 items-start">
      <!-- Comedian Avatar -->
      <RouterLink
        :to="{ name: 'comedian-profile', params: { id: video.comedian_id } }"
        class="flex-shrink-0"
        @click.stop
      >
        <img
          :src="video.comedian.avatar"
          :alt="video.comedian.stage_name"
          class="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-gray-700 hover:ring-2 hover:ring-red-500 transition-all"
        />
      </RouterLink>

      <!-- Video Meta -->
      <div class="flex-1 min-w-0">
        <h3
          class="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 transition-colors"
          :title="video.title"
        >
          {{ video.title }}
        </h3>

        <!-- Comedian Name -->
        <RouterLink
          :to="{ name: 'comedian-profile', params: { id: video.comedian_id } }"
          class="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors truncate"
          @click.stop
        >
          <span>{{ video.comedian.stage_name }}</span>
          <span
            v-if="video.comedian.verified"
            class="material-icons text-xs text-gray-400 leading-none"
            title="Msanii aliyethibitishwa"
          >
            check_circle
          </span>
        </RouterLink>

        <!-- Views and Upload Date -->
        <div class="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <span>{{ formatViews(video.views_count) }} views</span>
          <span>•</span>
          <span>{{ formatTimeAgo(video.published_at) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Video } from '../../services/api/video.api'

const props = defineProps<{
  video: Video
}>()

const router = useRouter()

const goToWatch = () => {
  router.push({ name: 'watch', params: { id: props.video.id } })
}

const formatViews = (views: number): string => {
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M'
  if (views >= 1000) return (views / 1000).toFixed(1) + 'K'
  return views.toString()
}

const formatTimeAgo = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days <= 0) return 'Leo'
  if (days === 1) return 'Jana'
  if (days < 7) return `Siku ${days} zilizopita`
  if (days < 30) return `Wiki ${Math.floor(days / 7)} zilizopita`
  return `Mwezi ${Math.floor(days / 30)} uliopita`
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
