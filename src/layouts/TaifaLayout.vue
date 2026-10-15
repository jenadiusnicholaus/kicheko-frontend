<template>
  <div
    class="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1320] text-gray-900 dark:text-gray-100 flex flex-col font-sans select-none relative overflow-x-hidden"
  >
    <!-- Top Header Bar -->
    <header class="w-full bg-[#183153] text-white px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-md z-30">
      <!-- Left: Logo & Back Button -->
      <div class="flex items-center gap-3 sm:gap-4">
        <!-- Taifa House Circular Logo Badge -->
        <RouterLink
          to="/"
          class="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white p-1 flex items-center justify-center shadow hover:scale-105 transition-transform shrink-0"
          title="Kicheko Pro - Taifa House"
        >
          <img src="/taifa/taifa_logo.png" alt="Taifa House" class="w-full h-full object-contain" />
        </RouterLink>

        <!-- Back Button when on subpages -->
        <button
          v-if="route.path !== '/'"
          type="button"
          class="px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors border border-white/20 cursor-pointer"
          @click="goBack"
        >
          <span class="material-icons text-base">arrow_back</span>
          <span>{{ t('taifa.layout.back') }}</span>
        </button>
      </div>

      <!-- Center Badge -->
      <div class="hidden sm:flex items-center gap-2">
        <span
          class="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20"
        >
          Kicheko Pro Live
        </span>
      </div>

      <!-- Right: Language Toggle & User Auth Action -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Language Switcher Button (English / Kiswahili) -->
        <button
          type="button"
          class="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors cursor-pointer border border-white/15"
          :title="locale === 'sw' ? 'Switch to English' : 'Badili kwenda Kiswahili'"
          @click="toggleLanguage"
        >
          <span class="text-sm">{{ locale === 'sw' ? '🇹🇿' : '🇬🇧' }}</span>
          <span class="uppercase tracking-wider text-[11px]">{{ locale === 'sw' ? 'SW' : 'EN' }}</span>
        </button>

        <template v-if="authStore.isAuthenticated">
          <RouterLink
            v-if="authStore.isAdmin"
            to="/admin/dashboard"
            class="px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-gray-950 text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-md transition-all hover:scale-102"
          >
            <span class="material-icons text-base">dashboard</span>
            <span>{{ t('taifa.layout.adminStudio') }}</span>
          </RouterLink>
          <button
            type="button"
            class="px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
            @click="authStore.logout()"
          >
            {{ t('taifa.layout.logout') }}
          </button>
        </template>
        <template v-else>
          <RouterLink
            to="/auth/login"
            class="px-5 py-2 rounded-full bg-white hover:bg-gray-100 text-[#183153] text-xs sm:text-sm font-black flex items-center gap-2 shadow-sm transition-all hover:scale-102"
          >
            <span class="material-icons text-base">person</span>
            <span>{{ t('taifa.layout.login') }}</span>
          </RouterLink>
        </template>
      </div>
    </header>

    <!-- Main Content Area with Background Watermarks -->
    <main class="flex-1 relative flex flex-col justify-between overflow-x-hidden">
      <!-- Watermark Background SVGs matching PDF -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.035] dark:opacity-[0.05] z-0">
        <img
          src="/image/kicheko-icon.png"
          alt=""
          class="absolute -top-10 -left-10 w-72 h-72 object-contain rotate-[-15deg]"
        />
        <img src="/taifa/taifa_icon.png" alt="" class="absolute top-1/4 -right-12 w-64 h-64 object-contain" />
        <img
          src="/image/kicheko-icon.png"
          alt=""
          class="absolute -bottom-10 right-1/4 w-80 h-80 object-contain rotate-[15deg]"
        />
        <img src="/taifa/taifa_icon.png" alt="" class="absolute bottom-1/3 -left-12 w-64 h-64 object-contain" />
      </div>

      <!-- Page Content Slot -->
      <div class="relative z-10 flex-1 flex flex-col">
        <RouterView />
      </div>

      <!-- Bottom Floating Nav Bar & African Pattern (Visible across public screens) -->
      <footer class="relative z-20 w-full pt-6 pb-0 flex flex-col items-center">
        <!-- 3-Pill Bottom Navigation Bar matching PDF -->
        <div class="flex items-center gap-2 sm:gap-3 p-1.5 bg-[#183153] rounded-2xl shadow-xl border border-white/10">
          <RouterLink
            to="/"
            class="px-5 sm:px-8 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black tracking-wide transition-all text-center"
            :class="
              route.path === '/'
                ? 'bg-white text-[#183153] shadow-md scale-102'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            "
          >
            {{ t('taifa.layout.kichekoPro') }}
          </RouterLink>

          <RouterLink
            to="/nani-ni-nani"
            class="px-5 sm:px-8 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black tracking-wide transition-all text-center"
            :class="
              route.path === '/nani-ni-nani'
                ? 'bg-white text-[#183153] shadow-md scale-102'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            "
          >
            {{ t('taifa.layout.naniNiNani') }}
          </RouterLink>

          <RouterLink
            to="/wall-of-fame"
            class="px-5 sm:px-8 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black tracking-wide transition-all text-center"
            :class="
              route.path === '/wall-of-fame'
                ? 'bg-white text-[#183153] shadow-md scale-102'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            "
          >
            {{ t('taifa.layout.wallOfFame') }}
          </RouterLink>
        </div>

        <!-- Tagline: Taifa House Icon + "Yakujivunia ni tele..." -->
        <div class="flex items-center gap-2 mt-3 mb-2.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
          <img src="/taifa/taifa_icon.png" alt="" class="w-4 h-4 object-contain" />
          <span class="italic tracking-wide">{{ t('taifa.layout.tagline') }}</span>
        </div>

        <!-- Authentic African Bottom Ribbon Border -->
        <div
          class="w-full h-5 sm:h-7 bg-repeat-x bg-contain relative shadow-inner"
          style="background-image: url('/taifa/african_ribbon.png')"
        ></div>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth-store'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { t, locale } = useI18n()

const toggleLanguage = () => {
  locale.value = locale.value === 'sw' ? 'gb' : 'sw'
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>
