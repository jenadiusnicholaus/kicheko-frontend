<template>
  <div
    ref="playerContainer"
    class="relative w-full aspect-video rounded-2xl overflow-hidden bg-black select-none shadow-2xl border border-gray-800/80 group"
    :class="{ 'cursor-none': isPlaying && !showControls && !isLocked }"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    @click="handleContainerClick"
  >
    <!-- HTML5 Video Element -->
    <video
      ref="videoRef"
      :src="currentSource"
      :poster="poster"
      playsinline
      preload="metadata"
      class="w-full h-full object-contain cursor-pointer"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @progress="onProgress"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
      @waiting="isBuffering = true"
      @playing="isBuffering = false"
      @error="handleVideoError"
    />

    <!-- Big Center Play / Pause Indicator (Flash animation on toggle) -->
    <Transition name="fade-scale">
      <div
        v-if="!isPlaying && !isLocked && !isBuffering"
        class="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
      >
        <button
          type="button"
          class="w-20 h-20 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center shadow-2xl backdrop-blur-md transform transition-all duration-200 hover:scale-110 pointer-events-auto"
          aria-label="Play video"
          @click.stop="togglePlay"
        >
          <span class="material-icons text-5xl ml-1">play_arrow</span>
        </button>
      </div>
    </Transition>

    <!-- Buffering Spinner -->
    <div
      v-if="isBuffering && !isLocked"
      class="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
    >
      <div class="w-14 h-14 rounded-full border-4 border-white/20 border-t-red-600 animate-spin" />
    </div>

    <!-- Error Fallback Banner -->
    <div
      v-if="hasErrorRecovered"
      class="absolute top-4 left-4 z-30 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2"
    >
      <span class="material-icons text-sm">info</span>
      <span>Imewekwa video ya mbadala (Backup Stream Active)</span>
    </div>

    <!-- Premium Locked Overlay -->
    <div
      v-if="isLocked"
      class="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white z-20 space-y-4"
    >
      <div
        class="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-2xl animate-pulse"
      >
        <span class="material-icons text-4xl">lock</span>
      </div>
      <div class="space-y-1 max-w-md">
        <h2 class="text-xl sm:text-2xl font-bold tracking-tight">Video Maalum ya Kulipia</h2>
        <p class="text-xs sm:text-sm text-gray-300 leading-relaxed">
          Maudhui haya yanahitaji malipo ya
          <strong class="text-amber-400 font-semibold">{{ priceFormatted }}</strong
          >. Lipia mara moja utazame bila kikomo kupitia M-Pesa au Tigo Pesa.
        </p>
      </div>
      <div class="pt-2 flex flex-wrap gap-3 justify-center">
        <button
          type="button"
          class="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          @click.stop="emit('unlock')"
        >
          <span class="material-icons text-lg">shopping_bag</span>
          <span>Nunua Sasa ({{ priceFormatted }})</span>
        </button>
      </div>
    </div>

    <!-- Custom Player Controls Bar -->
    <div
      v-if="!isLocked"
      class="absolute inset-x-0 bottom-0 z-20 pt-16 pb-2 px-3 sm:px-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-opacity duration-300 flex flex-col justify-end"
      :class="[showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none']"
      @click.stop
    >
      <!-- Interactive Progress / Scrub Bar -->
      <div
        ref="scrubBarRef"
        class="relative w-full h-2 hover:h-3 transition-all cursor-pointer flex items-center py-2"
        @click="handleScrubClick"
        @mousemove="handleScrubHover"
        @mouseleave="scrubHoverTime = null"
      >
        <!-- Hover Timestamp Tooltip -->
        <div
          v-if="scrubHoverTime !== null"
          class="absolute -top-7 px-2 py-0.5 rounded bg-black/90 text-white text-[10px] font-mono transform -translate-x-1/2 pointer-events-none shadow"
          :style="{ left: `${scrubHoverPosition}%` }"
        >
          {{ formatTime(scrubHoverTime) }}
        </div>

        <!-- Track Background -->
        <div class="w-full h-1 group-hover:h-1.5 rounded-full bg-white/30 relative overflow-hidden transition-all">
          <!-- Buffered Track -->
          <div
            class="absolute top-0 bottom-0 left-0 bg-white/40 transition-all duration-200"
            :style="{ width: `${bufferedPercent}%` }"
          />
          <!-- Played Track -->
          <div class="absolute top-0 bottom-0 left-0 bg-red-600" :style="{ width: `${playedPercent}%` }" />
        </div>

        <!-- Scrubber Knob -->
        <div
          class="absolute w-3.5 h-3.5 rounded-full bg-red-600 shadow-md transform -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform pointer-events-none"
          :style="{ left: `${playedPercent}%` }"
        />
      </div>

      <!-- Controls Row -->
      <div class="flex items-center justify-between text-white mt-1 gap-2">
        <!-- Left: Play, Seek, Volume, Time -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Play / Pause -->
          <button
            type="button"
            class="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
            :title="isPlaying ? 'Sitisha (k)' : 'Cheza (k)'"
            @click="togglePlay"
          >
            <span class="material-icons text-2xl leading-none">
              {{ isPlaying ? 'pause' : 'play_arrow' }}
            </span>
          </button>

          <!-- 10s Rewind -->
          <button
            type="button"
            class="hidden sm:inline-flex p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
            title="Rudi nyuma sekunde 10 (j)"
            @click="seekRelative(-10)"
          >
            <span class="material-icons text-xl leading-none">replay_10</span>
          </button>

          <!-- 10s Forward -->
          <button
            type="button"
            class="hidden sm:inline-flex p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
            title="Mbele sekunde 10 (l)"
            @click="seekRelative(10)"
          >
            <span class="material-icons text-xl leading-none">forward_10</span>
          </button>

          <!-- Volume Control -->
          <div class="flex items-center group/vol">
            <button
              type="button"
              class="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
              :title="isMuted ? 'Washa sauti (m)' : 'Zima sauti (m)'"
              @click="toggleMute"
            >
              <span class="material-icons text-xl leading-none">
                {{ volumeIcon }}
              </span>
            </button>
            <input
              v-model="volume"
              type="range"
              min="0"
              max="1"
              step="0.05"
              class="w-0 group-hover/vol:w-16 sm:group-hover/vol:w-20 transition-all duration-200 accent-red-600 h-1 bg-white/40 rounded-full cursor-pointer ml-1"
              @input="onVolumeChange"
            />
          </div>

          <!-- Time Display -->
          <div class="text-xs font-mono text-gray-200 tracking-tight whitespace-nowrap ml-1">
            <span>{{ formatTime(currentTime) }}</span>
            <span class="text-gray-400 mx-1">/</span>
            <span>{{ formatTime(duration) }}</span>
          </div>
        </div>

        <!-- Right: Speed, Quality, Fullscreen -->
        <div class="flex items-center gap-1.5 sm:gap-2">
          <!-- Playback Speed Menu -->
          <div class="relative">
            <button
              type="button"
              class="px-2 py-1 rounded text-xs font-semibold hover:bg-white/20 transition-colors text-gray-200"
              title="Kasi ya video"
              @click="showSpeedMenu = !showSpeedMenu"
            >
              {{ playbackRate }}x
            </button>
            <div
              v-if="showSpeedMenu"
              class="absolute bottom-9 right-0 bg-zinc-900 border border-zinc-700 rounded-xl py-1 w-24 shadow-2xl text-xs z-30"
            >
              <button
                v-for="rate in [0.5, 0.75, 1, 1.25, 1.5, 2]"
                :key="rate"
                type="button"
                class="w-full text-left px-3 py-1.5 hover:bg-zinc-800 transition-colors"
                :class="{ 'text-red-500 font-bold': playbackRate === rate }"
                @click="setPlaybackRate(rate)"
              >
                {{ rate }}x
              </button>
            </div>
          </div>

          <!-- Quality Badge -->
          <span class="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-bold text-gray-300">
            1080p HD
          </span>

          <!-- Fullscreen Toggle -->
          <button
            type="button"
            class="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
            :title="isFullscreen ? 'Toka skrini nzima (f)' : 'Skrini nzima (f)'"
            @click="toggleFullscreen"
          >
            <span class="material-icons text-xl leading-none">
              {{ isFullscreen ? 'fullscreen_exit' : 'fullscreen' }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  src: string
  poster?: string
  isLocked?: boolean
  priceFormatted?: string
}>()

