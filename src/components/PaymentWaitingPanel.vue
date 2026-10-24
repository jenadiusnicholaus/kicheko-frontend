<template>
  <div class="text-center">
    <!-- Ring spinner around phone icon -->
    <div class="relative w-20 h-20 mx-auto mb-5">
      <span class="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-zinc-700"></span>
      <span class="absolute inset-0 rounded-full border-4 border-transparent border-t-[#FEBF01] animate-spin"></span>
      <span class="absolute inset-0 flex items-center justify-center">
        <span class="material-icons text-3xl text-gray-700 dark:text-gray-200">smartphone</span>
      </span>
    </div>

    <h3 class="text-lg font-black text-gray-900 dark:text-white tracking-tight">
      {{ t('taifa.register.promptSentTitle') }}
    </h3>
    <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
      {{ t('taifa.register.promptSentDesc', { phone: phone || '…' }) }}
    </p>

    <!-- Progress steps -->
    <div class="mt-6 space-y-3.5 text-left">
      <div class="flex items-center gap-3">
        <span
          class="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm"
        >
          <span class="material-icons text-sm">check</span>
        </span>
        <span class="text-xs font-bold text-gray-800 dark:text-gray-200">
          {{ t('taifa.payment.stepSent') }}
        </span>
      </div>
      <div class="flex items-center gap-3">
        <span class="relative w-6 h-6 rounded-full bg-[#FEBF01]/20 flex items-center justify-center shrink-0">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FEBF01] opacity-50"></span>
          <span class="relative inline-flex w-2.5 h-2.5 rounded-full bg-[#FEBF01]"></span>
        </span>
        <span class="text-xs font-bold text-gray-800 dark:text-gray-200">
          {{ t('taifa.payment.stepApprove') }}
        </span>
      </div>
      <div class="flex items-center gap-3">
        <span class="w-6 h-6 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center shrink-0">
          <span class="material-icons text-sm text-gray-400 dark:text-zinc-500">hourglass_top</span>
        </span>
        <span class="text-xs font-bold text-gray-400 dark:text-zinc-500">
          {{ t('taifa.payment.stepConfirm') }}
        </span>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-7 space-y-3">
      <button
        type="button"
        :disabled="checking"
        class="w-full py-3 rounded-xl bg-[#FEBF01] hover:bg-[#E5AC00] text-gray-950 text-sm font-black flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-60 cursor-pointer"
        @click="$emit('check')"
      >
        <span v-if="checking" class="material-icons animate-spin text-base">sync</span>
        <span>{{ t('taifa.register.checkStatus') }}</span>
      </button>
      <div class="flex items-center justify-between">
        <button
          type="button"
          class="text-[11px] font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline underline-offset-2 transition-colors cursor-pointer"
          @click="$emit('back')"
        >
          {{ t('taifa.payment.notReceived') }}
        </button>
        <button
          type="button"
          class="text-[11px] font-bold text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
          @click="$emit('cancel')"
        >
          {{ t('taifa.payment.payLater') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

withDefaults(defineProps<{ phone?: string; checking?: boolean }>(), {
  phone: '',
  checking: false,
})

defineEmits<{
  (e: 'check'): void
  (e: 'back'): void
  (e: 'cancel'): void
}>()

const { t } = useI18n()
</script>
