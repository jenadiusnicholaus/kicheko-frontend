<template>
  <div class="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 max-w-4xl mx-auto w-full text-center">
    <!-- Brand Logo with Sunburst Effect -->
    <div class="mb-6 sm:mb-8 animate-fade-in">
      <img
        src="/taifa/kicheko_pro_logo.png"
        :alt="t('taifa.pages.pro.logoAlt')"
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
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
