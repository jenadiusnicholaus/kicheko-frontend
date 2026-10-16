<template>
  <div v-if="video" class="max-w-[1700px] mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Video Player & Metadata (2 columns on large screens) -->
      <div class="lg:col-span-2 space-y-4">
        <!-- Professional Video Player -->
        <YouTubePlayer
          :src="video.video_url"
          :poster="video.thumbnail"
          :is-locked="isPaidAndLocked"
          :price-formatted="`Tsh ${video.price_amount.toLocaleString()}`"
          @play="handlePlay"
          @unlock="showCheckoutModal = true"
        />

        <!-- Video Title -->
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <span
              v-if="video.access_type === 'paid'"
              class="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center gap-1 shadow-sm"
            >
              <span class="material-icons text-xs">workspace_premium</span>
              <span>Tsh {{ video.price_amount.toLocaleString() }}</span>
            </span>
            <span
              v-else
              class="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-500/20"
            >
              {{ t('kicheko.home.free') }}
            </span>
            <span
              class="px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            >
              {{ video.category }}
            </span>
          </div>

          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
            {{ video.title }}
          </h1>
        </div>

        <!-- Channel Info & Actions Bar -->
        <div
          class="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-gray-200 dark:border-gray-800"
        >
          <!-- Comedian Channel Bar -->
          <div class="flex items-center gap-3">
            <RouterLink :to="{ name: 'comedian-profile', params: { id: video.comedian_id } }">
              <img
                :src="video.comedian.avatar"
                :alt="video.comedian.stage_name"
                class="w-11 h-11 rounded-full object-cover border border-gray-200 dark:border-gray-700 hover:ring-2 hover:ring-red-500 transition-all"
              />
            </RouterLink>
            <div>
              <RouterLink
                :to="{ name: 'comedian-profile', params: { id: video.comedian_id } }"
                class="font-bold text-sm sm:text-base text-gray-900 dark:text-white hover:text-amber-500 flex items-center gap-1"
              >
                <span>{{ video.comedian.stage_name }}</span>
                <span v-if="video.comedian.verified" class="material-icons text-xs text-blue-500">check_circle</span>
              </RouterLink>
              <p class="text-xs text-gray-500">
                {{ t('taifa.pages.common.followers', { count: formatFollowers(video.comedian.followers_count) }) }}
              </p>
            </div>

            <!-- Follow / Subscribe Button -->
            <button
              type="button"
              class="ml-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
              :class="[
                isFollowed
                  ? 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                  : 'bg-amber-400 hover:bg-amber-500 text-gray-950 font-bold shadow-sm',
              ]"
              @click="toggleFollow"
            >
              {{ isFollowed ? t('taifa.pages.common.following') : t('taifa.pages.common.follow') }}
            </button>
          </div>

          <!-- Video Actions (Like, Share, Download/Library) -->
          <div class="flex items-center gap-2">
            <!-- Like Button -->
            <button
              type="button"
              class="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors border"
              :class="[
                isLiked
                  ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-900/40'
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-transparent',
              ]"
              @click="handleLike"
            >
              <span class="material-icons text-base">{{ isLiked ? 'thumb_up' : 'thumb_up_off_alt' }}</span>
              <span>{{ video.likes_count.toLocaleString() }}</span>
            </button>

            <!-- Share Button -->
            <button
              type="button"
              class="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center gap-1.5 transition-colors"
              @click="copyShareLink"
            >
              <span class="material-icons text-base">share</span>
              <span>{{ t('taifa.pages.watch.share') }}</span>
            </button>

            <!-- Save / Buy Action -->
            <button
              v-if="video.access_type === 'paid' && isPaidAndLocked"
              type="button"
              class="px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-400 hover:bg-amber-500 text-gray-950 shadow-sm flex items-center gap-1.5"
              @click="showCheckoutModal = true"
            >
              <span class="material-icons text-base">shopping_bag</span>
              <span>{{ t('taifa.pages.watch.buy') }}</span>
            </button>
          </div>
        </div>

        <!-- Description Box -->
        <div class="bg-gray-100 dark:bg-[#18181b] rounded-2xl p-4 text-sm text-gray-800 dark:text-gray-200 space-y-2">
          <div class="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400">
            <span>{{ t('taifa.pages.common.views', { count: video.views_count.toLocaleString() }) }}</span>
            <span>•</span>
            <span>{{ new Date(video.published_at).toLocaleDateString('sw-TZ', { dateStyle: 'long' }) }}</span>
            <span>•</span>
            <span class="text-amber-600 dark:text-amber-400 font-semibold"
              >#Kicheko #ComedyTZ #{{ video.category.replace(/\s+/g, '') }}</span
            >
          </div>

          <p class="leading-relaxed whitespace-pre-line text-xs sm:text-sm">
            {{ isDescriptionExpanded ? video.description : truncatedDescription }}
          </p>

          <button
            v-if="video.description.length > 140"
            type="button"
            class="text-xs font-bold text-gray-600 dark:text-gray-300 hover:underline"
            @click="isDescriptionExpanded = !isDescriptionExpanded"
          >
            {{ isDescriptionExpanded ? t('taifa.pages.watch.showLess') : t('taifa.pages.watch.showMore') }}
          </button>
        </div>
      </div>

      <!-- Right Column: Related Videos (YouTube style sidebar) -->
      <div class="space-y-4">
        <h2 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span class="material-icons text-amber-500 text-lg">playlist_play</span>
          <span>{{ t('taifa.pages.watch.upNext') }}</span>
        </h2>

        <div class="space-y-3">
          <RouterLink
            v-for="rel in relatedVideos"
            :key="rel.id"
            :to="{ name: 'watch', params: { id: rel.id } }"
            class="group flex gap-3 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors"
          >
            <!-- Thumbnail -->
            <div
              class="relative w-40 aspect-video rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0"
            >
              <img
                :src="rel.thumbnail"
                :alt="rel.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span
                class="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[10px] text-white font-medium"
              >
                {{ rel.duration_formatted }}
              </span>
              <span
                v-if="rel.access_type === 'paid'"
                class="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-amber-500 text-[9px] text-white font-bold"
              >
                {{ t('taifa.pages.watch.paid') }}
              </span>
            </div>

            <!-- Details -->
            <div class="flex-1 min-w-0">
              <h3
                class="text-xs font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug group-hover:text-amber-500 transition-colors"
              >
                {{ rel.title }}
              </h3>
              <p class="text-[11px] text-gray-500 mt-1 truncate">
                {{ rel.comedian.stage_name }}
              </p>
              <p class="text-[10px] text-gray-400">
                {{ t('taifa.pages.common.views', { count: formatViews(rel.views_count) }) }}
              </p>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- M-Pesa / Tigo Pesa / Airtel Money Checkout Modal -->
    <VaModal v-model="showCheckoutModal" hide-default-actions max-width="500px">
      <div class="p-4 space-y-4">
        <div class="text-center space-y-1">
          <div
            class="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 mx-auto flex items-center justify-center"
          >
            <span class="material-icons text-2xl">account_balance_wallet</span>
          </div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            {{ t('taifa.pages.watch.paymentTitle') }}
          </h3>
          <p class="text-xs text-gray-500">
            {{ t('taifa.pages.watch.buyAccess') }}
            <strong class="text-gray-800 dark:text-gray-200">{{ video.title }}</strong>
          </p>
        </div>

        <div
          class="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/40 flex justify-between items-center text-sm"
        >
          <span class="text-gray-600 dark:text-gray-300">{{ t('taifa.pages.watch.amountDue') }}</span>
          <span class="text-lg font-extrabold text-amber-600 dark:text-amber-400">
            Tsh {{ video.price_amount.toLocaleString() }}
          </span>
        </div>

        <!-- Payment Method Selector -->
        <div class="space-y-2">
          <label class="text-xs font-bold text-gray-700 dark:text-gray-300">
            {{ t('taifa.register.selectPayment') }}
          </label>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="provider in ['M-Pesa', 'Tigo Pesa', 'Airtel Money']"
              :key="provider"
              type="button"
              class="py-2 px-3 text-xs font-bold rounded-lg border text-center transition-all"
              :class="[
                selectedProvider === provider
                  ? 'border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 ring-2 ring-amber-400/20'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
              ]"
              @click="selectedProvider = provider"
            >
              {{ provider }}
            </button>
          </div>
        </div>

        <!-- Mobile Phone Number -->
        <div>
          <label class="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
            {{ t('taifa.pages.watch.phoneLabel') }}
          </label>
          <input
            v-model="phoneInput"
            type="tel"
            :placeholder="t('taifa.pages.watch.phonePlaceholder')"
            class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-amber-400"
          />
        </div>

        <div class="flex gap-2 pt-2">
          <button
            type="button"
            class="flex-1 py-2 rounded-lg text-xs font-semibold border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            @click="showCheckoutModal = false"
          >
            {{ t('vuestic.cancel') }}
          </button>
          <button
            type="button"
            :disabled="isProcessingPayment || !phoneInput.trim()"
            class="flex-1 py-2 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-500 text-gray-950 shadow-md disabled:opacity-50 flex items-center justify-center gap-1.5"
            @click="processPurchase"
          >
            <span v-if="isProcessingPayment" class="material-icons animate-spin text-sm">refresh</span>
            <span>{{ isProcessingPayment ? t('taifa.pages.watch.verifying') : t('taifa.pages.watch.payNow') }}</span>
          </button>
        </div>
      </div>
    </VaModal>
  </div>

  <div v-else class="text-center py-20">
    <span class="material-icons text-5xl text-gray-400 animate-spin">refresh</span>
    <p class="mt-2 text-sm text-gray-500">{{ t('taifa.pages.watch.loading') }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vuestic-ui'
import { videoApi, type Video } from '../../services/api/video.api'
import YouTubePlayer from '../../components/youtube/YouTubePlayer.vue'

const route = useRoute()
const { t } = useI18n()
const { init: toast } = useToast()

const video = ref<Video | null>(null)
const relatedVideos = ref<Video[]>([])
const isLiked = ref(false)
const isFollowed = ref(false)
const isDescriptionExpanded = ref(false)
const isPurchasedLocally = ref(false)

// Checkout Modal State
const showCheckoutModal = ref(false)
const selectedProvider = ref('M-Pesa')
const phoneInput = ref('0755123456')
const isProcessingPayment = ref(false)

const loadVideo = async () => {
  const videoId = String(route.params.id)
  video.value = await videoApi.getVideoById(videoId)
  if (video.value) {
    videoApi.recordView(video.value.id)
    isLiked.value = videoApi.isLiked(video.value.id)
    isPurchasedLocally.value = videoApi.isPurchased(video.value.id)

    // Load related videos
    const all = await videoApi.getVideos()
    relatedVideos.value = all.filter((v) => v.id !== video.value?.id)
  }
}

watch(
  () => route.params.id,
  () => {
    loadVideo()
  },
)

const isPaidAndLocked = computed(() => {
  if (!video.value) return false
  if (video.value.access_type !== 'paid') return false
  return !isPurchasedLocally.value
})

const truncatedDescription = computed(() => {
  if (!video.value) return ''
  if (video.value.description.length <= 140) return video.value.description
  return video.value.description.substring(0, 140) + '...'
})

const handlePlay = () => {
  if (isPaidAndLocked.value) {
    showCheckoutModal.value = true
  }
}

const handleLike = async () => {
  if (!video.value) return
  isLiked.value = await videoApi.toggleLike(video.value.id)
  if (isLiked.value) {
    video.value.likes_count += 1
    toast({ message: t('taifa.pages.watch.likedToast'), color: 'success' })
  } else {
    video.value.likes_count = Math.max(0, video.value.likes_count - 1)
  }
}

const toggleFollow = () => {
  isFollowed.value = !isFollowed.value
  toast({
    message: isFollowed.value
      ? t('taifa.pages.common.followedToast', { name: video.value?.comedian.stage_name })
      : t('taifa.pages.common.unfollowedToast', { name: video.value?.comedian.stage_name }),
    color: 'info',
  })
}

const copyShareLink = () => {
  navigator.clipboard.writeText(window.location.href)
  toast({ message: t('taifa.pages.watch.linkCopied'), color: 'success' })
}

const processPurchase = async () => {
  if (!video.value) return
  isProcessingPayment.value = true
  try {
    const res = await videoApi.purchaseVideo(video.value.id, selectedProvider.value, phoneInput.value)
    isPurchasedLocally.value = true
    showCheckoutModal.value = false
    toast({ message: res.message, color: 'success' })
  } finally {
    isProcessingPayment.value = false
  }
}

const formatFollowers = (count: number): string => {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M'
  if (count >= 1000) return (count / 1000).toFixed(1) + 'K'
  return count.toString()
}

const formatViews = (views: number): string => {
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M'
  if (views >= 1000) return (views / 1000).toFixed(1) + 'K'
  return views.toString()
}

onMounted(() => {
  loadVideo()
})
</script>
