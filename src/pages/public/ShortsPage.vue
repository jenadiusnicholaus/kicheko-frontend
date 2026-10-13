<template>
  <div class="max-w-md mx-auto py-2">
    <!-- Shorts Feed Container -->
    <div
      v-if="currentShort"
      class="relative w-full aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-2xl border border-gray-800 flex flex-col justify-between"
    >
      <!-- Background Video Player -->
      <video
        ref="shortVideoPlayer"
        :src="currentVideoUrl"
        :poster="currentShort.thumbnail"
        autoplay
        loop
        playsinline
        class="absolute inset-0 w-full h-full object-cover cursor-pointer"
        @click="togglePlayPause"
        @timeupdate="onShortTimeUpdate"
        @error="handleShortVideoError"
      />

      <!-- Top Overlay Controls -->
      <div class="relative z-20 p-4 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent">
        <div class="flex items-center gap-2">
          <span
            class="px-2 py-0.5 rounded-md bg-amber-400 text-gray-950 text-[11px] font-black tracking-wider uppercase"
          >
            Short
          </span>
          <span class="text-xs text-white/80 font-medium"> {{ currentIndex + 1 }} ya {{ shorts.length }} </span>
        </div>
        <button
          type="button"
          class="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm"
          @click="toggleMute"
        >
          <span class="material-icons text-lg">{{ isMuted ? 'volume_off' : 'volume_up' }}</span>
        </button>
      </div>

      <!-- Center Play/Pause indicator on click -->
      <div
        v-if="isPaused"
        class="absolute inset-0 z-10 flex items-center justify-center bg-black/30 pointer-events-none"
      >
        <div class="w-16 h-16 rounded-full bg-black/70 text-white flex items-center justify-center">
          <span class="material-icons text-3xl">play_arrow</span>
        </div>
      </div>

      <!-- Right Floating Action Icons (YouTube Shorts style) -->
      <div class="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-4 text-white">
        <!-- Like Button -->
        <button type="button" class="flex flex-col items-center gap-1 group" @click="handleLike">
          <div
            class="w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all"
            :class="[isLiked ? 'bg-amber-400 text-gray-950 font-bold' : 'bg-black/50 text-white hover:bg-black/70']"
          >
            <span class="material-icons text-2xl">{{ isLiked ? 'thumb_up' : 'thumb_up_off_alt' }}</span>
          </div>
          <span class="text-[11px] font-bold drop-shadow">{{ currentShort.likes_count.toLocaleString() }}</span>
        </button>

        <!-- Share Button -->
        <button type="button" class="flex flex-col items-center gap-1 group" @click="shareShort">
          <div
            class="w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center backdrop-blur-md text-white transition-all"
          >
            <span class="material-icons text-2xl">share</span>
          </div>
          <span class="text-[11px] font-bold drop-shadow">Shiriki</span>
        </button>

        <!-- Next Short Button -->
        <button
          type="button"
          class="flex flex-col items-center gap-1 group"
          title="Short Inayofuata"
          @click="nextShort"
        >
          <div
            class="w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center backdrop-blur-md text-white transition-all"
          >
            <span class="material-icons text-2xl">arrow_downward</span>
          </div>
          <span class="text-[11px] font-bold drop-shadow">Ijayo</span>
        </button>
      </div>

      <!-- Bottom Details & "Watch Full Video" CTA -->
      <div class="relative z-20 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent space-y-3">
        <!-- Comedian Profile Header -->
        <div class="flex items-center gap-2.5">
          <RouterLink :to="{ name: 'comedian-profile', params: { id: currentShort.comedian_id } }">
            <img
              :src="currentShort.comedian.avatar"
              :alt="currentShort.comedian.stage_name"
              class="w-10 h-10 rounded-full object-cover border-2 border-amber-400 shadow-md"
            />
          </RouterLink>
          <div class="overflow-hidden">
            <div class="flex items-center gap-1">
              <span class="font-bold text-sm text-white truncate">{{ currentShort.comedian.stage_name }}</span>
              <span v-if="currentShort.comedian.verified" class="material-icons text-xs text-blue-400"
                >check_circle</span
              >
            </div>
            <span class="text-[11px] text-gray-300"
              >@{{ currentShort.comedian.stage_name.toLowerCase().replace(/\s+/g, '') }}</span
            >
          </div>
        </div>

        <!-- Short Title -->
        <p class="text-sm font-semibold text-white line-clamp-2 drop-shadow leading-snug">
          {{ currentShort.title }}
        </p>

        <!-- PROMINENT "Watch Full Video" BUTTON -->
        <div v-if="currentShort.full_video_id" class="pt-1">
          <RouterLink
            :to="{ name: 'watch', params: { id: currentShort.full_video_id } }"
            class="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-gray-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02]"
          >
            <span class="material-icons text-base">smart_display</span>
            <span>Tazama Onyesho Lote (Watch Full Video)</span>
            <span class="material-icons text-sm">arrow_forward</span>
          </RouterLink>
        </div>
      </div>

      <!-- Bottom Progress Bar -->
      <div class="absolute bottom-0 inset-x-0 h-1 bg-white/20 z-30 pointer-events-none">
        <div class="h-full bg-amber-400 transition-all duration-100" :style="{ width: `${shortProgress}%` }" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-20 text-gray-400">
      <span class="material-icons text-5xl">bolt</span>
      <p class="mt-2 text-sm">Hakuna video fupi (Shorts) kwa sasa.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vuestic-ui'
