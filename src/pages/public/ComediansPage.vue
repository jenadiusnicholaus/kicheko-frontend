<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span class="material-icons text-red-600">theater_comedy</span>
          <span>Wasanii wa Kicheko Tanzania</span>
        </h1>
        <p class="text-xs sm:text-sm text-gray-500 mt-1">
          Gundua wachekeshaji maarufu na wanaochipukia, tazama kazi zao na uwafuate.
        </p>
      </div>
    </div>

    <!-- Comedians Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <RouterLink
        v-for="c in comedians"
        :key="c.id"
        :to="{ name: 'comedian-profile', params: { id: c.id } }"
        class="group p-5 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md hover:border-red-500/50 transition-all flex flex-col items-center text-center"
      >
        <div class="relative mb-3">
          <img
            :src="c.avatar"
            :alt="c.stage_name"
            class="w-24 h-24 rounded-full object-cover border-2 border-red-500/50 group-hover:scale-105 transition-transform"
          />
          <span
            v-if="c.verified"
            class="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md"
            title="Verified"
          >
            <span class="material-icons text-xs">check</span>
          </span>
        </div>

        <h3 class="font-bold text-base text-gray-900 dark:text-white group-hover:text-red-600 transition-colors">
          {{ c.stage_name }}
        </h3>
        <p class="text-xs text-gray-400 mt-0.5">{{ c.primary_category }}</p>

        <p class="text-xs text-gray-600 dark:text-gray-300 mt-2 line-clamp-2 leading-relaxed">
          {{ c.bio }}
        </p>

        <div
          class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 w-full flex items-center justify-between text-xs text-gray-500"
        >
          <span>{{ formatFollowers(c.followers_count) }} wafuasi</span>
          <span class="text-red-600 font-semibold group-hover:underline">Tazama kazi &rarr;</span>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { videoApi, type Comedian } from '../../services/api/video.api'

const comedians = ref<Comedian[]>([])

const load = async () => {
  comedians.value = await videoApi.getComedians()
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
