<template>
  <div class="app-navbar-actions flex items-center gap-1.5">
    <!-- Switch to Public Video Platform -->
    <RouterLink
      to="/"
      class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors border border-gray-200 dark:border-gray-700"
      :title="$t('kicheko.navbar.watchPlatform')"
    >
      <span class="material-icons text-base">smart_display</span>
      <span>{{ $t('kicheko.navbar.watchPlatform') }}</span>
    </RouterLink>

    <!-- Quick Upload Video Action -->
    <RouterLink
      :to="{ name: 'admin-videos' }"
      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-900 hover:bg-gray-700 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 transition-colors"
      :title="$t('kicheko.nav.upload')"
    >
      <span class="material-icons text-base">video_call</span>
      <span class="hidden md:inline">{{ $t('kicheko.nav.upload') }}</span>
    </RouterLink>

    <!-- Theme Switcher -->
    <button
      type="button"
      class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors focus:outline-none"
      :title="isDark ? 'Badili kwenda mwanga' : 'Badili kwenda giza'"
      @click="toggleTheme"
    >
      <span class="material-icons text-[20px] leading-none">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
    </button>

    <!-- Notifications Dropdown -->
    <NotificationDropdown class="app-navbar-actions__item" />

    <!-- User Profile Dropdown -->
    <ProfileDropdown class="app-navbar-actions__item app-navbar-actions__item--profile" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useColors } from 'vuestic-ui'
import ProfileDropdown from './dropdowns/ProfileDropdown.vue'
import NotificationDropdown from './dropdowns/NotificationDropdown.vue'

const { t: $t } = useI18n()

defineProps({
  isMobile: { type: Boolean, default: false },
})

const { currentPresetName, applyPreset } = useColors()

const isDark = computed(() => currentPresetName.value === 'dark')

const THEME_KEY = 'kicheko-theme'

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

// On mount, restore saved theme
onMounted(() => {
  const saved = localStorage.getItem(THEME_KEY)
  if (saved === 'dark' || saved === 'light') {
    applyPreset(saved)
    applyThemeClass(saved === 'dark')
  } else {
    // System preference fallback
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) {
      applyPreset('dark')
      applyThemeClass(true)
    }
  }
})
</script>

<style lang="scss">
.app-navbar-actions {
  display: flex;
  align-items: center;

  &__item {
    &--profile {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