import { videoApi, type Video } from '../../services/api/video.api'

const route = useRoute()
const { init: toast } = useToast()

const shorts = ref<Video[]>([])
const currentIndex = ref(0)
const shortVideoPlayer = ref<HTMLVideoElement | null>(null)
const isMuted = ref(false)
const isPaused = ref(false)
const isLiked = ref(false)
const hasShortError = ref(false)
const shortProgress = ref(0)

const currentShort = computed(() => shorts.value[currentIndex.value] || null)

const currentVideoUrl = computed(() => {
  if (hasShortError.value) return '/videos/flower.mp4'
  return currentShort.value?.video_url || '/videos/flower.mp4'
})

const onShortTimeUpdate = () => {
  if (!shortVideoPlayer.value || !shortVideoPlayer.value.duration) return
  shortProgress.value = (shortVideoPlayer.value.currentTime / shortVideoPlayer.value.duration) * 100
}

const handleShortVideoError = () => {
  hasShortError.value = true
}

const loadShorts = async () => {
  hasShortError.value = false
  shortProgress.value = 0
  shorts.value = await videoApi.getShorts()
  if (route.params.id) {
    const idx = shorts.value.findIndex((s) => s.id === route.params.id)
    if (idx >= 0) currentIndex.value = idx
  }
  updateLikeState()
}

const updateLikeState = () => {
  if (currentShort.value) {
    isLiked.value = videoApi.isLiked(currentShort.value.id)
  }
}

const togglePlayPause = () => {
  if (!shortVideoPlayer.value) return
  if (shortVideoPlayer.value.paused) {
    shortVideoPlayer.value.play()
    isPaused.value = false
  } else {
    shortVideoPlayer.value.pause()
    isPaused.value = true
  }
}

const toggleMute = () => {
  if (!shortVideoPlayer.value) return
  shortVideoPlayer.value.muted = !shortVideoPlayer.value.muted
  isMuted.value = shortVideoPlayer.value.muted
}

const nextShort = () => {
  if (currentIndex.value < shorts.value.length - 1) {
    currentIndex.value += 1
  } else {
    currentIndex.value = 0
  }
  isPaused.value = false
  updateLikeState()
}

const handleLike = async () => {
  if (!currentShort.value) return
  isLiked.value = await videoApi.toggleLike(currentShort.value.id)
  if (isLiked.value) {
    currentShort.value.likes_count += 1
    toast({ message: 'Umependa Short hii!', color: 'success' })
  } else {
    currentShort.value.likes_count = Math.max(0, currentShort.value.likes_count - 1)
  }
}

const shareShort = () => {
  navigator.clipboard.writeText(window.location.href)
  toast({ message: 'Kiungo cha Short kimewekwa kwenye clipboard!', color: 'success' })
}

onMounted(() => {
  loadShorts()
})
</script>
