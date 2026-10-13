<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
      <!-- Kicheko Branding -->
      <RouterLink
        to="/"
        class="inline-flex items-center justify-center mb-4 transition-transform hover:scale-105"
        aria-label="Kicheko Home"
      >
        <KichekoLogo size="lg" :with-tagline="true" />
      </RouterLink>
      <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Jukwaa la Video za Vichekesho Tanzania</p>
    </div>

    <!-- Plain, Clean Auth Card Container -->
    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
      <div
        class="bg-white dark:bg-slate-800 py-8 px-6 shadow-sm border border-slate-200 dark:border-slate-700 rounded-2xl sm:px-10"
      >
        <RouterView />
      </div>

      <!-- Quick Footer navigation -->
      <div class="mt-6 text-center">
        <RouterLink
          to="/"
          class="text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 inline-flex items-center gap-1.5 transition-colors"
        >
          <span class="material-icons text-base">arrow_back</span>
          Rudi kwenye video (Back to Videos)
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import KichekoLogo from '../components/KichekoLogo.vue'
</script>

<style scoped>
/* Plain, clean auth styling */
</style>
