<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span class="material-icons text-purple-600">video_library</span>
          <span>Maktaba Yangu ya Kicheko</span>
        </h1>
        <p class="text-xs text-gray-500 mt-1">Hapa unakuta video ulizonunua na zile ulizoweka alama ya kupenda.</p>
      </div>
    </div>

    <!-- Tab Selector -->
    <div class="flex gap-4 border-b border-gray-200 dark:border-gray-800 text-sm font-semibold">
      <button
        type="button"
        class="pb-3 border-b-2 transition-colors flex items-center gap-1.5"
        :class="[
          activeTab === 'purchased'
            ? 'border-red-600 text-red-600'
            : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white',
        ]"
        @click="activeTab = 'purchased'"
      >
        <span class="material-icons text-base">shopping_bag</span>
        <span>Video Zilizolipwa ({{ purchasedVideos.length }})</span>
      </button>

      <button
        type="button"
        class="pb-3 border-b-2 transition-colors flex items-center gap-1.5"
        :class="[
          activeTab === 'liked'
            ? 'border-red-600 text-red-600'
            : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white',
        ]"
        @click="activeTab = 'liked'"
      >
        <span class="material-icons text-base">thumb_up</span>
        <span>Zilizopendwa ({{ likedVideos.length }})</span>
      </button>
    </div>

    <!-- Purchased Videos Tab -->
    <div v-if="activeTab === 'purchased'">
      <div
        v-if="purchasedVideos.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-7"
      >
        <VideoCard v-for="v in purchasedVideos" :key="v.id" :video="v" />
      </div>
      <div
        v-else
        class="text-center py-16 bg-gray-50 dark:bg-[#18181b] rounded-2xl border border-gray-200 dark:border-gray-800 p-8"
      >
        <span class="material-icons text-5xl text-gray-400">workspace_premium</span>
        <h3 class="text-base font-bold text-gray-800 dark:text-gray-200 mt-2">Bado hujanunua video yoyote</h3>
        <p class="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
          Unaponunua video za kulipia za wasanii wako pendwa, zitaonekana hapa moja kwa moja bila kikomo cha kuzitazama.
        </p>
        <RouterLink
          to="/"
          class="mt-4 inline-block px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full text-xs"
        >
          Tazama Video za Sasa
        </RouterLink>
      </div>
    </div>

    <!-- Liked Videos Tab -->
    <div v-if="activeTab === 'liked'">
      <div
        v-if="likedVideos.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-7"
      >
        <VideoCard v-for="v in likedVideos" :key="v.id" :video="v" />
      </div>
      <div
        v-else
        class="text-center py-16 bg-gray-50 dark:bg-[#18181b] rounded-2xl border border-gray-200 dark:border-gray-800 p-8"
      >
        <span class="material-icons text-5xl text-gray-400">thumb_up_off_alt</span>
        <h3 class="text-base font-bold text-gray-800 dark:text-gray-200 mt-2">Bado huna video ulizozipenda</h3>
        <p class="text-xs text-gray-500 mt-1">
          Bonyeza kitufe cha 'Like' kwenye video yoyote ya Kicheko ili kuihifadhi hapa.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import VideoCard from '../../components/youtube/VideoCard.vue'
import { videoApi, type Video } from '../../services/api/video.api'

const route = useRoute()

const activeTab = ref<'purchased' | 'liked'>('purchased')
const purchasedVideos = ref<Video[]>([])
const likedVideos = ref<Video[]>([])

const load = async () => {
  purchasedVideos.value = await videoApi.getUserLibrary()
  likedVideos.value = await videoApi.getUserLikedVideos()
}

watch(
  () => route.query.tab,
  (tab) => {
    if (tab === 'liked') activeTab.value = 'liked'
    else activeTab.value = 'purchased'
  },
  { immediate: true },
)

onMounted(() => {
  load()
})
</script>
