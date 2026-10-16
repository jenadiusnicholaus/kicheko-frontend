<template>
  <div v-if="comedian" class="space-y-6">
    <!-- Channel Banner Header -->
    <div class="relative w-full h-44 sm:h-64 rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 shadow-md">
      <img :src="comedian.cover || comedian.avatar" :alt="comedian.stage_name" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
    </div>

    <!-- Comedian Info Bar -->
    <div
      class="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 relative z-10 px-4"
    >
      <div class="flex items-end gap-4">
        <img
          :src="comedian.avatar"
          :alt="comedian.stage_name"
          class="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-[#0f0f12] shadow-xl"
        />
        <div class="space-y-1 mb-1">
          <div class="flex items-center gap-1.5">
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-none">
              {{ comedian.stage_name }}
            </h1>
            <span v-if="comedian.verified" class="material-icons text-base text-blue-500">check_circle</span>
          </div>
          <p class="text-xs text-gray-500">
            @{{ comedian.stage_name.toLowerCase().replace(/\s+/g, '') }} •
            {{ t('taifa.pages.common.followers', { count: formatFollowers(comedian.followers_count) }) }} •
            {{ t('taifa.pages.profile.videosCount', { count: comedianVideos.length }) }}
          </p>
          <p class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 max-w-xl leading-relaxed">
            {{ comedian.bio }}
          </p>
        </div>
      </div>

      <!-- Action Button -->
      <button
        type="button"
        class="px-5 py-2 rounded-full text-xs font-bold transition-all shadow-md"
        :class="[
          isFollowed
            ? 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
            : 'bg-amber-400 hover:bg-amber-500 text-gray-950 font-black',
        ]"
        @click="toggleFollow"
      >
        {{ isFollowed ? t('taifa.pages.common.following') : t('taifa.pages.common.follow') }}
      </button>
    </div>

    <!-- Tabs: Videos & Shorts -->
    <div class="border-b border-gray-200 dark:border-gray-800 flex gap-6 text-sm font-semibold">
      <button
        type="button"
        class="pb-3 border-b-2 transition-colors font-bold"
        :class="[
          activeTab === 'videos'
            ? 'border-amber-400 text-amber-600 dark:text-amber-400'
            : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white',
        ]"
        @click="activeTab = 'videos'"
      >
        {{ t('taifa.pages.profile.allVideos', { count: comedianVideos.length }) }}
      </button>
      <button
        type="button"
        class="pb-3 border-b-2 transition-colors font-bold"
        :class="[
          activeTab === 'shorts'
            ? 'border-amber-400 text-amber-600 dark:text-amber-400'
            : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white',
        ]"
        @click="activeTab = 'shorts'"
      >
        {{ t('taifa.pages.profile.shortsTab', { count: comedianShorts.length }) }}
      </button>
    </div>

    <!-- Videos Grid -->
    <div v-if="activeTab === 'videos'">
      <div
        v-if="comedianVideos.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-7"
      >
        <VideoCard v-for="v in comedianVideos" :key="v.id" :video="v" />
      </div>
      <div v-else class="text-center py-12 text-gray-500">{{ t('taifa.pages.profile.noVideos') }}</div>
    </div>

    <!-- Shorts Grid -->
    <div v-if="activeTab === 'shorts'">
      <div v-if="comedianShorts.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <RouterLink
          v-for="short in comedianShorts"
          :key="short.id"
          :to="{ name: 'short-detail', params: { id: short.id } }"
          class="group relative aspect-[9/16] rounded-xl overflow-hidden bg-gray-900 shadow-md block border border-gray-800"
        >
          <img
            :src="short.thumbnail"
            :alt="short.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-2.5 flex flex-col justify-end"
          >
            <p class="text-xs font-bold text-white line-clamp-2">
              {{ short.title }}
            </p>
          </div>
        </RouterLink>
      </div>
      <div v-else class="text-center py-12 text-gray-500">{{ t('taifa.pages.profile.noShorts') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vuestic-ui'
import VideoCard from '../../components/youtube/VideoCard.vue'
import { videoApi, type Comedian, type Video } from '../../services/api/video.api'

const route = useRoute()
const { t } = useI18n()
const { init: toast } = useToast()

const comedian = ref<Comedian | null>(null)
const comedianVideos = ref<Video[]>([])
const comedianShorts = ref<Video[]>([])
const isFollowed = ref(false)
const activeTab = ref<'videos' | 'shorts'>('videos')

const load = async () => {
  const id = String(route.params.id)
  comedian.value = await videoApi.getComedianById(id)
  const all = await videoApi.getVideos({ comedian_id: id })
  comedianVideos.value = all.filter((v) => !v.is_short)
  const allShorts = await videoApi.getShorts()
  comedianShorts.value = allShorts.filter((s) => s.comedian_id === id)
}

const toggleFollow = () => {
  isFollowed.value = !isFollowed.value
  toast({
    message: isFollowed.value
      ? t('taifa.pages.common.followedToast', { name: comedian.value?.stage_name })
      : t('taifa.pages.common.unfollowedToast', { name: comedian.value?.stage_name }),
    color: 'info',
  })
}

const formatFollowers = (count: number): string => {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M'
  if (count >= 1000) return (count / 1000).toFixed(1) + 'K'
  return count.toString()
}

onMounted(() => {
  load()
})
</script>