const emit = defineEmits<{
  (e: 'play'): void
  (e: 'pause'): void
  (e: 'ended'): void
  (e: 'unlock'): void
}>()

const playerContainer = ref<HTMLDivElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)
const scrubBarRef = ref<HTMLDivElement | null>(null)

const isPlaying = ref(false)
const isBuffering = ref(false)
const isMuted = ref(false)
const volume = ref(1)
const currentTime = ref(0)
const duration = ref(0)
const bufferedEnd = ref(0)
const isFullscreen = ref(false)
const showControls = ref(true)
const showSpeedMenu = ref(false)
const playbackRate = ref(1)

const scrubHoverTime = ref<number | null>(null)
const scrubHoverPosition = ref(0)
const hasErrorRecovered = ref(false)

// Fallback sources if the primary URL fails or returns 403
const fallbackPool = ['/videos/oceans.mp4', '/videos/flower.mp4']
const currentSource = ref(props.src)

watch(
  () => props.src,
  (newSrc) => {
    currentSource.value = newSrc || '/videos/oceans.mp4'
    hasErrorRecovered.value = false
    currentTime.value = 0
  },
  { immediate: true },
)

const playedPercent = computed(() => {
  if (!duration.value) return 0
  return Math.min(100, Math.max(0, (currentTime.value / duration.value) * 100))
})

const bufferedPercent = computed(() => {
  if (!duration.value) return 0
  return Math.min(100, Math.max(0, (bufferedEnd.value / duration.value) * 100))
})

const volumeIcon = computed(() => {
  if (isMuted.value || volume.value === 0) return 'volume_off'
  if (volume.value < 0.4) return 'volume_mute'
  if (volume.value < 0.75) return 'volume_down'
  return 'volume_up'
})

let controlsTimeout: number | null = null

