<template>
  <div class="space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span class="material-icons text-amber-500">video_call</span>
          <span>{{ t('taifa.admin.videos.title') }}</span>
        </h1>
        <p class="text-xs sm:text-sm text-gray-500 mt-1">
          {{ t('taifa.admin.videos.subtitle') }}
        </p>
      </div>

      <button
        type="button"
        class="px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-500 text-gray-950 font-bold text-sm shadow-md flex items-center gap-2 transition-all self-start sm:self-auto"
        @click="openUploadModal"
      >
        <span class="material-icons text-lg">cloud_upload</span>
        <span>{{ t('taifa.admin.videos.uploadBtn') }}</span>
      </button>
    </div>

    <!-- Stats Summary Row -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div class="p-4 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
        <span class="text-xs text-gray-500 font-medium">{{ t('taifa.admin.videos.statTotal') }}</span>
        <p class="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{{ videos.length }}</p>
      </div>
      <div class="p-4 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
        <span class="text-xs text-gray-500 font-medium">{{ t('taifa.admin.videos.statPaid') }}</span>
        <p class="text-2xl font-extrabold text-amber-500 mt-1">{{ paidCount }}</p>
      </div>
      <div class="p-4 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
        <span class="text-xs text-gray-500 font-medium">{{ t('taifa.admin.videos.statShorts') }}</span>
        <p class="text-2xl font-extrabold text-red-500 mt-1">{{ shortsCount }}</p>
      </div>
      <div class="p-4 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
        <span class="text-xs text-gray-500 font-medium">{{ t('taifa.admin.videos.statViews') }}</span>
        <p class="text-2xl font-extrabold text-emerald-500 mt-1">{{ totalViewsFormatted }}</p>
      </div>
    </div>

    <!-- Video List Table -->
    <div
      class="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm"
    >
      <div class="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <h2 class="font-bold text-base text-gray-900 dark:text-white">
          {{ t('taifa.admin.videos.tableTitle') }}
        </h2>
        <span class="text-xs text-gray-500">{{ t('taifa.admin.videos.videoCount', { count: videos.length }) }}</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-gray-600 dark:text-gray-300">
          <thead
            class="bg-gray-50 dark:bg-gray-800/60 text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wider"
          >
            <tr>
              <th class="py-3 px-4">{{ t('taifa.admin.videos.thVideo') }}</th>
              <th class="py-3 px-4">{{ t('taifa.admin.videos.thArtist') }}</th>
              <th class="py-3 px-4">{{ t('taifa.admin.videos.thCategory') }}</th>
              <th class="py-3 px-4">{{ t('taifa.admin.videos.thAccess') }}</th>
              <th class="py-3 px-4">{{ t('taifa.admin.videos.thViews') }}</th>
              <th class="py-3 px-4 text-right">{{ t('taifa.admin.actionsTh') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="v in videos" :key="v.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
              <!-- Video / Title -->
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <img
                    :src="v.thumbnail"
                    :alt="v.title"
                    class="w-16 h-10 rounded-lg object-cover bg-gray-900 flex-shrink-0"
                  />
                  <div class="min-w-0 max-w-xs">
                    <p class="font-bold text-gray-900 dark:text-white text-xs truncate" :title="v.title">
                      {{ v.title }}
                    </p>
                    <span
                      v-if="v.is_short"
                      class="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold dark:bg-amber-950 dark:text-amber-400"
                    >
                      Short
                    </span>
                    <span v-else class="text-[10px] text-gray-400">
                      {{ t('taifa.admin.videos.durationLabel', { duration: v.duration_formatted }) }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Comedian -->
              <td class="py-3 px-4 text-xs font-semibold text-gray-800 dark:text-gray-200">
                <div class="flex items-center gap-1.5">
                  <img :src="v.comedian.avatar" class="w-5 h-5 rounded-full object-cover" />
                  <span>{{ v.comedian.stage_name }}</span>
                </div>
              </td>

              <!-- Category -->
              <td class="py-3 px-4 text-xs">
                <span
                  class="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium"
                >
                  {{ v.category }}
                </span>
              </td>

              <!-- Access Type -->
              <td class="py-3 px-4 text-xs font-bold">
                <span
                  v-if="v.access_type === 'paid'"
                  class="px-2 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                >
                  {{ t('taifa.admin.videos.paidBadge', { price: v.price_amount.toLocaleString() }) }}
                </span>
                <span
                  v-else
                  class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                >
                  {{ t('kicheko.home.free') }}
                </span>
              </td>

              <!-- Views -->
              <td class="py-3 px-4 text-xs font-medium">
                {{ v.views_count.toLocaleString() }}
              </td>

              <!-- Actions -->
              <td class="py-3 px-4 text-right">
                <RouterLink
                  :to="{ name: v.is_short ? 'short-detail' : 'watch', params: { id: v.id } }"
                  class="text-xs font-bold text-amber-600 hover:text-amber-700 underline"
                  target="_blank"
                >
                  {{ t('taifa.admin.videos.viewLink') }}
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Video Upload Modal (Workflow as defined in docs/youtube_ui.md Phase 5) -->
    <VaModal v-model="showModal" hide-default-actions max-width="650px">
      <div class="p-4 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
          <div class="flex items-center gap-2">
            <span class="material-icons text-amber-500 text-2xl">video_call</span>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">
              {{ t('taifa.admin.videos.modalTitle') }}
            </h3>
          </div>
          <button type="button" class="text-gray-400 hover:text-gray-600 text-lg" @click="showModal = false">✕</button>
        </div>

        <form class="space-y-4" @submit.prevent="submitUpload">
          <!-- Title -->
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              {{ t('taifa.admin.videos.titleLabel') }}
            </label>
            <input
              v-model="form.title"
              type="text"
              required
              :placeholder="t('taifa.admin.videos.titlePlaceholder')"
              class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-red-500"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              {{ t('taifa.admin.videos.descLabel') }}
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              :placeholder="t('taifa.admin.videos.descPlaceholder')"
              class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-red-500"
            />
          </div>

          <!-- Comedian and Category Row -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {{ t('taifa.admin.videos.comedianLabel') }}
              </label>
              <select
                v-model="form.comedian_id"
                required
                class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-red-500"
              >
                <option v-for="c in comedians" :key="c.id" :value="c.id">{{ c.stage_name }} ({{ c.name }})</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {{ t('taifa.admin.videos.categoryLabel') }}
              </label>
              <select
                v-model="form.category"
                required
                class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-red-500"
              >
                <option value="Stand-up Comedy">Stand-up Comedy</option>
                <option value="Skits">Skits</option>
                <option value="Short Comedy">Short Comedy</option>
                <option value="Parody">Parody</option>
                <option value="Vichekesho vya Mitaani">Vichekesho vya Mitaani</option>
              </select>
            </div>
          </div>

          <!-- Access Type & Price -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div>
              <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {{ t('taifa.admin.videos.accessLabel') }}
              </label>
              <div class="flex gap-4 mt-2">
                <label class="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                  <input v-model="form.access_type" type="radio" value="free" />
                  <span>{{ t('taifa.admin.videos.accessFree') }}</span>
                </label>
                <label class="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                  <input v-model="form.access_type" type="radio" value="paid" />
                  <span class="text-amber-600 font-bold">{{ t('taifa.admin.videos.accessPaid') }}</span>
                </label>
              </div>
            </div>

            <div v-if="form.access_type === 'paid'">
              <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {{ t('taifa.admin.videos.priceLabel') }}
              </label>
              <input
                v-model.number="form.price_amount"
                type="number"
                min="500"
                step="500"
                placeholder="2500"
                class="w-full px-3 py-1.5 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <!-- Video File / URL -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {{ t('taifa.admin.videos.videoUrlLabel') }}
              </label>
              <input
                v-model="form.video_url"
                type="url"
                placeholder="https://.../video.mp4"
                class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {{ t('taifa.admin.videos.thumbUrlLabel') }}
              </label>
              <input
                v-model="form.thumbnail_url"
                type="url"
                placeholder="https://images.unsplash.com/..."
                class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <!-- Checkbox: Is Short / Preview -->
          <div class="flex items-center gap-2">
            <input
              id="isShortCheck"
              v-model="form.is_short"
              type="checkbox"
              class="rounded text-amber-500 focus:ring-amber-400"
            />
            <label for="isShortCheck" class="text-xs font-bold text-gray-700 dark:text-gray-300">
              {{ t('taifa.admin.videos.shortLabel') }}
            </label>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              class="flex-1 py-2 text-xs font-bold border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              @click="showModal = false"
            >
              {{ t('taifa.admin.videos.cancelBtn') }}
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex-1 py-2 text-xs font-bold bg-amber-400 hover:bg-amber-500 text-gray-950 rounded-lg shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span v-if="isSubmitting" class="material-icons animate-spin text-sm">refresh</span>
              <span>{{
                isSubmitting ? t('taifa.admin.videos.submittingBtn') : t('taifa.admin.videos.submitBtn')
              }}</span>
            </button>
          </div>
        </form>
      </div>
    </VaModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vuestic-ui'
import { videoApi, type Video, type Comedian, type VideoUploadPayload } from '../../services/api/video.api'

const { t } = useI18n()
const { init: toast } = useToast()

const videos = ref<Video[]>([])
const comedians = ref<Comedian[]>([])
const showModal = ref(false)
const isSubmitting = ref(false)

const form = ref<VideoUploadPayload>({
  title: '',
  description: '',
  comedian_id: '',
  category: 'Stand-up Comedy',
  access_type: 'free',
  price_amount: 2500,
  video_url: '',
  thumbnail_url: '',
  is_short: false,
})

const loadVideos = async () => {
  const [all, shorts, comList] = await Promise.all([
    videoApi.getVideos(),
    videoApi.getShorts(),
    videoApi.getComedians(),
  ])
  videos.value = [...all, ...shorts]
  comedians.value = comList
  if (comList.length > 0 && !form.value.comedian_id) {
    form.value.comedian_id = comList[0].id
  }
}

const paidCount = computed(() => videos.value.filter((v) => v.access_type === 'paid').length)
const shortsCount = computed(() => videos.value.filter((v) => v.is_short).length)

const totalViewsFormatted = computed(() => {
  const total = videos.value.reduce((acc, v) => acc + v.views_count, 0)
  if (total >= 1000000) return (total / 1000000).toFixed(1) + 'M'
  if (total >= 1000) return (total / 1000).toFixed(1) + 'K'
  return total.toString()
})

const openUploadModal = () => {
  form.value = {
    title: '',
    description: '',
    comedian_id: comedians.value[0]?.id || '',
    category: 'Stand-up Comedy',
    access_type: 'free',
    price_amount: 2500,
    video_url: '',
    thumbnail_url: '',
    is_short: false,
  }
  showModal.value = true
}

const submitUpload = async () => {
  if (!form.value.title.trim()) return
  isSubmitting.value = true
  try {
    await videoApi.createVideo(form.value)
    toast({ message: t('taifa.admin.videos.uploadSuccess'), color: 'success' })
    showModal.value = false
    await loadVideos()
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  loadVideos()
})
</script>
