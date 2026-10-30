<template>
  <div
    class="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1320] text-gray-900 dark:text-gray-100 flex flex-col font-sans select-none relative overflow-x-hidden"
  >
    <!-- Top Header Bar -->
    <header
      class="w-full bg-[#183153] text-white px-3 sm:px-8 py-3 sm:py-3.5 flex items-center justify-between shadow-md z-30"
    >
      <!-- Left: Logo -->
      <div class="flex items-center gap-3 sm:gap-4">
        <!-- Taifa House Circular Logo Badge -->
        <RouterLink
          to="/"
          class="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow hover:scale-105 transition-transform shrink-0 overflow-hidden"
          title="Kicheko Pro - Taifa House"
        >
          <img src="/taifa/taifa_logo.png" alt="Taifa House" class="w-full h-full object-cover rounded-full" />
        </RouterLink>
      </div>

      <!-- Right: Language Toggle & User Auth Action -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Language Switcher Button (English / Kiswahili) -->
        <button
          type="button"
          class="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors cursor-pointer border border-white/15"
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
            class="px-2.5 sm:px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-gray-950 text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-md transition-all hover:scale-102"
            :title="t('taifa.layout.adminStudio')"
          >
            <span class="material-icons text-base">dashboard</span>
            <span class="hidden sm:inline">{{ t('taifa.layout.adminStudio') }}</span>
          </RouterLink>
          <div class="relative">
            <button
              type="button"
              class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-400 text-gray-950 font-black text-sm flex items-center justify-center overflow-hidden ring-2 ring-white/30 hover:ring-white/60 transition-all cursor-pointer"
              :title="userName"
              :aria-label="userName"
              aria-haspopup="menu"
              :aria-expanded="userMenuOpen"
              @click="userMenuOpen = !userMenuOpen"
            >
              <img
                v-if="avatarUrl && !avatarFailed"
                :src="avatarUrl"
                :alt="userName"
                referrerpolicy="no-referrer"
                class="w-full h-full object-cover"
                @error="avatarFailed = true"
              />
              <span v-else-if="userInitial">{{ userInitial }}</span>
              <span v-else class="material-icons text-xl">person</span>
            </button>

            <div v-if="userMenuOpen" class="fixed inset-0 z-40" @click="userMenuOpen = false"></div>
            <div
              v-if="userMenuOpen"
              role="menu"
              class="absolute right-0 mt-2 w-60 max-w-[85vw] z-50 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <p class="text-sm font-bold text-slate-900 dark:text-white truncate">{{ userName }}</p>
                <p v-if="authStore.user?.email" class="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {{ authStore.user.email }}
                </p>
              </div>
              <button
                type="button"
                role="menuitem"
                class="w-full px-4 py-2.5 flex items-center gap-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                @click="logout"
              >
                <span class="material-icons text-base">logout</span>
                {{ t('taifa.layout.logout') }}
              </button>
            </div>
          </div>
        </template>
        <template v-else>
          <RouterLink
            to="/auth/login"
            class="px-3 sm:px-5 py-2 rounded-full bg-white hover:bg-gray-100 text-[#183153] text-xs sm:text-sm font-black flex items-center gap-1.5 sm:gap-2 shadow-sm transition-all hover:scale-102"
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
      <div
        class="pointer-events-none absolute inset-0 overflow-hidden z-0"
        :class="route.path === '/' ? 'opacity-[0.14] dark:opacity-[0.12]' : 'opacity-[0.06] dark:opacity-[0.07]'"
      >
        <img
          src="/image/kicheko-transparent.png"
          alt=""
          class="absolute -top-6 -left-10 w-64 h-64 sm:w-80 sm:h-80 object-contain rotate-[-15deg]"
        />
        <img src="/taifa/taifa_icon.png" alt="" class="absolute top-1/4 -right-12 w-64 h-64 object-contain" />
        <img
          src="/image/kicheko-transparent.png"
          alt=""
          class="absolute -bottom-6 right-1/4 w-72 h-72 sm:w-96 sm:h-96 object-contain rotate-[15deg]"
        />
        <img src="/taifa/taifa_icon.png" alt="" class="absolute bottom-1/3 -left-12 w-64 h-64 object-contain" />
      </div>

      <!-- Page Content Slot -->
      <div class="relative z-10 flex-1 flex flex-col">
        <RouterView />
      </div>

      <!-- Bottom Floating Nav Bar & African Pattern (Visible across public screens) -->
      <footer class="relative z-20 w-full pt-6 pb-28 sm:pb-16 flex flex-col items-center">
        <!-- 3-Pill Bottom Navigation Bar matching PDF (fixed so it never leaves the viewport) -->
        <div
          class="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 sm:gap-3 p-1 sm:p-1.5 bg-[#183153] rounded-2xl shadow-xl border border-white/10 max-w-[94vw]"
        >
          <RouterLink
            to="/"
            class="px-3 sm:px-8 py-2.5 sm:py-3 rounded-xl text-[11px] sm:text-sm font-black tracking-wide transition-all text-center whitespace-nowrap"
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
            class="px-3 sm:px-8 py-2.5 sm:py-3 rounded-xl text-[11px] sm:text-sm font-black tracking-wide transition-all text-center whitespace-nowrap"
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
            class="px-3 sm:px-8 py-2.5 sm:py-3 rounded-xl text-[11px] sm:text-sm font-black tracking-wide transition-all text-center whitespace-nowrap"
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
      </footer>

      <!-- Authentic African Bottom Ribbon Border (fixed at viewport bottom) -->
      <div
        class="fixed bottom-0 left-0 right-0 z-40 w-full h-5 sm:h-7 bg-repeat-x bg-contain shadow-inner pointer-events-none"
        style="background-image: url('/taifa/african_ribbon.png')"
      ></div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth-store'
import { resolveMediaUrl } from '../services/api/config'

const route = useRoute()
const authStore = useAuthStore()
const { t, locale } = useI18n()

const userMenuOpen = ref(false)
const userName = computed(() => authStore.user?.display_name || authStore.user?.username || '')
const userInitial = computed(() => userName.value.trim().charAt(0).toUpperCase())
const avatarUrl = computed(() => resolveMediaUrl(authStore.user?.avatar))
const avatarFailed = ref(false)
watch(avatarUrl, () => (avatarFailed.value = false))

watch(
  () => route.fullPath,
  () => (userMenuOpen.value = false),
)

const logout = () => {
  userMenuOpen.value = false
  authStore.logout()
}

const toggleLanguage = () => {
  locale.value = locale.value === 'sw' ? 'gb' : 'sw'
}
</script>