const resetControlsTimer = () => {
  showControls.value = true
  if (controlsTimeout) clearTimeout(controlsTimeout)
  if (isPlaying.value) {
    controlsTimeout = window.setTimeout(() => {
      showControls.value = false
      showSpeedMenu.value = false
    }, 2800)
  }
}

const handleMouseMove = () => {
  resetControlsTimer()
}

const handleMouseLeave = () => {
  if (isPlaying.value) {
    showControls.value = false
    showSpeedMenu.value = false
  }
}

const handleContainerClick = () => {
  if (!props.isLocked) {
    togglePlay()
  }
}

const togglePlay = () => {
  if (!videoRef.value || props.isLocked) return
  if (videoRef.value.paused) {
    videoRef.value.play().catch(() => {
      // autoplay rejection handled gracefully
    })
  } else {
    videoRef.value.pause()
  }
}

const onPlay = () => {
  isPlaying.value = true
  emit('play')
  resetControlsTimer()
}

const onPause = () => {
  isPlaying.value = false
  showControls.value = true
  emit('pause')
}

const onEnded = () => {
  isPlaying.value = false
  showControls.value = true
  emit('ended')
}

const onTimeUpdate = () => {
  if (!videoRef.value) return
  currentTime.value = videoRef.value.currentTime
}

const onLoadedMetadata = () => {
  if (!videoRef.value) return
  duration.value = videoRef.value.duration || 0
}

const onProgress = () => {
  if (!videoRef.value) return
  const buf = videoRef.value.buffered
  if (buf.length > 0) {
    bufferedEnd.value = buf.end(buf.length - 1)
  }
}

const handleVideoError = () => {
  // If remote URL is broken or 403, switch seamlessly to local backup video
  if (!hasErrorRecovered.value) {
    hasErrorRecovered.value = true
    currentSource.value = fallbackPool[0]
    if (videoRef.value) {
      videoRef.value.load()
      videoRef.value.play().catch(() => {})
    }
  }
}

const seekRelative = (seconds: number) => {
  if (!videoRef.value) return
  videoRef.value.currentTime = Math.max(0, Math.min(duration.value, videoRef.value.currentTime + seconds))
  resetControlsTimer()
}

const handleScrubClick = (e: MouseEvent) => {
  if (!scrubBarRef.value || !videoRef.value || !duration.value) return
  const rect = scrubBarRef.value.getBoundingClientRect()
  const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  videoRef.value.currentTime = pos * duration.value
  resetControlsTimer()
}

const handleScrubHover = (e: MouseEvent) => {
  if (!scrubBarRef.value || !duration.value) return
  const rect = scrubBarRef.value.getBoundingClientRect()
  const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  scrubHoverPosition.value = pos * 100
  scrubHoverTime.value = pos * duration.value
}

const toggleMute = () => {
  if (!videoRef.value) return
  isMuted.value = !isMuted.value
  videoRef.value.muted = isMuted.value
}

const onVolumeChange = () => {
  if (!videoRef.value) return
  videoRef.value.volume = Number(volume.value)
  if (Number(volume.value) > 0 && isMuted.value) {
    isMuted.value = false
    videoRef.value.muted = false
  }
}

const setPlaybackRate = (rate: number) => {
  if (!videoRef.value) return
  playbackRate.value = rate
  videoRef.value.playbackRate = rate
  showSpeedMenu.value = false
  resetControlsTimer()
}

const toggleFullscreen = () => {
  if (!playerContainer.value) return
  if (!document.fullscreenElement) {
    playerContainer.value.requestFullscreen().catch(() => {})
  } else {
    document.exitFullscreen().catch(() => {})
  }
}

const onFullscreenChange = () => {
  isFullscreen.value = Boolean(document.fullscreenElement)
}

const formatTime = (sec: number) => {
  if (!sec || isNaN(sec)) return '0:00'
  const total = Math.floor(sec)
  const m = Math.floor(total / 60)
  const s = total % 60
  const h = Math.floor(m / 60)
  if (h > 0) {
    const remM = m % 60
    return `${h}:${remM < 10 ? '0' : ''}${remM}:${s < 10 ? '0' : ''}${s}`
  }
  return `${m}:${s < 10 ? '0' : ''}${s}`
}

// Keyboard shortcuts
const handleKeyDown = (e: KeyboardEvent) => {
  const target = e.target as HTMLElement
  if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return

  if (e.key === ' ' || e.key.toLowerCase() === 'k') {
    e.preventDefault()
    togglePlay()
  } else if (e.key.toLowerCase() === 'f') {
    e.preventDefault()
    toggleFullscreen()
  } else if (e.key.toLowerCase() === 'm') {
    e.preventDefault()
    toggleMute()
  } else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'j') {
    e.preventDefault()
    seekRelative(-5)
  } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'l') {
    e.preventDefault()
    seekRelative(5)
  }
}

onMounted(() => {
  document.addEventListener('fullscreenchange', onFullscreenChange)
  window.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  window.removeEventListener('keydown', handleKeyDown)
  if (controlsTimeout) clearTimeout(controlsTimeout)
})
</script>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.85);
}
</style>
