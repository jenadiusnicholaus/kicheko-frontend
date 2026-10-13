<template>
  <div class="kicheko-logo inline-flex items-center gap-2 select-none" :class="{ 'cursor-pointer': clickable }">
    <!-- Brand Icon from /image -->
    <div
      class="logo-badge relative flex items-center justify-center shrink-0 transition-transform duration-200"
      :style="{ width: `${badgeSize}px`, height: `${badgeSize}px` }"
    >
      <!-- Light mode emblem -->
      <img
        src="/image/kicheko-icon.png"
        alt="Kicheko"
        class="w-full h-full object-contain block dark:hidden drop-shadow-sm"
      />
      <!-- Dark mode emblem -->
      <img
        src="/image/kicheko-icon-dark.png"
        alt="Kicheko"
        class="w-full h-full object-contain hidden dark:block drop-shadow-sm"
      />
    </div>

    <!-- Wordmark -->
    <div v-if="!iconOnly" class="flex flex-col leading-none">
      <div class="flex items-center gap-1.5">
        <span
          class="font-black tracking-tight text-gray-900 dark:text-white uppercase font-sans"
          :class="textSizeClass"
        >
          Kicheko
        </span>
        <span
          class="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-400 text-gray-950 shadow-sm"
        >
          TZ
        </span>
      </div>
      <span v-if="withTagline" class="text-[11px] text-amber-600 dark:text-amber-400 font-bold tracking-tight mt-0.5">
        Jiandae Kucheka
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg' | 'xl'
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
  if (props.size === 'sm') return 30
  if (props.size === 'lg') return 48
  if (props.size === 'xl') return 64
  return 38
})

const textSizeClass = computed(() => {
  if (props.size === 'sm') return 'text-lg'
  if (props.size === 'lg') return 'text-2xl'
  if (props.size === 'xl') return 'text-3xl'
  return 'text-xl'
})
</script>

<style scoped>
.logo-badge {
  filter: drop-shadow(0 2px 6px rgba(254, 191, 1, 0.25));
}
</style>
