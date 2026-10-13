<template>
  <div class="flex flex-col space-y-6 md:space-y-4 max-w-4xl">
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
      Mipangilio ya Mfumo (Settings)
    </h1>

    <!-- Theme Settings Card -->
    <div class="flex flex-col p-5 space-y-4 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
      <div class="flex items-center gap-2">
        <span class="material-icons text-xl text-red-600 dark:text-red-400">palette</span>
        <h3 class="text-base font-bold text-gray-900 dark:text-white">Muonekano (Theme)</h3>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400">
        Chagua muonekano wa giza au mwanga unaopendelea kutumia kwenye jukwaa la Kicheko.
      </p>
      <div class="pt-1">
        <ThemeSwitcher />
      </div>
    </div>

    <!-- General Preferences Card -->
    <div class="flex flex-col p-5 space-y-4 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
      <div class="flex items-center gap-2">
        <span class="material-icons text-xl text-red-600 dark:text-red-400">translate</span>
        <h3 class="text-base font-bold text-gray-900 dark:text-white">Lugha na Mapendeleo (Preferences)</h3>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400">
        Weka lugha kuu ya kutumia kwenye tovuti na taarifa zako.
      </p>
      <div class="pt-1">
        <LanguageSwitcher />
      </div>
    </div>

    <!-- Notification Info Alert -->
    <div class="rounded-2xl p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 flex items-start gap-3">
      <span class="material-icons text-blue-600 dark:text-blue-400 text-2xl mt-0.5">notifications_active</span>
      <div class="flex flex-col space-y-1">
        <p class="text-sm font-bold text-blue-950 dark:text-blue-200">
          Mipangilio ya Taarifa (Notifications)
        </p>
        <p class="text-xs text-blue-800/80 dark:text-blue-300/80">
          Chagua aina za taarifa unazotaka kupokea kuhusu video mpya, maoni na shughuli za akaunti yako.
        </p>
      </div>
    </div>

    <!-- Notification Toggles Card -->
    <Notifications />
  </div>
</template>

<script lang="ts" setup>
import LanguageSwitcher from './language-switcher/LanguageSwitcher.vue'
import ThemeSwitcher from './theme-switcher/ThemeSwitcher.vue'
import Notifications from './notifications/Notifications.vue'
</script>
