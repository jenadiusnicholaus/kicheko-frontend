<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { PAYIT_STANDALONE_URL, type PayItResult } from '../lib/payit'
import { findPendingPayment, savePendingPayment } from '../lib/pending-payments'
import { useComedianApplicationsStore } from '../stores/comedian-applications'
import PaymentWaitingPanel from './PaymentWaitingPanel.vue'

const props = withDefaults(
  defineProps<{
    open?: boolean
    embedded?: boolean
    slug?: string
    applicationId?: string
    applicantName?: string
    applicantPhone?: string
    applicantUniversity?: string
    amount?: string
    currency?: string
    checkoutUrl?: string
  }>(),
  {
    open: false,
    embedded: false,
    slug: 'taifa-house',
    applicationId: '',
    applicantName: '',
    applicantPhone: '',
    applicantUniversity: '',
    amount: '10,000',
    currency: 'TZS',
    checkoutUrl: PAYIT_STANDALONE_URL,
  },
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success', result: PayItResult): void
}>()

const { t } = useI18n()
const router = useRouter()
const applicationsStore = useComedianApplicationsStore()

const isCheckingStatus = ref(false)
const isInitiating = ref(false)
const paymentInitiated = ref(false)
const paymentId = ref('')
const initiateError = ref('')
const payerPhone = ref('')
let pollingInterval: ReturnType<typeof setInterval> | null = null

function openPayItPopup(): void {
  window.open(props.checkoutUrl, '_blank', 'noopener,noreferrer')
}

async function initiatePayment(): Promise<void> {
  if (!props.applicationId || isInitiating.value) return
  initiateError.value = ''
  isInitiating.value = true
  try {
    const res = await applicationsStore.initiatePayment(props.applicationId, payerPhone.value)
    paymentId.value = res.payment_id
    paymentInitiated.value = true
    savePendingPayment({
      paymentId: res.payment_id,
      purpose: 'application_fee',
      referenceId: props.applicationId,
      label: props.applicantName,
      phone: payerPhone.value,
    })
    startPolling()
  } catch (e: any) {
    initiateError.value = e?.response?.data?.detail || e?.message || t('taifa.payment.initiateError')
  } finally {
    isInitiating.value = false
  }
}

function stopPolling(): void {
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
}

async function checkPaymentStatus(): Promise<boolean> {
  if (!paymentId.value) return false
  isCheckingStatus.value = true
  try {
    const s = await applicationsStore.fetchPaymentStatus(paymentId.value)
    if (s && (s.confirmed || s.payment_status === 'paid')) {
      stopPolling()
      const id = s.payment_reference || paymentId.value
      emit('success', { payment_id: id, status: 'SUCCEEDED' })
      router.push({
        name: 'payment-success',
        query: { payit_payment_id: id, payit_status: 'SUCCEEDED' },
      })
      return true
    }
  } catch {
    /* ignore network error */
  } finally {
    isCheckingStatus.value = false
  }
  return false
}

function startPolling(): void {
  stopPolling()
  pollingInterval = setInterval(async () => {
    if (!props.open && !props.embedded) {
      stopPolling()
      return
    }
    const paid = await checkPaymentStatus()
    if (paid) stopPolling()
  }, 4000)
}

/** Manual check from the waiting panel: verifies the payment and, when it
 * is still unpaid, re-initiates it — pushing a fresh USSD prompt to the
 * payer's phone. */
async function recheckPaymentStatus(): Promise<void> {
  const paid = await checkPaymentStatus()
  if (!paid) await initiatePayment()
}

function cancelWaiting(): void {
  stopPolling()
  paymentInitiated.value = false
}

/** Resumes a stored pending payment: if it already settled, finish;
 * otherwise push a fresh mobile-money prompt and keep waiting. */
