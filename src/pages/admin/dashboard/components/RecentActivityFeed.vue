<template>
  <div
    class="p-5 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm flex flex-col justify-between"
  >
    <div>
      <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h2 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="material-icons text-amber-500 text-lg">notifications_active</span>
            <span>Shughuli za Jukwaa (Live Activity)</span>
          </h2>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Matukio na miamala ya hivi punde kwenye Kicheko</p>
        </div>
        <span class="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Moja kwa Moja
        </span>
      </div>

      <!-- Feed List -->
      <div class="space-y-3.5 mt-3">
        <div v-for="item in activities" :key="item.id" class="flex items-start gap-3 text-xs">
          <!-- Icon avatar -->
          <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs" :class="item.bgClass">
            <span class="material-icons text-base" :class="item.iconColor">{{ item.icon }}</span>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-baseline justify-between gap-1">
              <p class="font-bold text-gray-900 dark:text-white truncate">
                {{ item.title }}
              </p>
              <span class="text-[10px] text-gray-400 shrink-0">{{ item.time }}</span>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mt-0.5 line-clamp-2">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Live System Health Footer -->
    <div class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px]">
      <span class="text-gray-500">Hali ya Seva ya Video (Streaming CDN):</span>
      <span class="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        100% Imara (Normal)
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface ActivityItem {
  id: string
  title: string
  description: string
  time: string
  icon: string
  bgClass: string
  iconColor: string
}

const activities = ref<ActivityItem[]>([
  {
    id: 'act1',
    title: 'Malipo ya M-Pesa Yamethibitishwa',
    description: 'Mtumiaji +255 754 *** amekamilisha Tsh 2,500 kwa video "Cheka Tu Live Season 4".',
    time: 'Dakika 3 zilizopita',
    icon: 'check_circle',
    bgClass: 'bg-emerald-100 dark:bg-emerald-950/70',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'act2',
    title: 'Short Mpya Imepakiwa',
    description: 'Joti amechapisha video fupi ya Short: "Ushauri wa Mtaa".',
    time: 'Dakika 18 zilizopita',
    icon: 'bolt',
    bgClass: 'bg-amber-100 dark:bg-amber-950/70',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    id: 'act3',
    title: 'Milestone ya Watazamaji',
    description: 'Video ya "Vituko vya Kariakoo" imevuka watazamaji 850,000 leo!',
    time: 'Saa 1 lililopita',
    icon: 'local_fire_department',
    bgClass: 'bg-rose-100 dark:bg-rose-950/70',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
  {
    id: 'act4',
    title: 'Malipo ya Tigo Pesa Yamethibitishwa',
    description: 'Mtumiaji +255 713 *** amekamilisha Tsh 1,500 kwa video "Harusi ya Shoki".',
    time: 'Saa 2 zilizopita',
    icon: 'payments',
    bgClass: 'bg-sky-100 dark:bg-sky-950/70',
    iconColor: 'text-sky-600 dark:text-sky-400',
  },
  {
    id: 'act5',
    title: 'Mchekeshaji Mpya Amejiunga',
    description: 'Mau Fundi amethibitishwa rasmi na akaunti yake imewashwa kwenye Kicheko.',
    time: 'Saa 4 zilizopita',
    icon: 'verified',
    bgClass: 'bg-indigo-100 dark:bg-indigo-950/70',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
  },
])
</script>
