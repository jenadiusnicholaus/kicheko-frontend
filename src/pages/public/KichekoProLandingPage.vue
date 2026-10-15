<template>
  <div class="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 max-w-4xl mx-auto w-full text-center">
    <!-- Brand Logo with Sunburst Effect -->
    <div class="mb-6 sm:mb-8 animate-fade-in">
      <img
        src="/taifa/kicheko_pro_logo.png"
        alt="Kicheko Pro - Jiandae Kucheka"
        class="w-48 sm:w-64 max-w-full mx-auto object-contain drop-shadow-sm hover:scale-102 transition-transform duration-300"
      />
    </div>

    <!-- Main Bold Hero Question matching Page 1 of PDF -->
    <h1
      class="text-3xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-tight max-w-2xl mx-auto mb-8 sm:mb-10"
    >
      {{ t('taifa.home.question') }}
    </h1>

    <!-- Golden "Ndiyo ->" / "Yes ->" CTA Button matching PDF -->
    <div class="mb-10 sm:mb-12">
      <RouterLink
        to="/register-comedian"
        class="inline-flex items-center justify-center gap-3 px-10 sm:px-14 py-4 sm:py-5 rounded-2xl bg-[#FEBF01] hover:bg-[#E5AC00] active:scale-95 text-gray-950 font-black text-xl sm:text-2xl shadow-xl hover:shadow-[#FEBF01]/40 transition-all transform hover:-translate-y-1 cursor-pointer"
      >
        <span>{{ t('taifa.home.yes') }}</span>
        <span class="material-icons text-2xl sm:text-3xl">arrow_forward</span>
      </RouterLink>
      <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-3 font-medium">
        {{ t('taifa.home.feeNote') }}
      </p>
    </div>

    <!-- Quick Highlights Info Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl pt-2">
      <!-- Card 1: Sajili Kipaji Chako -->
      <RouterLink
        to="/register-comedian"
        class="p-5 rounded-2xl bg-white dark:bg-zinc-900/80 border border-gray-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all text-left group hover:border-[#FEBF01]"
      >
        <div
          class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform"
        >
          <span class="material-icons">how_to_reg</span>
        </div>
        <h3 class="text-sm font-black text-gray-900 dark:text-white mb-1">
          {{ t('taifa.home.step1Title') }}
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          {{ t('taifa.home.step1Desc') }}
        </p>
      </RouterLink>

      <!-- Card 2: Nani ni Nani Battles -->
      <RouterLink
        to="/nani-ni-nani"
        class="p-5 rounded-2xl bg-white dark:bg-zinc-900/80 border border-gray-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all text-left group hover:border-[#FEBF01]"
      >
        <div
          class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform"
        >
          <span class="material-icons">sports_kabaddi</span>
        </div>
        <h3 class="text-sm font-black text-gray-900 dark:text-white mb-1">
          {{ t('taifa.home.step2Title') }}
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          {{ t('taifa.home.step2Desc') }}
        </p>
      </RouterLink>

      <!-- Card 3: Wall of Fame -->
      <RouterLink
        to="/wall-of-fame"
        class="p-5 rounded-2xl bg-white dark:bg-zinc-900/80 border border-gray-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all text-left group hover:border-[#FEBF01]"
      >
        <div
          class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform"
        >
          <span class="material-icons">emoji_events</span>
        </div>
        <h3 class="text-sm font-black text-gray-900 dark:text-white mb-1">
          {{ t('taifa.home.step3Title') }}
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          {{ t('taifa.home.step3Desc') }}
        </p>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