async function resumePendingPayment(oldPaymentId: string): Promise<void> {
  const s = await applicationsStore.fetchPaymentStatus(oldPaymentId)
  if (s && (s.confirmed || s.payment_status === 'paid')) {
    stopPolling()
    const id = s.payment_reference || oldPaymentId
    emit('success', { payment_id: id, status: 'SUCCEEDED' })
    router.push({
      name: 'payment-success',
      query: { payit_payment_id: id, payit_status: 'SUCCEEDED' },
    })
    return
  }
  // Push a fresh USSD prompt — the earlier one may have expired on the
  // payer's phone. Initiating stores the new payment_id automatically.
  await initiatePayment()
}

/** Leaves the checkout entirely — the pending payment stays in
 * localStorage so the user can come back and finish it later. */
function payLater(): void {
  stopPolling()
  paymentInitiated.value = false
  close()
}

function close(): void {
  stopPolling()
  emit('close')
}

watch(
  () => props.open || props.embedded,
  (isOpen) => {
    if (isOpen) {
      paymentInitiated.value = false
      paymentId.value = ''
      initiateError.value = ''
      payerPhone.value = props.applicantPhone
      if (!props.embedded) document.body.style.overflow = 'hidden'

      // Resume an unfinished payment stored earlier — checks whether it
      // already settled, otherwise pushes a fresh USSD prompt.
      const pending = props.applicationId ? findPendingPayment('application_fee', props.applicationId) : undefined
      if (pending) {
        payerPhone.value = pending.phone || props.applicantPhone
        resumePendingPayment(pending.paymentId)
      }
    } else {
      document.body.style.overflow = ''
      stopPolling()
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  stopPolling()
})
</script>

<template>
  <Teleport to="body" :disabled="embedded">
    <div
      v-if="open || embedded"
      :class="
        embedded ? '' : 'fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4'
      "
      :role="embedded ? undefined : 'dialog'"
      :aria-modal="embedded ? undefined : 'true'"
      @click.self="!embedded && close()"
    >
      <div
        class="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col"
        :class="embedded ? '' : 'max-w-md max-h-[92vh] animate-fade-in'"
      >
        <!-- Header -->
        <div class="px-6 pt-6 pb-2 flex items-start justify-between gap-4">
          <div>
            <h3 class="text-xl font-black text-gray-900 dark:text-white tracking-tight">
              {{ t('taifa.register.confirmTitle') }}
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ t('taifa.register.confirmFeeDesc') }}
            </p>
          </div>
          <button
            v-if="!embedded"
            type="button"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            :aria-label="t('taifa.register.cancel')"
            @click="close"
          >
            <span class="material-icons text-xl">close</span>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-6 pt-3 pb-6 space-y-5">
          <!-- Application summary -->
          <dl
            class="rounded-2xl border border-gray-200/80 dark:border-zinc-800 bg-gray-50/60 dark:bg-zinc-800/40 divide-y divide-gray-100 dark:divide-zinc-800 overflow-hidden"
          >
            <div class="flex items-center justify-between gap-4 px-4 py-2.5">
              <dt class="text-xs text-gray-400 shrink-0">{{ t('taifa.register.applicant') }}</dt>
              <dd class="text-xs font-bold text-gray-800 dark:text-gray-200 text-right truncate">
                {{ applicantName || '—' }}
              </dd>
            </div>
            <div class="flex items-center justify-between gap-4 px-4 py-2.5">
              <dt class="text-xs text-gray-400 shrink-0">{{ t('taifa.register.phone') }}</dt>
              <dd class="text-xs font-bold text-gray-800 dark:text-gray-200 text-right truncate">
                +255 {{ applicantPhone || '—' }}
              </dd>
            </div>
            <div v-if="applicantUniversity" class="flex items-center justify-between gap-4 px-4 py-2.5">
              <dt class="text-xs text-gray-400 shrink-0">{{ t('taifa.register.university') }}</dt>
              <dd class="text-xs font-bold text-gray-800 dark:text-gray-200 text-right truncate">
                {{ applicantUniversity }}
              </dd>
            </div>
            <div v-if="applicationId" class="flex items-center justify-between gap-4 px-4 py-2.5">
              <dt class="text-xs text-gray-400 shrink-0">Ref</dt>
              <dd class="text-[11px] font-mono font-bold text-gray-400 dark:text-gray-500 text-right truncate">
                {{ applicationId }}
              </dd>
            </div>
            <div class="flex items-center justify-between gap-4 px-4 py-3 bg-white dark:bg-zinc-900">
              <dt class="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {{ t('taifa.register.feeBoxTitle') }}
              </dt>
              <dd class="text-lg font-black text-gray-900 dark:text-white tabular-nums">{{ currency }} {{ amount }}</dd>
            </div>
          </dl>

          <!-- Payer phone + pay action -->
          <template v-if="!paymentInitiated">
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                {{ t('taifa.payment.payerPhoneLabel') }}
              </label>
              <div
                class="flex rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 focus-within:ring-2 focus-within:ring-[#FEBF01] focus-within:border-[#FEBF01] transition-all overflow-hidden"
              >
                <span
                  class="flex items-center gap-1.5 px-2.5 py-3 border-r border-gray-200 dark:border-zinc-700 text-xs font-bold text-gray-700 dark:text-gray-300"
                >
                  <span class="text-base">🇹🇿</span>
                  <span>+255</span>
                </span>
                <input
                  v-model="payerPhone"
                  type="tel"
                  :placeholder="t('taifa.payment.payerPhonePlaceholder')"
                  class="w-full px-3 py-3 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              :disabled="isInitiating"
              class="w-full py-3.5 rounded-2xl bg-[#FEBF01] hover:bg-[#E5AC00] text-gray-950 text-sm font-black flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-60"
              @click="initiatePayment"
            >
              <span v-if="isInitiating" class="material-icons animate-spin text-lg">sync</span>
              <span v-else class="material-icons text-lg">send_to_mobile</span>
              <span>{{ isInitiating ? t('taifa.payment.initiating') : t('taifa.register.payViaPayit') }}</span>
            </button>

            <p v-if="initiateError" class="text-xs font-semibold text-red-600 dark:text-red-400 text-center">
              {{ initiateError }}
            </p>

            <p class="flex items-start gap-1.5 text-[11px] leading-relaxed text-gray-400 dark:text-gray-500">
              <span class="material-icons text-sm shrink-0 mt-px">lock</span>
              <span>{{ t('taifa.payment.instructions') }}</span>
            </p>

            <button
              type="button"
              class="block mx-auto text-[11px] font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline underline-offset-2 transition-colors cursor-pointer"
              @click="openPayItPopup"
            >
              {{ t('taifa.payment.openPayit') }}
            </button>
          </template>
        </div>

        <!-- Footer -->
        <footer
          class="px-6 py-3.5 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/60 dark:bg-zinc-800/40 flex items-center justify-between gap-3 text-[11px] text-gray-400"
        >
          <span class="flex items-center gap-1.5 min-w-0">
            <span class="material-icons text-sm shrink-0">verified_user</span>
            <span class="truncate">{{ t('taifa.payment.secureFooter') }}</span>
          </span>
          <button
            type="button"
            class="shrink-0 font-bold hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer"
            @click="close"
          >
            {{ t('taifa.register.cancel') }}
          </button>
        </footer>
      </div>
    </div>
  </Teleport>

  <!-- Waiting-for-payment modal: shown while polling for the Pay-IT webhook -->
  <Teleport to="body">
    <div
      v-if="paymentInitiated"
      class="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="w-full max-w-sm bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-7 sm:p-8"
      >
        <PaymentWaitingPanel
          :phone="payerPhone"
          :checking="isCheckingStatus"
          @check="recheckPaymentStatus"
          @back="cancelWaiting"
          @cancel="payLater"
        />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
  to {
    opacity: 1;
  }
}
.animate-fade-in {
  animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
