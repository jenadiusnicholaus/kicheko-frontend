<template>
  <VaDropdown :offset="[13, 0]" class="notification-dropdown" stick-to-edges :close-on-content-click="false">
    <template #anchor>
      <button
        type="button"
        class="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors focus:outline-none"
        title="Arifa"
      >
        <span class="material-icons text-[20px] leading-none">notifications</span>
        <span v-if="unreadCount > 0" class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      </button>
    </template>

    <VaDropdownContent
      class="w-80 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden"
    >
      <!-- Header -->
      <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <h3 class="font-semibold text-sm text-gray-900 dark:text-white">Arifa</h3>
        <span class="text-xs text-gray-400">{{ unreadCount }} mpya</span>
      </div>

      <!-- Notification List -->
      <div class="max-h-72 overflow-y-auto">
        <div
          v-for="item in visibleNotifications"
          :key="item.id"
          class="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-50 dark:border-gray-800/50 last:border-0"
        >
          <span class="material-icons text-base text-gray-400 dark:text-gray-500 mt-0.5 shrink-0">{{ item.icon }}</span>
          <div class="flex-1 min-w-0">
            <p class="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{{ item.message }}</p>
            <p class="text-[11px] text-gray-400 mt-0.5">{{ item.updateTimestamp }}</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800">
        <button
          class="w-full text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors text-center font-medium"
          @click="displayAllNotifications = !displayAllNotifications"
        >
          {{ displayAllNotifications ? 'Onyesha chini' : 'Onyesha zote' }}
        </button>
      </div>
    </VaDropdownContent>
  </VaDropdown>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const displayAllNotifications = ref(false)
const baseCount = 4

interface INotification {
  message: string
  icon: string
  id: number
  separator?: boolean
  updateTimestamp: Date
}

const makeDateFromNow = (timeFromNow: number) => {
  const date = new Date()
  date.setTime(date.getTime() + timeFromNow)
  return date
}

const notifications: INotification[] = [
  {
    message: 'Maombi 4 yanangojea ukaguzi wako.',
    icon: 'pending_actions',
    id: 1,
    separator: true,
    updateTimestamp: makeDateFromNow(-3 * 60 * 1000),
  },
  {
    message: 'Ripoti 3 mpya zimepatikana.',
    icon: 'insert_chart',
    id: 2,
    separator: true,
    updateTimestamp: makeDateFromNow(-12 * 60 * 60 * 1000),
  },
  {
    message: 'Video yako imepitishwa na timu.',
    icon: 'check_circle',
    id: 3,
    separator: true,
    updateTimestamp: makeDateFromNow(-2 * 24 * 60 * 60 * 1000),
  },
  {
    message: 'Muda wa majaribio umekwisha. Badilisha mpango wako.',
    icon: 'schedule',
    id: 4,
    updateTimestamp: makeDateFromNow(-2 * 7 * 24 * 60 * 60 * 1000),
  },
  {
    message: 'Wanachama 2 wapya wameongezwa kwenye timu.',
    icon: 'group_add',
    id: 5,
    updateTimestamp: makeDateFromNow(-3 * 60 * 1000),
  },
].sort((a, b) => new Date(b.updateTimestamp).getTime() - new Date(a.updateTimestamp).getTime())

const TIME_NAMES = {
  second: 1000,
  minute: 1000 * 60,
  hour: 1000 * 60 * 60,
  day: 1000 * 60 * 60 * 24,
  week: 1000 * 60 * 60 * 24 * 7,
  month: 1000 * 60 * 60 * 24 * 30,
}

const getRelativeTime = (date: Date) => {
  const diff = new Date().getTime() - new Date(date).getTime()
  for (const [name, ms] of Object.entries(TIME_NAMES).reverse()) {
    if (diff >= ms) {
      const val = Math.round(diff / ms)
      const labels: Record<string, string> = {
        month: `miezi ${val} iliyopita`,
        week: `wiki ${val} iliyopita`,
        day: `siku ${val} iliyopita`,
        hour: `masaa ${val} iliyopita`,
        minute: `dakika ${val} iliyopita`,
        second: `sekunde ${val} iliyopita`,
      }
      return labels[name] ?? `${val} ${name} iliyopita`
    }
  }
  return 'sasa hivi'
}

const visibleNotifications = computed(() => {
  const list = displayAllNotifications.value ? notifications : notifications.slice(0, baseCount)
  return list.map((item) => ({
    ...item,
    updateTimestamp: getRelativeTime(item.updateTimestamp),
  }))
})

const unreadCount = computed(() => notifications.slice(0, baseCount).length)
</script>

<style lang="scss" scoped>
.notification-dropdown {
  cursor: pointer;
}
</style>
