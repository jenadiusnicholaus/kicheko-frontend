<template>
  <div class="space-y-6 max-w-5xl mx-auto">
    <!-- Header -->
    <div class="pb-3 border-b border-gray-200 dark:border-gray-800">
      <h1 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <span class="material-icons text-red-600">search</span>
        <span
          >Matokeo ya utafutaji wa: <span class="text-red-600">"{{ searchQuery }}"</span></span
        >
      </h1>
      <p class="text-xs text-gray-500 mt-1">Video {{ searchResults.length }} zimepatikana</p>
    </div>

    <!-- Search input if user wants to refine -->
    <form class="flex items-center gap-2 max-w-xl" @submit.prevent="updateSearch">
      <input
        v-model="inputQuery"
        type="text"
        placeholder="Tafuta jina la video au msanii..."
        class="w-full px-4 py-2 text-sm bg-gray-50 dark:bg-[#18181b] border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:border-red-500 text-gray-900 dark:text-white"
      />
      <button type="submit" class="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full text-sm">
        Tafuta
      </button>
    </form>

    <!-- Empty State -->
    <div
      v-if="searchResults.length === 0"
      class="text-center py-16 bg-gray-50 dark:bg-[#18181b] rounded-2xl border border-gray-200 dark:border-gray-800 p-8"
    >
      <span class="material-icons text-5xl text-gray-400">search_off</span>
      <h3 class="text-base font-bold text-gray-800 dark:text-gray-200 mt-2">Hakuna matokeo yaliyopatikana</h3>
      <p class="text-xs text-gray-500 mt-1">Jaribu maneno mengine kama "Joti", "Cheka Tu", "Mpoki", au "Skits".</p>
    </div>

    <!-- Results List (YouTube search style row layout) -->
    <div v-else class="space-y-4">
      <RouterLink
        v-for="v in searchResults"
        :key="v.id"
        :to="{ name: 'watch', params: { id: v.id } }"
        class="group flex flex-col sm:flex-row gap-4 p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
      >
        <!-- Thumbnail -->
        <div
          class="relative w-full sm:w-64 aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0"
        >
          <img
            :src="v.thumbnail"
            :alt="v.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span
            class="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-white text-xs font-semibold"
          >
            {{ v.duration_formatted }}
          </span>
          <span
            v-if="v.access_type === 'paid'"
            class="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-amber-500 text-white text-[10px] font-bold"
          >
            Tsh {{ v.price_amount.toLocaleString() }}
          </span>
        </div>

        <!-- Details -->
        <div class="flex-1 space-y-1.5 min-w-0">
          <h2
            class="text-base font-bold text-gray-900 dark:text-white group-hover:text-red-600 transition-colors line-clamp-2"
          >
            {{ v.title }}
          </h2>

          <div class="flex items-center gap-1.5 text-xs text-gray-500">
            <span>{{ v.views_count.toLocaleString() }} views</span>
            <span>•</span>
            <span>{{ new Date(v.published_at).toLocaleDateString('sw-TZ') }}</span>
          </div>

          <!-- Comedian Row -->
          <div class="flex items-center gap-2 py-1">
            <img :src="v.comedian.avatar" :alt="v.comedian.stage_name" class="w-6 h-6 rounded-full object-cover" />
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ v.comedian.stage_name }}</span>
            <span v-if="v.comedian.verified" class="material-icons text-xs text-blue-500">check_circle</span>
          </div>

          <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {{ v.description }}
          </p>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { videoApi, type Video } from '../../services/api/video.api'

const route = useRoute()
const router = useRouter()

const searchResults = ref<Video[]>([])
const inputQuery = ref('')

const searchQuery = computed(() => String(route.query.q || ''))

const performSearch = async () => {
  inputQuery.value = searchQuery.value
  searchResults.value = await videoApi.getVideos({ query: searchQuery.value })
}

const updateSearch = () => {
  if (inputQuery.value.trim()) {
    router.push({ name: 'search', query: { q: inputQuery.value.trim() } })
  }
}

watch(
  () => route.query.q,
  () => {
    performSearch()
  },
)

onMounted(() => {
  performSearch()
})
</script>
