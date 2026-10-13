<template>
  <div class="kicheko-logo flex items-center gap-2 select-none" :class="{ 'cursor-pointer': clickable }">
    <!-- Brand Icon -->
    <div
      class="logo-badge flex items-center justify-center rounded-xl bg-gradient-to-tr from-[#E50914] to-[#FF4D4D] text-white shadow-sm"
      :style="{ width: `${badgeSize}px`, height: `${badgeSize}px` }"
    >
      <svg
        :width="iconSize"
        :height="iconSize"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Comedy Play Icon: Play triangle + joyful smile curve -->
        <path d="M9 7.5V16.5L16.5 12L9 7.5Z" />
        <path d="M6 19C8.5 21 15.5 21 18 19" stroke="white" stroke-width="2" stroke-linecap="round" fill="none" />
      </svg>
    </div>

    <!-- Wordmark -->
    <div v-if="!iconOnly" class="flex flex-col leading-none">
      <div class="flex items-center gap-1">
        <span class="font-extrabold tracking-tight text-xl text-gray-900 dark:text-white uppercase font-sans">
          Kicheko
        </span>
        <span
          class="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-100 text-[#E50914] dark:bg-red-950 dark:text-red-400"
        >
          TZ
        </span>
      </div>
      <span v-if="withTagline" class="text-[10px] text-gray-500 font-medium tracking-normal mt-0.5">
        Cheka • Tazama • Piga Kura
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
    iconOnly?: boolean
    withTagline?: boolean
    clickable?: boolean
  }>(),
  {
    size: 'md',
    iconOnly: false,
    withTagline: false,
    clickable: true,
  },
)

const badgeSize = computed(() => {
  if (props.size === 'sm') return 28
  if (props.size === 'lg') return 44
  return 34
})

const iconSize = computed(() => {
  if (props.size === 'sm') return 18
  if (props.size === 'lg') return 28
  return 22
})
</script>

<style scoped>
.kicheko-logo {
  display: inline-flex;
}
.logo-badge {
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(229, 9, 20, 0.25);
}
</style>
