<template>
  <div class="profile-dropdown-wrapper">
    <VaDropdown v-model="isShown" :offset="[9, 0]" class="profile-dropdown" stick-to-edges>
      <template #anchor>
        <button
          type="button"
          class="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-gray-400/40 focus:outline-none transition-all"
        >
          <div
            class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold text-sm flex items-center justify-center uppercase overflow-hidden"
          >
            <img v-if="user?.avatar" :src="user.avatar" alt="Avatar" class="w-full h-full object-cover" />
            <span v-else>{{ userInitial }}</span>
          </div>
        </button>
      </template>

      <VaDropdownContent
        class="profile-dropdown__content w-60 p-2 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl"
      >
        <!-- User Info Header -->
        <div class="px-3 py-2 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2.5">
          <div
            class="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold text-sm flex items-center justify-center uppercase shrink-0"
          >
            <img v-if="user?.avatar" :src="user.avatar" class="w-full h-full rounded-full object-cover" />
            <span v-else>{{ userInitial }}</span>
          </div>
          <div class="overflow-hidden">
            <p class="font-semibold text-sm text-gray-900 dark:text-white truncate">
              {{ user?.display_name || 'Mtumiaji wa Kicheko' }}
            </p>
            <p class="text-xs text-gray-500 truncate">
              {{ user?.email || user?.username }}
            </p>
          </div>
        </div>

        <!-- Links List -->
        <div class="py-1 text-sm text-gray-700 dark:text-gray-300">
          <RouterLink
            :to="{ name: 'home' }"
            class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            @click="isShown = false"
          >
            <span class="material-icons text-base text-gray-500 dark:text-gray-400">smart_display</span>
            <span>Jukwaa Kuu la Video</span>
          </RouterLink>

          <RouterLink
            :to="{ name: 'admin-dashboard' }"
            class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            @click="isShown = false"
          >
            <span class="material-icons text-base text-gray-500 dark:text-gray-400">dashboard</span>
            <span>Studio ya Kicheko</span>
          </RouterLink>

          <RouterLink
            :to="{ name: 'admin-applications' }"
            class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            @click="isShown = false"
          >
            <span class="material-icons text-base text-gray-500 dark:text-gray-400">how_to_reg</span>
            <span>Maombi ya Wachekeshaji (10k)</span>
          </RouterLink>

          <RouterLink
            :to="{ name: 'preferences' }"
            class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            @click="isShown = false"
          >
            <span class="material-icons text-base text-gray-500 dark:text-gray-400">person</span>
            <span>Wasifu Wangu</span>
          </RouterLink>

          <RouterLink
            :to="{ name: 'settings' }"
            class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            @click="isShown = false"
          >
            <span class="material-icons text-base text-gray-500 dark:text-gray-400">settings</span>
            <span>{{ $t('kicheko.navbar.mySettings') }}</span>
          </RouterLink>
        </div>

        <!-- Logout Action -->
        <div class="pt-1 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors text-left"
            @click="handleLogout"
          >
            <span class="material-icons text-base text-gray-500 dark:text-gray-400">logout</span>
            <span>{{ $t('user.logout') }}</span>
          </button>
        </div>
      </VaDropdownContent>
    </VaDropdown>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vuestic-ui'
import { useAuth } from '../../../../composables/useAuth'

const { t: $t } = useI18n()

const isShown = ref(false)
const router = useRouter()
const { user, logout } = useAuth()
const { init: toast } = useToast()

const userInitial = computed(() => {
  const name = user.value?.display_name || user.value?.username || 'U'
  return name.charAt(0).toUpperCase()
})

const handleLogout = async () => {
  isShown.value = false
  await logout()
  toast({ message: 'Umetoka kwenye akaunti.', color: 'info' })
  router.push({ name: 'login' })
}
</script>

<style lang="scss">
.profile-dropdown {
  cursor: pointer;
}
</style>
