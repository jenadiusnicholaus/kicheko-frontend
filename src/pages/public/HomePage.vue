<template>
  <div class="space-y-6">
    <!-- Category Chips Filter -->
    <CategoryChips :selected-category="selectedCategory" @select="handleCategorySelect" />

    <!-- Featured Spotlight Banner (Shown on All) -->
    <div
      v-if="featuredVideo && selectedCategory === 'All'"
      class="relative rounded-2xl overflow-hidden bg-gradient-to-r from-amber-950/80 via-slate-900 to-black text-white p-6 sm:p-8 shadow-xl border border-amber-900/50"
    >
      <div class="absolute -right-10 -bottom-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div class="relative z-10 max-w-2xl space-y-3">
        <div
          class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-400 text-gray-950 text-xs font-black uppercase tracking-wider"
        >
          <span class="material-icons text-xs">local_fire_department</span>
          <span>{{ t('kicheko.home.hotBadge') }}</span>
        </div>
        <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
          {{ featuredVideo.title }}
        </h1>
        <p class="text-sm sm:text-base text-gray-300 line-clamp-2 leading-relaxed">
          {{ featuredVideo.description }}
        </p>
        <div class="flex flex-wrap items-center gap-3 pt-2">
          <RouterLink
            :to="{ name: 'watch', params: { id: featuredVideo.id } }"
            class="px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-500 text-gray-950 font-black text-sm inline-flex items-center gap-2 shadow-lg hover:shadow-amber-400/30 transition-all"
          >
            <span class="material-icons text-xl">play_arrow</span>
            <span>{{ t('kicheko.home.watchNow') }}</span>
          </RouterLink>
          <div class="flex items-center gap-2 text-xs text-gray-400">
            <span class="font-semibold text-white">{{ featuredVideo.comedian.stage_name }}</span>
            <span>•</span>
            <span>{{ featuredVideo.duration_formatted }}</span>
            <span>•</span>
            <span v-if="featuredVideo.access_type === 'paid'" class="text-amber-400 font-bold">
              Tsh {{ featuredVideo.price_amount.toLocaleString() }}
            </span>
            <span v-else class="text-emerald-400 font-bold">{{ t('kicheko.home.free') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Videos Grid -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span class="material-icons text-amber-500 text-xl">movie</span>
          <span>{{ feedHeading }}</span>
        </h2>
        <span class="text-xs text-gray-500">{{ t('kicheko.home.videosAvailable', { n: filteredVideos.length }) }}</span>
      </div>

      <!-- Loading skeleton -->
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6">
        <div v-for="i in 8" :key="i" class="animate-pulse space-y-3">
          <div class="aspect-video bg-gray-200 dark:bg-gray-800 rounded-xl" />
          <div class="flex gap-3">
            <div class="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800 flex-shrink-0" />
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
              <div class="h-3 bg-gray-200 dark:bg-gray-800 rounded w-3/5" />
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredVideos.length === 0"
        class="text-center py-16 bg-gray-50 dark:bg-[#18181b] rounded-2xl border border-gray-200 dark:border-gray-800 p-8"
      >
        <span class="material-icons text-5xl text-gray-400 mb-2">sentiment_dissatisfied</span>
        <h3 class="text-base font-bold text-gray-800 dark:text-gray-200">{{ t('kicheko.home.noVideos') }}</h3>
        <p class="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
          {{ t('kicheko.home.noVideosDesc') }}
        </p>
        <button
          type="button"
          class="mt-4 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-gray-950 rounded-full text-xs font-bold"
          @click="handleCategorySelect('All')"
        >
          {{ t('kicheko.home.showAll') }}
        </button>
      </div>

      <!-- Video Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-7">
        <VideoCard v-for="video in primaryVideoList" :key="video.id" :video="video" />
      </div>
    </div>

    <!-- YouTube-style Shorts Shelf in Feed -->
    <div
      v-if="shortsList.length > 0 && selectedCategory === 'All'"
      class="pt-6 border-t border-gray-200 dark:border-gray-800"
    >
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-amber-400 text-gray-950 flex items-center justify-center font-bold">
            <span class="material-icons text-lg">bolt</span>
          </div>
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">{{ t('kicheko.home.shortsShelf') }}</h2>
        </div>
        <RouterLink
          :to="{ name: 'shorts' }"
          class="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
        >
          <span>{{ t('kicheko.home.seeAll') }}</span>
          <span class="material-icons text-sm">chevron_right</span>
        </RouterLink>
      </div>

      <!-- Shorts Horizontal Reel -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <RouterLink
          v-for="short in shortsList"
          :key="short.id"
          :to="{ name: 'short-detail', params: { id: short.id } }"
          class="group relative aspect-[9/16] rounded-xl overflow-hidden bg-gray-900 shadow-md block border border-gray-800 hover:scale-[1.02] transition-transform"
        >
          <img
            :short="short"
            :src="short.thumbnail"
            :alt="short.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-2.5 flex flex-col justify-between"
          >
            <div class="flex justify-end">
              <span class="px-1.5 py-0.5 rounded bg-amber-400 text-[10px] font-black text-gray-950 uppercase"
                >Short</span
              >
            </div>
            <div>
              <p class="text-xs font-bold text-white line-clamp-2 leading-snug">
                {{ short.title }}
              </p>
              <p class="text-[10px] text-gray-300 mt-0.5 truncate">
                {{ short.comedian.stage_name }} • {{ formatViews(short.views_count) }}
              </p>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>

    <!-- Remaining Videos Grid (if any) -->
    <div
      v-if="secondaryVideoList.length > 0 && selectedCategory === 'All'"
      class="pt-6 border-t border-gray-200 dark:border-gray-800"
    >
      <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">{{ t('kicheko.home.moreVideos') }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-7">
        <VideoCard v-for="video in secondaryVideoList" :key="video.id" :video="video" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import CategoryChips from '../../components/youtube/CategoryChips.vue'
import VideoCard from '../../components/youtube/VideoCard.vue'
import { videoApi, type Video } from '../../services/api/video.api'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()

const videos = ref<Video[]>([])
const shortsList = ref<Video[]>([])
const isLoading = ref(true)
const selectedCategory = ref('All')

const loadContent = async () => {
  isLoading.value = true
  try {
    videos.value = await videoApi.getVideos()
    shortsList.value = await videoApi.getShorts()
  } finally {
    isLoading.value = false
  }
}

// Watch query param category
watch(
  () => route.query.category,
  (cat) => {
    if (typeof cat === 'string') {
      selectedCategory.value = cat
    } else {
      selectedCategory.value = 'All'
    }
  },
  { immediate: true },
)

const handleCategorySelect = (cat: string) => {
  selectedCategory.value = cat
  if (cat === 'All') {
    router.push({ name: 'home' })
  } else {
    router.push({ name: 'home', query: { category: cat } })
  }
}

const filteredVideos = computed(() => {
  if (selectedCategory.value === 'All') return videos.value
  if (selectedCategory.value === 'Free') return videos.value.filter((v) => v.access_type === 'free')
  if (selectedCategory.value === 'Premium') return videos.value.filter((v) => v.access_type === 'paid')
  if (selectedCategory.value === 'Trending') return [...videos.value].sort((a, b) => b.views_count - a.views_count)
  return videos.value.filter((v) => v.category.toLowerCase() === selectedCategory.value.toLowerCase())
})

const featuredVideo = computed(() => {
  return videos.value[0] || null
})

// Split video list so the Shorts shelf can be placed naturally between cards
const primaryVideoList = computed(() => {
  if (selectedCategory.value !== 'All') return filteredVideos.value
  return filteredVideos.value.slice(0, 4)
})

const secondaryVideoList = computed(() => {
  if (selectedCategory.value !== 'All') return []
  return filteredVideos.value.slice(4)
})

const feedHeading = computed(() => {
  if (selectedCategory.value === 'All') return t('kicheko.home.recommended')
  if (selectedCategory.value === 'Free') return t('kicheko.home.freeVideos')
  if (selectedCategory.value === 'Premium') return t('kicheko.home.premiumVideos')
  if (selectedCategory.value === 'Trending') return t('kicheko.home.trending')
  return t('kicheko.home.comedy', { cat: selectedCategory.value })
})

const formatViews = (views: number): string => {
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M'
  if (views >= 1000) return (views / 1000).toFixed(1) + 'K'
  return views.toString()
}

onMounted(() => {
  loadContent()
})
</script>
