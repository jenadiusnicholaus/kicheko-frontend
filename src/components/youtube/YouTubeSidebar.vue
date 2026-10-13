<template>
  <!-- Mobile Backdrop -->
  <div
    v-if="isMobile && !minimized"
    class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
    @click="emit('closeMobile')"
  />

  <!-- Sidebar Container -->
  <aside
    class="bg-white dark:bg-[#0f0f12] border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-40 flex flex-col justify-between"
    :class="[
      isMobile
        ? ['fixed top-0 bottom-0 left-0 w-64 shadow-2xl', minimized ? '-translate-x-full' : 'translate-x-0']
        : ['sticky top-14 h-[calc(100vh-3.5rem)]', minimized ? 'w-[72px]' : 'w-60'],
    ]"
  >
    <!-- Navigation scroll area -->
    <div class="flex-1 overflow-y-auto py-3 px-2 space-y-4 custom-scrollbar">
      <!-- Mobile Logo Header -->
      <div
        v-if="isMobile"
        class="px-3 pb-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between"
      >
        <KichekoLogo size="sm" />
        <button
          type="button"
          class="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-300 transition-colors"
          @click="emit('closeMobile')"
        >
          <span class="material-icons text-xl">close</span>
        </button>
      </div>

      <!-- Main Navigation Group -->
      <div class="space-y-1">
        <RouterLink
          to="/"
          :class="getItemClass(route.name === 'home' && !route.query.category)"
          :title="minimized ? 'Nyumbani' : undefined"
          @click="handleNavClick"
        >
          <span :class="getIconClass(route.name === 'home' && !route.query.category)">home</span>
          <span v-if="!minimized || isMobile" class="nav-label">Nyumbani</span>
          <span v-else class="mini-label">Nyumbani</span>
        </RouterLink>

        <RouterLink
          :to="{ name: 'shorts' }"
          :class="getItemClass(route.name === 'shorts' || route.name === 'short-detail')"
          :title="minimized ? 'Shorts' : undefined"
          @click="handleNavClick"
        >
          <span :class="getIconClass(route.name === 'shorts' || route.name === 'short-detail')">bolt</span>
          <span v-if="!minimized || isMobile" class="nav-label">Shorts</span>
          <span v-else class="mini-label">Shorts</span>
        </RouterLink>

        <RouterLink
          :to="{ name: 'comedians' }"
          :class="getItemClass(route.name === 'comedians' || route.name === 'comedian-profile')"
          :title="minimized ? 'Wasanii' : undefined"
          @click="handleNavClick"
        >
          <span :class="getIconClass(route.name === 'comedians' || route.name === 'comedian-profile')"
            >theater_comedy</span
          >
          <span v-if="!minimized || isMobile" class="nav-label">Wasanii</span>
          <span v-else class="mini-label">Wasanii</span>
        </RouterLink>

        <RouterLink
          :to="{ name: 'home', query: { category: 'Trending' } }"
          :class="getItemClass(route.query.category === 'Trending')"
          :title="minimized ? 'Inayovuma' : undefined"
          @click="handleNavClick"
        >
          <span :class="getIconClass(route.query.category === 'Trending')">whatshot</span>
          <span v-if="!minimized || isMobile" class="nav-label">Inayovuma</span>
          <span v-else class="mini-label">Trending</span>
        </RouterLink>
      </div>

      <!-- Divider -->
      <hr class="border-gray-200 dark:border-gray-800 my-2" />

      <!-- Library / You Group -->
      <div>
        <div
          v-if="!minimized || isMobile"
          class="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
        >
          Wewe (You)
        </div>
        <div class="space-y-1">
          <RouterLink
            :to="{ name: 'library' }"
            :class="getItemClass(route.name === 'library' && route.query.tab !== 'liked')"
            :title="minimized ? 'Maktaba Yangu' : undefined"
            @click="handleNavClick"
          >
            <span :class="getIconClass(route.name === 'library' && route.query.tab !== 'liked')">video_library</span>
            <span v-if="!minimized || isMobile" class="nav-label">Maktaba Yangu</span>
            <span v-else class="mini-label">Maktaba</span>
          </RouterLink>

          <RouterLink
            :to="{ name: 'library', query: { tab: 'liked' } }"
            :class="getItemClass(route.query.tab === 'liked')"
            :title="minimized ? 'Zilizopendwa' : undefined"
            @click="handleNavClick"
          >
            <span :class="getIconClass(route.query.tab === 'liked')">thumb_up</span>
            <span v-if="!minimized || isMobile" class="nav-label">Zilizopendwa</span>
            <span v-else class="mini-label">Likes</span>
          </RouterLink>
        </div>
      </div>

      <!-- Divider -->
      <hr class="border-gray-200 dark:border-gray-800 my-2" />

      <!-- Studio & Administration Group -->
      <div>
        <div
          v-if="!minimized || isMobile"
          class="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
        >
          Studio ya Wasanii
        </div>
        <div class="space-y-1">
          <RouterLink
            :to="{ name: 'admin-videos' }"
            :class="getItemClass(route.name === 'admin-videos')"
            :title="minimized ? 'Pakia Video' : undefined"
            @click="handleNavClick"
          >
            <span :class="getIconClass(route.name === 'admin-videos')">video_call</span>
            <span v-if="!minimized || isMobile" class="nav-label">Pakia & Simamia</span>
            <span v-else class="mini-label">Pakia</span>
          </RouterLink>

          <RouterLink
            :to="{ name: 'admin-dashboard' }"
            :class="getItemClass(route.name === 'admin-dashboard')"
            :title="minimized ? 'Dashibodi' : undefined"
            @click="handleNavClick"
          >
            <span :class="getIconClass(route.name === 'admin-dashboard')">analytics</span>
            <span v-if="!minimized || isMobile" class="nav-label">Dashibodi (Studio)</span>
            <span v-else class="mini-label">Studio</span>
          </RouterLink>
        </div>
      </div>

      <!-- Creator Promo Banner (Expanded only) -->
      <div
        v-if="(!minimized || isMobile) && !authStore.isAuthenticated"
        class="mt-4 p-3 bg-gray-50 dark:bg-zinc-800/70 rounded-xl border border-gray-200 dark:border-zinc-700 text-xs"
      >
        <p class="font-semibold text-gray-900 dark:text-gray-100 mb-1">Je, wewe ni Mchekeshaji?</p>
        <p class="text-gray-600 dark:text-gray-300 mb-2 leading-relaxed">
          Jiunge na Kicheko, pakia vichekesho vyako na upate mapato ya kazi zako.
        </p>
        <RouterLink
          :to="{ name: 'signup' }"
          class="inline-block px-3 py-1.5 bg-gray-900 hover:bg-gray-700 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-zinc-900 font-semibold rounded-lg text-xs transition-colors"
          @click="handleNavClick"
        >
          Anza Leo
        </RouterLink>
      </div>
    </div>

    <!-- Bottom Footer (Expanded desktop only) -->
    <div
      v-if="!minimized && !isMobile"
      class="p-3 border-t border-gray-200 dark:border-gray-800 text-[11px] text-gray-500 dark:text-gray-400 space-y-1"
    >
      <div class="flex flex-wrap gap-x-2 gap-y-0.5">
        <RouterLink to="/faq" class="hover:text-gray-900 dark:hover:text-gray-100 hover:underline"
          >Kuhusu Sisi</RouterLink
        >
        <RouterLink to="/faq" class="hover:text-gray-900 dark:hover:text-gray-100 hover:underline">Vigezo</RouterLink>
        <RouterLink to="/faq" class="hover:text-gray-900 dark:hover:text-gray-100 hover:underline">Faragha</RouterLink>
      </div>
      <p class="text-gray-400 dark:text-gray-500">© 2026 Kicheko Entertainment</p>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import KichekoLogo from '../KichekoLogo.vue'
import { useAuthStore } from '../../stores/auth-store'

const props = defineProps<{
  minimized: boolean
  isMobile: boolean
}>()

const emit = defineEmits<{
  (e: 'closeMobile'): void
}>()

const route = useRoute()
const authStore = useAuthStore()

const handleNavClick = () => {
  if (props.isMobile) {
    emit('closeMobile')
  }
}

const getItemClass = (isActive: boolean) => [
  'group flex items-center rounded-xl text-sm transition-all duration-150 select-none cursor-pointer',
  props.minimized && !props.isMobile
    ? 'flex-col gap-1 px-1 py-2.5 justify-center items-center text-center'
    : 'flex-row gap-4 px-3 py-2.5',
  isActive
    ? 'bg-red-50 text-red-600 font-semibold dark:bg-zinc-800 dark:text-white'
    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white font-medium',
]

const getIconClass = (isActive: boolean) => [
  'material-icons text-xl leading-none transition-colors',
  isActive
    ? 'text-red-600 dark:text-red-400'
    : 'text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white',
]
</script>

<style scoped>
.mini-label {
  font-size: 0.625rem;
  line-height: 0.75rem;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
}

.nav-label {
  line-height: 1.25rem;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 4px;
}
</style>
