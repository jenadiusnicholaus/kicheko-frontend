<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { PAYIT_STANDALONE_URL, type PayItResult } from '../lib/payit'
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

function cancelWaiting(): void {
  stopPolling()
  paymentInitiated.value = false
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
        :class="embedded ? '' : 'max-w-lg max-h-[92vh] animate-fade-in'"
      >
        <!-- Modal Header -->
        <div class="px-6 pt-5 pb-4 border-b border-gray-100 dark:border-zinc-800 flex items-start justify-between">
          <div>
            <h3 class="text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tight">
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

        <!-- Two-Step Progress Indicator -->
        <div
          class="px-6 py-3 bg-gray-50/70 dark:bg-zinc-800/40 border-b border-gray-100 dark:border-zinc-800 flex items-center gap-3"
        >
          <!-- Step 1: Application (Done) -->
          <div class="flex-1 flex items-center gap-2">
            <span
              class="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-sm"
            >
              ✓
            </span>
            <span class="text-xs font-bold text-gray-700 dark:text-gray-300 truncate">
              {{ t('taifa.register.step1Title') }}
            </span>
          </div>

          <span class="material-icons text-gray-300 dark:text-zinc-600 text-sm">arrow_forward</span>

          <!-- Step 2: Payment -->
          <div class="flex-1 flex items-center gap-2">
            <span
              class="w-6 h-6 rounded-full bg-[#FEBF01] text-gray-950 ring-2 ring-[#FEBF01]/30 flex items-center justify-center text-xs font-bold shadow-sm"
            >
              2
            </span>
            <span class="text-xs font-bold text-gray-900 dark:text-white truncate">
              {{ t('taifa.register.step2Title') }}
            </span>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="flex-1 overflow-y-auto flex flex-col">
          <!-- STEP 2: PAYIT PAYMENT FLOW -->
          <!-- Compact Application Summary -->
          <div class="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/40">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                {{ t('taifa.register.step1Title') }}
              </span>
              <span class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <span class="material-icons text-sm">check_circle</span>
                <span>{{ t('taifa.payment.done') }}</span>
              </span>
            </div>
            <dl class="divide-y divide-gray-100 dark:divide-zinc-800">
              <div class="flex items-center justify-between gap-4 py-2">
                <dt class="text-xs text-gray-400 shrink-0">{{ t('taifa.register.applicant') }}</dt>
                <dd class="text-xs font-bold text-gray-800 dark:text-gray-200 text-right truncate">
                  {{ applicantName || '—' }}
                </dd>
              </div>
              <div class="flex items-center justify-between gap-4 py-2">
                <dt class="text-xs text-gray-400 shrink-0">{{ t('taifa.register.phone') }}</dt>
                <dd class="text-xs font-bold text-gray-800 dark:text-gray-200 text-right truncate">
                  +255 {{ applicantPhone || '—' }}
                </dd>
              </div>
              <div v-if="applicantUniversity" class="flex items-center justify-between gap-4 py-2">
                <dt class="text-xs text-gray-400 shrink-0">{{ t('taifa.register.university') }}</dt>
                <dd class="text-xs font-bold text-gray-800 dark:text-gray-200 text-right truncate">
                  {{ applicantUniversity }}
                </dd>
              </div>
              <div v-if="applicationId" class="flex items-center justify-between gap-4 py-2">
                <dt class="text-xs text-gray-400 shrink-0">Ref</dt>
                <dd class="text-[11px] font-mono font-bold text-gray-500 dark:text-gray-400 text-right truncate">
                  {{ applicationId }}
                </dd>
              </div>
            </dl>
          </div>

          <!-- PayIt Payment Action Box -->
          <div class="p-6 flex flex-col items-center text-center space-y-4">
            <div
              class="w-14 h-14 rounded-2xl bg-[#FEBF01]/20 text-gray-950 dark:text-[#FEBF01] flex items-center justify-center shadow-inner"
            >
              <span class="material-icons text-3xl">payments</span>
            </div>

            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                {{ t('taifa.register.feeBoxTitle') }}
              </span>
              <div class="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                {{ currency }} {{ amount }}
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">
                Lipa ada ya usajili kupitia mfumo salama wa PayIt kwa kutumia simu au kadi.
              </p>
            </div>

            <!-- Primary Action: push the mobile-money prompt to the payer's phone -->
            <div class="w-full space-y-2 pt-1">
              <template v-if="!paymentInitiated">
                <label class="block text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  {{ t('taifa.payment.payerPhoneLabel') }}
                </label>
                <div
                  class="flex rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/60 focus-within:ring-2 focus-within:ring-[#FEBF01] focus-within:border-[#FEBF01] transition-all overflow-hidden"
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

                <button
                  type="button"
                  :disabled="isInitiating"
                  class="w-full py-3.5 rounded-2xl bg-[#FEBF01] hover:bg-[#E5AC00] text-gray-950 text-sm font-black flex items-center justify-center gap-2 shadow-lg hover:shadow-[#FEBF01]/30 transition-all active:scale-98 cursor-pointer disabled:opacity-60"
                  @click="initiatePayment"
                >
                  <span v-if="isInitiating" class="material-icons animate-spin text-lg">sync</span>
                  <span v-else class="material-icons text-lg">send_to_mobile</span>
                  <span>{{ isInitiating ? t('taifa.payment.initiating') : t('taifa.register.payViaPayit') }}</span>
                </button>

                <p v-if="initiateError" class="text-xs font-semibold text-red-600 dark:text-red-400">
                  {{ initiateError }}
                </p>

                <button
                  type="button"
                  class="text-[11px] font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline underline-offset-2 transition-colors cursor-pointer"
                  @click="openPayItPopup"
                >
                  {{ t('taifa.payment.openPayit') }}
                </button>
              </template>
            </div>

            <!-- How it works (shown before the prompt is sent) -->
            <div
              class="w-full p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 text-left flex items-start gap-2.5"
            >
              <span class="material-icons text-base text-amber-500 dark:text-amber-400 shrink-0 mt-px">info</span>
              <p class="text-[11px] text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
                {{ t('taifa.payment.instructions') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Footnote -->
        <footer
          class="px-6 py-3 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/60 dark:bg-zinc-800/40 flex items-center justify-between text-[11px] text-gray-400"
        >
          <span class="flex items-center gap-1">
            <span class="material-icons text-xs">lock</span>
            <span>PayIt Secure Checkout</span>
          </span>
          <button
            type="button"
            class="hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer"
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
          @check="checkPaymentStatus"
          @back="cancelWaiting"
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
