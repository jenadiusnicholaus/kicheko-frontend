<template>
  <div class="flex-1 flex flex-col items-center justify-center px-4 py-16 max-w-md mx-auto w-full text-center">
    <div class="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-xl p-8">
      <div
        class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
        :class="
          isSuccess
            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
            : 'bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400'
        "
      >
        <span class="material-icons text-4xl">{{ isSuccess ? 'check_circle' : 'cancel' }}</span>
      </div>

      <h2 class="text-2xl font-black text-gray-900 dark:text-white mb-2">
        {{ isSuccess ? t('taifa.payment.pageSuccessTitle') : t('taifa.payment.pageFailedTitle') }}
      </h2>
      <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
        {{ isSuccess ? t('taifa.payment.pageSuccessDesc') : t('taifa.payment.pageFailedDesc') }}
      </p>

      <div
        v-if="paymentId"
        class="p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl mb-6 text-xs text-gray-500 dark:text-gray-400"
      >
        {{ t('taifa.register.appRef') }}
        <span class="font-mono font-bold text-gray-900 dark:text-white">{{ paymentId }}</span>
      </div>

      <div class="space-y-2.5">
        <RouterLink
          v-if="!isSuccess"
          to="/register-comedian"
          class="block w-full py-3 rounded-xl bg-[#FEBF01] hover:bg-[#E5AC00] text-gray-950 font-black text-sm shadow transition-all"
        >
          {{ t('taifa.payment.tryAgain') }}
        </RouterLink>
        <RouterLink
          to="/"
          class="block w-full py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
        >
          {{ t('taifa.register.returnHome') }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { t } = useI18n()

// PayIt appends payit_payment_id + payit_status to the configured redirect URL.
const isSuccess = computed(() => {
  const status = String(route.query.payit_status || '').toUpperCase()
  if (status) return status === 'SUCCEEDED'
  return route.name === 'payment-success'
})

const paymentId = computed(() => String(route.query.payit_payment_id || ''))

onMounted(() => {
  // The signed webhook links the payment to the application via metadata —
  // nothing to record client-side.
  sessionStorage.removeItem('pending_application_id')
})
</script>
