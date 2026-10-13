<template>
  <div
    class="p-5 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm flex flex-col justify-between"
  >
    <div>
      <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h2 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="material-icons text-amber-500 text-lg">theater_comedy</span>
            <span>Wachekeshaji Wanaoongoza</span>
          </h2>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Wasanii nguli wenye ushawishi mkubwa zaidi jukwaani
          </p>
        </div>
        <RouterLink to="/comedians" class="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline">
          Wote &rarr;
        </RouterLink>
      </div>

      <!-- Comedians List -->
      <div class="divide-y divide-gray-100 dark:divide-gray-800/60 mt-2">
        <div v-for="(c, idx) in sortedComedians" :key="c.id" class="py-3 flex items-center justify-between gap-3 group">
          <div class="flex items-center gap-3 min-w-0">
            <span
              class="w-5 h-5 rounded-full flex items-center justify-center font-black text-xs shrink-0"
              :class="[
                idx === 0
                  ? 'bg-amber-400 text-gray-950'
                  : idx === 1
                    ? 'bg-gray-300 text-gray-800'
                    : idx === 2
                      ? 'bg-amber-700/60 text-white'
                      : 'text-gray-400',
              ]"
            >
              {{ idx + 1 }}
            </span>
            <div class="relative shrink-0">
              <img
                :src="c.avatar"
                :alt="c.stage_name"
                class="w-10 h-10 rounded-full object-cover border border-amber-400/40"
              />
              <span
                v-if="c.verified"
                class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px]"
              >
                ✓
              </span>
            </div>
            <div class="min-w-0">
              <p
                class="font-bold text-xs text-gray-900 dark:text-white group-hover:text-amber-500 truncate transition-colors"
              >
                {{ c.stage_name }}
              </p>
              <p class="text-[10px] text-gray-400 truncate">{{ c.primary_category }} • {{ c.name }}</p>
            </div>
          </div>

          <div class="text-right shrink-0">
            <p class="font-black text-xs text-gray-900 dark:text-white">
              {{ formatFollowers(c.followers_count) }}
            </p>
            <p class="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">wafuasi</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Creator Signups CTA -->
    <div class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
      <span class="text-gray-500">Unataka kuongeza msanii mpya?</span>
      <RouterLink :to="{ name: 'admin-videos' }" class="font-bold text-amber-600 dark:text-amber-400 hover:underline">
        Pakia Maudhui Yake
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Comedian } from '../../../../services/api/video.api'

const props = defineProps<{
  comedians: Comedian[]
}>()

const sortedComedians = computed(() => {
  return [...props.comedians].sort((a, b) => b.followers_count - a.followers_count).slice(0, 5)
})

const formatFollowers = (count: number) => {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M'
  if (count >= 1000) return (count / 1000).toFixed(0) + 'K'
  return count.toLocaleString()
}
</script>
