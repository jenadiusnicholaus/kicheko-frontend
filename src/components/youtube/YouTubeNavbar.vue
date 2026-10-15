<template>
  <header
    class="sticky top-0 z-40 bg-white dark:bg-[#0f0f12] border-b border-gray-200 dark:border-gray-800 px-4 h-14 flex items-center justify-between transition-colors"
  >
    <!-- Left: Hamburger & Logo -->
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none transition-colors"
        aria-label="Toggle menu"
        @click="emit('toggleSidebar')"
      >
        <span class="material-icons text-xl leading-none">menu</span>
      </button>

      <RouterLink to="/" class="flex items-center focus:outline-none">
        <KichekoLogo size="md" />
      </RouterLink>
    </div>

    <!-- Center: Search Bar -->
    <div class="flex-1 max-w-xl mx-4 hidden sm:block">
      <form class="flex items-center" @submit.prevent="handleSearch">
        <div class="relative w-full flex items-center">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tafuta video za vichekesho, wasanii, skits..."
            class="w-full pl-4 pr-10 py-1.5 text-sm bg-gray-50 dark:bg-[#18181b] border border-gray-300 dark:border-gray-700 rounded-l-full focus:outline-none focus:border-amber-400 dark:focus:border-amber-400 text-gray-900 dark:text-white transition-all shadow-inner"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm"
            @click="searchQuery = ''"
          >
            ✕
          </button>
        </div>
        <button
          type="submit"
          class="px-5 py-1.5 bg-gray-100 dark:bg-[#27272a] hover:bg-gray-200 dark:hover:bg-[#323236] border border-l-0 border-gray-300 dark:border-gray-700 rounded-r-full text-gray-600 dark:text-gray-300 flex items-center justify-center transition-colors"
          title="Tafuta"
        >
          <span class="material-icons text-lg">search</span>
        </button>
      </form>
    </div>

    <!-- Right: Actions & Profile -->
    <div class="flex items-center gap-2 sm:gap-3">
      <!-- Mobile Search Icon Button -->
      <button
        type="button"
        class="sm:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
        aria-label="Tafuta"
        @click="showMobileSearch = !showMobileSearch"
      >
        <span class="material-icons text-xl">search</span>
      </button>

      <!-- Upload Video Action -->
      <RouterLink
        v-if="authStore.isAdmin"
        :to="{ name: 'admin-videos' }"
        class="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-900 hover:bg-gray-700 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 transition-colors"
      >
        <span class="material-icons text-base">video_call</span>
        <span>Pakia Video</span>
      </RouterLink>

      <!-- Theme Switcher -->
      <button
        type="button"
        class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors"
        :title="isDark ? 'Badili kwenda rangi ya kawaida' : 'Badili kwenda dark mode'"
        @click="toggleTheme"
      >
        <span class="material-icons text-xl">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
      </button>

      <!-- If Logged In -->
      <template v-if="authStore.isAuthenticated">
        <!-- User Avatar & Dropdown -->
        <VaDropdown placement="bottom-end" :offset="[0, 8]">
          <template #anchor>
            <button
              type="button"
              class="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-amber-400/50 focus:outline-none transition-all"
            >
              <div
                class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold text-sm flex items-center justify-center uppercase overflow-hidden"
              >
                <img v-if="userAvatar" :src="userAvatar" alt="Avatar" class="w-full h-full object-cover" />
                <span v-else>{{ userInitial }}</span>
              </div>
            </button>
          </template>

          <VaDropdownContent
            class="w-64 p-2 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl"
          >
            <!-- User Info Header -->
            <div class="px-3 py-2 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2.5">
              <div
                class="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold text-sm flex items-center justify-center uppercase shrink-0"
              >
                <img v-if="userAvatar" :src="userAvatar" class="w-full h-full rounded-full object-cover" />
                <span v-else>{{ userInitial }}</span>
              </div>
              <div class="overflow-hidden">
                <p class="font-semibold text-sm text-gray-900 dark:text-white truncate">
                  {{ authStore.user?.display_name || 'Mtumiaji wa Kicheko' }}
                </p>
                <p class="text-xs text-gray-500 truncate">
                  {{ authStore.user?.email || authStore.user?.username }}
                </p>
              </div>
            </div>

            <!-- Links -->
            <div class="py-1 text-sm text-gray-700 dark:text-gray-300">
              <RouterLink
                :to="{ name: 'library' }"
                class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <span class="material-icons text-base text-gray-500 dark:text-gray-400">video_library</span>
                <span>Maktaba Yangu</span>
              </RouterLink>

              <RouterLink
                v-if="authStore.isAdmin"
                :to="{ name: 'admin-dashboard' }"
                class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <span class="material-icons text-base text-gray-500 dark:text-gray-400">dashboard</span>
                <span>Studio ya Kicheko</span>
              </RouterLink>

              <RouterLink
                v-if="authStore.isAdmin"
                :to="{ name: 'admin-videos' }"
                class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <span class="material-icons text-base text-gray-500 dark:text-gray-400">video_settings</span>
                <span>Simamia &amp; Pakia Video</span>
              </RouterLink>

              <RouterLink
                :to="{ name: 'settings' }"
                class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <span class="material-icons text-base text-gray-500 dark:text-gray-400">settings</span>
                <span>Mipangilio ya Akaunti</span>
              </RouterLink>
            </div>

            <div class="pt-1 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 text-sm font-medium transition-colors text-left"
                @click="handleLogout"
              >
                <span class="material-icons text-lg">logout</span>
                <span>Ondoka (Logout)</span>
              </button>
            </div>
          </VaDropdownContent>
        </VaDropdown>
      </template>

      <!-- If Guest: Login & Register Buttons -->
      <template v-else>
        <RouterLink
          :to="{ name: 'login' }"
          class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700 transition-colors"
        >
          <span class="material-icons text-base">account_circle</span>
          <span>Ingia</span>
        </RouterLink>

        <RouterLink
          :to="{ name: 'signup' }"
          class="hidden sm:inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gray-900 hover:bg-gray-700 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 transition-colors"
        >
          <span>Jisajili</span>
        </RouterLink>
      </template>
    </div>
  </header>

  <!-- Mobile Search Bar (Expandable) -->
  <div
    v-if="showMobileSearch"
    class="sm:hidden px-4 py-2 bg-white dark:bg-[#0f0f12] border-b border-gray-200 dark:border-gray-800"
  >
    <form class="flex items-center gap-2" @submit.prevent="handleSearch">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Tafuta video za vichekesho..."
        class="w-full px-3 py-1.5 text-sm bg-gray-50 dark:bg-[#18181b] border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:border-red-500 text-gray-900 dark:text-white"
        autofocus
      />
      <button type="submit" class="px-3 py-1.5 bg-red-600 text-white rounded-full text-sm font-semibold">Tafuta</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useColors, useToast } from 'vuestic-ui'
