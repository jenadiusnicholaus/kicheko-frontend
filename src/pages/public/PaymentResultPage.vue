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

      <template v-if="isSuccess && isApplicationPayment">
        <h2 class="text-3xl font-black text-gray-900 dark:text-white mb-3">
          {{ t('taifa.payment.appSuccessTitle') }}
        </h2>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-5">
          {{ t('taifa.payment.appSuccessDesc') }}
        </p>
        <div
          class="flex items-center justify-center gap-2 p-3.5 mb-6 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs font-bold"
        >
          <span class="material-icons text-lg">mail</span>
          {{ t('taifa.payment.appEmailNote') }}
        </div>
      </template>
      <template v-else>
        <h2 class="text-2xl font-black text-gray-900 dark:text-white mb-2">
          {{ isSuccess ? t('taifa.payment.pageSuccessTitle') : t('taifa.payment.pageFailedTitle') }}
        </h2>
        <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
          {{ isSuccess ? t('taifa.payment.pageSuccessDesc') : t('taifa.payment.pageFailedDesc') }}
        </p>
      </template>

      <div
        v-if="paymentId"
        class="p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl mb-6 text-xs text-gray-500 dark:text-gray-400"
      >
        {{ t('taifa.register.appRef') }}
        <span class="font-mono font-bold text-gray-900 dark:text-white">{{ paymentId }}</span>
      </div>

      <div class="space-y-2.5">
        <RouterLink
          v-if="isSuccess && isApplicationPayment"
          to="/auth/login"
          class="block w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base shadow-lg transition-all"
        >
          {{ t('taifa.payment.appLoginCta') }}
        </RouterLink>
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
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { findPendingPayment, getPendingPayment, removePendingPayment } from '../../lib/pending-payments'

const route = useRoute()
const { t } = useI18n()

// PayIt appends payit_payment_id + payit_status to the configured redirect URL.
const isSuccess = computed(() => {
  const status = String(route.query.payit_status || '').toUpperCase()
  if (status) return status === 'SUCCEEDED'
  return route.name === 'payment-success'
})

const paymentId = computed(() => String(route.query.payit_payment_id || ''))
const isApplicationPayment = ref(false)

onMounted(() => {
  // Read the pending record before removing it — its purpose tells us this
  // was the application fee (credentials emailed) vs a vote purchase. The
  // redirect's payment id can be the reference rather than the cs_ id, so
  // also try matching on the stored application id.
  const appId = sessionStorage.getItem('pending_application_id') || undefined
  const pending =
    (paymentId.value ? getPendingPayment(paymentId.value) : undefined) ?? findPendingPayment('application_fee', appId)
  isApplicationPayment.value = pending?.purpose === 'application_fee'
  // The signed webhook links the payment to the application via metadata —
  // nothing to record client-side.
  sessionStorage.removeItem('pending_application_id')
  if (isSuccess.value) {
    sessionStorage.removeItem('kicheko_registration_draft')
    if (paymentId.value) removePendingPayment(paymentId.value)
  }
})
</script>
