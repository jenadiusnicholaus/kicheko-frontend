<template>
  <VaNavbar
    class="app-layout-navbar py-2 px-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f0f12]"
  >
    <template #left>
      <div class="left flex items-center gap-3">
        <!-- Sidebar Toggle -->
        <button
          type="button"
          class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 focus:outline-none transition-colors"
          aria-label="Badili menyu"
          @click="isSidebarMinimized = !isSidebarMinimized"
        >
          <span class="material-icons text-[22px] leading-none">
            {{ isSidebarMinimized ? 'menu' : 'menu_open' }}
          </span>
        </button>

        <!-- Kicheko Logo -->
        <RouterLink to="/" aria-label="Kicheko - Nyumbani" class="flex items-center">
          <KichekoLogo size="md" />
        </RouterLink>
      </div>
    </template>

    <template #center>
      <!-- Search Bar -->
      <div class="hidden md:flex items-center w-full max-w-md mx-4">
        <form class="flex items-center w-full" @submit.prevent="handleSearch">
          <div class="relative w-full flex items-center">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tafuta video, wasanii..."
              class="w-full pl-4 pr-8 py-1.5 text-sm bg-gray-50 dark:bg-[#18181b] border border-gray-300 dark:border-gray-700 rounded-l-full focus:outline-none focus:border-gray-500 dark:focus:border-gray-500 text-gray-900 dark:text-white transition-all"
            />
            <button
              v-if="searchQuery"
              type="button"
              class="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs"
              @click="searchQuery = ''"
            >
              ✕
            </button>
          </div>
          <button
            type="submit"
            class="px-4 py-1.5 bg-gray-100 dark:bg-[#27272a] hover:bg-gray-200 dark:hover:bg-[#323236] border border-l-0 border-gray-300 dark:border-gray-700 rounded-r-full text-gray-600 dark:text-gray-300 flex items-center justify-center transition-colors"
            title="Tafuta"
          >
            <span class="material-icons text-[18px] leading-none">search</span>
          </button>
        </form>
      </div>
    </template>

    <template #right>
      <AppNavbarActions class="app-navbar__actions" :is-mobile="isMobile" />
    </template>
  </VaNavbar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '../../stores/global-store'
import AppNavbarActions from './components/AppNavbarActions.vue'
import KichekoLogo from '../KichekoLogo.vue'

defineProps({
  isMobile: { type: Boolean, default: false },
})

const router = useRouter()
const GlobalStore = useGlobalStore()
const { isSidebarMinimized } = storeToRefs(GlobalStore)

const searchQuery = ref('')

const handleSearch = () => {
  if (!searchQuery.value.trim()) return
  router.push({ name: 'search', query: { q: searchQuery.value.trim() } })
}
</script>

<style lang="scss" scoped>
.va-navbar {
  z-index: 10;
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.06);

  @media screen and (max-width: 950px) {
    .left {
      width: 100%;
    }

    .app-navbar__actions {
      display: flex;
      justify-content: space-between;
    }
  }
}

.left {
  display: flex;
  align-items: center;
}
</style>