import KichekoLogo from '../KichekoLogo.vue'
import { useAuthStore } from '../../stores/auth-store'

const emit = defineEmits<{
  (e: 'toggleSidebar'): void
}>()

const router = useRouter()
const authStore = useAuthStore()
const { init: toast } = useToast()
const { currentPresetName, applyPreset } = useColors()

const searchQuery = ref('')
const showMobileSearch = ref(false)

const THEME_KEY = 'kicheko-theme'

const isDark = computed(() => currentPresetName.value === 'dark')

const applyThemeClass = (dark: boolean) => {
  if (dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const toggleTheme = () => {
  const next = isDark.value ? 'light' : 'dark'
  applyPreset(next)
  localStorage.setItem(THEME_KEY, next)
  applyThemeClass(next === 'dark')
}

const userAvatar = computed(() => {
  return authStore.user?.avatar || null
})

const userInitial = computed(() => {
  const name = authStore.user?.display_name || authStore.user?.username || 'U'
  return name.charAt(0).toUpperCase()
})

const handleSearch = () => {
  if (!searchQuery.value.trim()) return
  router.push({ name: 'search', query: { q: searchQuery.value.trim() } })
  showMobileSearch.value = false
}

const handleLogout = async () => {
  authStore.logout()
  toast({ message: 'Umetoka kwenye akaunti yako salama.', color: 'info' })
  router.push({ name: 'home' })
}
</script>
