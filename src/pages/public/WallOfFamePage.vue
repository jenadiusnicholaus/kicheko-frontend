<template>
  <div class="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-10 max-w-6xl mx-auto w-full">
    <!-- Main Showcase Card matching Page 5 of PDF -->
    <div
      v-if="inductee"
      class="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[520px] transition-all"
    >
      <!-- Left Column: Spotlight Photo with Comic Crown & Carousel Controls -->
      <div
        class="lg:col-span-6 relative bg-gradient-to-tr from-slate-900 via-slate-800 to-amber-950 flex items-center justify-center p-6 sm:p-8 min-h-[380px] overflow-hidden group"
      >
        <!-- Spotlight and Stage Light background effects -->
        <div class="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none"></div>
        <div
          class="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-amber-500/20 blur-3xl pointer-events-none"
        ></div>

        <!-- Featured Photo with Crown -->
        <div
          class="relative z-10 w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex items-center justify-center bg-black/40"
        >
          <img
            :src="inductee.photo || '/image/Kicheko.png'"
            :alt="inductee.name"
            class="w-full h-full object-cover object-top transition-all duration-700 hover:scale-105"
          />

          <!-- Hand-drawn Comic Crown on top of head if image isn't the pre-crowned crop -->
          <div
            v-if="inductee.photo && !inductee.photo.includes('spotlight')"
            class="absolute top-4 left-1/2 -translate-x-1/2 text-4xl drop-shadow-lg animate-bounce-subtle pointer-events-none"
          >
            👑
          </div>
        </div>

        <!-- Carousel Left Navigation Arrow -->
        <button
          type="button"
          class="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-gray-900 shadow-xl flex items-center justify-center z-20 transition-all hover:scale-110 active:scale-95 cursor-pointer"
          :title="t('taifa.wall.prev')"
          @click="fameStore.prevInductee()"
        >
          <span class="material-icons text-2xl">chevron_left</span>
        </button>

        <!-- Carousel Right Navigation Arrow -->
        <button
          type="button"
          class="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-gray-900 shadow-xl flex items-center justify-center z-20 transition-all hover:scale-110 active:scale-95 cursor-pointer"
          :title="t('taifa.wall.next')"
          @click="fameStore.nextInductee()"
        >
          <span class="material-icons text-2xl">chevron_right</span>
        </button>

        <!-- Carousel Dot Indicators -->
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          <button
            v-for="(item, idx) in fameStore.inductees"
            :key="item.id"
            type="button"
            class="h-2 rounded-full transition-all cursor-pointer"
            :class="idx === fameStore.selectedIndex ? 'w-6 bg-[#FEBF01]' : 'w-2 bg-white/50 hover:bg-white'"
            @click="fameStore.selectInductee(idx)"
          ></button>
        </div>
      </div>

      <!-- Right Column: Biography & Awards matching PDF -->
      <div class="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between">
        <div>
          <!-- Title with Yellow Brush Background Stroke -->
          <div class="inline-block relative mb-4">
            <span
              class="absolute -inset-x-4 -inset-y-1 bg-[#FEBF01] rounded-xl -rotate-1 skew-x-2 shadow-sm z-0"
            ></span>
            <h1
              class="relative z-10 text-2xl sm:text-4xl font-black text-gray-950 tracking-tight px-3 py-1 flex items-center gap-2"
            >
              <span>{{ t('taifa.wall.title') }}</span>
              <span class="text-xl">👑</span>
            </h1>
          </div>

          <!-- Subtitle matching PDF -->
          <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed mb-6">
            {{ t('taifa.wall.subtitle') }}
          </p>

          <!-- Comedian Name -->
          <h2 class="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            {{ inductee.name }}
          </h2>

          <!-- University Tag -->
          <div
            v-if="inductee.universityCode"
            class="inline-block px-3.5 py-1 rounded-lg bg-[#183153] text-white text-xs font-black tracking-wider uppercase mt-2 mb-4"
          >
            {{ inductee.universityCode }}
          </div>

          <!-- Bio Description -->
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            {{ inductee.bio }}
          </p>

          <!-- Quote Box if available -->
          <div
            v-if="inductee.featuredQuote"
            class="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border-l-4 border-[#FEBF01] text-xs sm:text-sm italic text-gray-700 dark:text-gray-300 mb-6"
          >
            "{{ inductee.featuredQuote }}"
          </div>
        </div>

        <!-- Statistics Badges (Competition Year & Total Votes) matching PDF -->
        <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
          <!-- Competition Year -->
          <div class="flex items-center gap-3.5">
            <div
              class="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0"
            >
              <span class="material-icons text-2xl">emoji_events</span>
            </div>
            <div>
              <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                {{ t('taifa.wall.competitionYear') }}
              </span>
              <span class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                {{ inductee.competitionYear || 2024 }}
              </span>
            </div>
          </div>

          <!-- Total Votes -->
          <div class="flex items-center gap-3.5">
            <div
              class="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0"
            >
              <span class="material-icons text-2xl">star</span>
            </div>
            <div>
              <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                {{ t('taifa.wall.totalVotes') }}
              </span>
              <span class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                {{ (inductee.totalVotes || 0).toLocaleString() }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty or Loading State -->
    <div
      v-else
      class="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-12 text-center shadow-lg"
    >
      <div v-if="fameStore.isLoading" class="flex flex-col items-center justify-center gap-3 py-10">
        <span class="material-icons text-4xl text-amber-500 animate-spin">sync</span>
        <p class="text-sm font-semibold text-gray-500">Inapakia Wall of Fame...</p>
      </div>
      <div v-else class="flex flex-col items-center justify-center gap-3 py-10">
        <span class="material-icons text-5xl text-gray-400">emoji_events</span>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">Hakuna Mabingwa Bado</h3>
        <p class="text-sm text-gray-500">Mabingwa wa Kicheko Pro wataorodheshwa hapa hivi karibuni.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWallOfFameStore } from '../../stores/wall-of-fame'

const { t } = useI18n()
const fameStore = useWallOfFameStore()

onMounted(() => {
  fameStore.fetchInducteesFromBackend()
})

const inductee = computed(() => fameStore.currentInductee)
</script>

<style scoped>
@keyframes bounceSubtle {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
.animate-bounce-subtle {
  animation: bounceSubtle 2.5s infinite ease-in-out;
}
</style>
