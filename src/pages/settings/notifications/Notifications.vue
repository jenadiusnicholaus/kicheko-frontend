<template>
  <div
    class="flex flex-col p-5 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm"
  >
    <div class="flex items-center gap-2 mb-4">
      <span class="material-icons text-xl text-amber-500 dark:text-amber-400">tune</span>
      <h3 class="text-base font-bold text-gray-900 dark:text-white">Aina za Taarifa Unazopokea</h3>
    </div>
    <div v-for="notification in notifications" :key="notification.name" class="group">
      <div class="flex items-center justify-between py-2.5">
        <span class="text-sm font-medium text-gray-800 dark:text-gray-200">
          {{ notification.name }}
        </span>
        <VaSwitch v-model="notification.isEnabled" size="small" color="primary" />
      </div>
      <div class="border-b border-gray-100 dark:border-gray-800 group-last:border-0" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useNotificationsStore } from '../../../stores/notifications'

const notificationsStore = useNotificationsStore()
const { notifications } = notificationsStore
</script>
