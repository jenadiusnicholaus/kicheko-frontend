<template>
  <div
    class="p-5 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm flex flex-col justify-between"
  >
    <div>
      <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h2 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="material-icons text-amber-500 text-lg">notifications_active</span>
            <span>{{ t('taifa.misc.activity.title') }}</span>
          </h2>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ t('taifa.misc.activity.subtitle') }}</p>
        </div>
        <span class="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          {{ t('taifa.misc.activity.live') }}
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
      <span class="text-gray-500">{{ t('taifa.misc.activity.cdnStatus') }}</span>
      <span class="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        {{ t('taifa.misc.activity.cdnHealthy') }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface ActivityItem {
  id: string
  title: string
  description: string
  time: string
  icon: string
  bgClass: string
  iconColor: string
}

const activities = computed<ActivityItem[]>(() => [
  {
    id: 'act1',
    title: t('taifa.misc.activity.act1Title'),
    description: t('taifa.misc.activity.act1Desc'),
    time: t('taifa.misc.activity.act1Time'),
    icon: 'check_circle',
    bgClass: 'bg-emerald-100 dark:bg-emerald-950/70',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'act2',
    title: t('taifa.misc.activity.act2Title'),
    description: t('taifa.misc.activity.act2Desc'),
    time: t('taifa.misc.activity.act2Time'),
    icon: 'bolt',
    bgClass: 'bg-amber-100 dark:bg-amber-950/70',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    id: 'act3',
    title: t('taifa.misc.activity.act3Title'),
    description: t('taifa.misc.activity.act3Desc'),
    time: t('taifa.misc.activity.act3Time'),
    icon: 'local_fire_department',
    bgClass: 'bg-rose-100 dark:bg-rose-950/70',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
  {
    id: 'act4',
    title: t('taifa.misc.activity.act4Title'),
    description: t('taifa.misc.activity.act4Desc'),
    time: t('taifa.misc.activity.act4Time'),
    icon: 'payments',
    bgClass: 'bg-sky-100 dark:bg-sky-950/70',
    iconColor: 'text-sky-600 dark:text-sky-400',
  },
  {
    id: 'act5',
    title: t('taifa.misc.activity.act5Title'),
    description: t('taifa.misc.activity.act5Desc'),
    time: t('taifa.misc.activity.act5Time'),
    icon: 'verified',
    bgClass: 'bg-indigo-100 dark:bg-indigo-950/70',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
  },
])
</script>
