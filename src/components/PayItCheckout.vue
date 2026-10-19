<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { PAYIT_STANDALONE_URL, type PayItResult } from '../lib/payit'
import { useComedianApplicationsStore } from '../stores/comedian-applications'

const props = withDefaults(
  defineProps<{
    open: boolean
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

type Step = 'payment' | 'success'
const currentStep = ref<Step>('payment')
const isCheckingStatus = ref(false)
const hasOpenedCheckout = ref(false)
let pollingInterval: ReturnType<typeof setInterval> | null = null

function stopPolling(): void {
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
}

async function checkPaymentStatus(): Promise<boolean> {
  if (!props.applicationId) return false
  isCheckingStatus.value = true
  try {
    const isPaid = await applicationsStore.waitForPaymentConfirmation(props.applicationId, {
      intervalMs: 1500,
      timeoutMs: 5000,
    })
    if (isPaid) {
      stopPolling()
      currentStep.value = 'success'
      emit('success', {
        payment_id: props.applicationId,
        status: 'SUCCEEDED',
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
    if (currentStep.value !== 'payment' || !props.open) {
      stopPolling()
      return
    }
    const paid = await checkPaymentStatus()
    if (paid) stopPolling()
  }, 4000)
}

function openPayItCheckout(): void {
  hasOpenedCheckout.value = true
  try {
    sessionStorage.setItem('pending_application_id', props.applicationId)
  } catch {
    /* ignore */
  }
  window.open(props.checkoutUrl, '_blank', 'noopener,noreferrer')
  startPolling()
}

function payInSameTab(): void {
  try {
    sessionStorage.setItem('pending_application_id', props.applicationId)
  } catch {
    /* ignore */
  }
  window.location.assign(props.checkoutUrl)
}

function close(): void {
  stopPolling()
  emit('close')
}

function goToNani(): void {
  close()
  router.push('/nani-ni-nani')
}

function goHome(): void {
  close()
  router.push('/')
}

const displayAmount = computed(() => `${props.currency} ${props.amount}`)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      currentStep.value = 'payment'
      hasOpenedCheckout.value = false
      document.body.style.overflow = 'hidden'
      startPolling()
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
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      @click.self="close"
    >
      <div
        class="w-full max-w-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh] animate-fade-in"
      >
        <!-- Modal Header -->
        <div class="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-zinc-800 flex items-start justify-between">
          <div>
            <h3 class="text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tight">
              {{ currentStep === 'success' ? t('taifa.register.successTitle') : t('taifa.register.confirmTitle') }}
            </h3>
            <p v-if="currentStep !== 'success'" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ t('taifa.register.confirmFeeDesc') }}
            </p>
          </div>
          <button
            type="button"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            :aria-label="t('taifa.register.cancel')"
            @click="close"
          >
            <span class="material-icons text-xl">close</span>
          </button>
        </div>

        <!-- Two-Step Progress Pill Indicator -->
        <div
          class="px-6 py-3 bg-gray-50/70 dark:bg-zinc-800/40 border-b border-gray-100 dark:border-zinc-800 flex items-center gap-3"
        >
          <!-- Step 1: Application -->
          <div class="flex-1 flex items-center gap-2">
            <span
              class="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold"
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
              class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              :class="
                currentStep === 'success'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#FEBF01] text-gray-950 ring-2 ring-[#FEBF01]/30'
              "
            >
              {{ currentStep === 'success' ? '✓' : '2' }}
            </span>
            <span
              class="text-xs font-bold truncate"
              :class="currentStep === 'success' ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'"
            >
              {{ t('taifa.register.step2Title') }}
            </span>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="p-6 overflow-y-auto flex-1 space-y-5">
          <!-- SUCCESS STATE -->
          <div v-if="currentStep === 'success'" class="text-center py-4 space-y-4">
            <div
              class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center mx-auto text-3xl font-black shadow-inner"
            >
              ✓
            </div>
            <div>
              <h4 class="text-xl font-black text-gray-900 dark:text-white">
                {{ t('taifa.register.successTitle') }}
              </h4>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto leading-relaxed">
                {{ t('taifa.register.successDesc') }}
              </p>
            </div>

            <!-- Application Reference ID -->
            <div
              v-if="applicationId"
              class="p-3 bg-gray-50 dark:bg-zinc-800 rounded-2xl text-xs text-gray-500 dark:text-gray-400 inline-block px-5"
            >
              {{ t('taifa.register.appRef') }}
              <span class="font-mono font-bold text-gray-900 dark:text-white ml-1">{{ applicationId }}</span>
            </div>

            <div class="space-y-2.5 pt-2">
              <button
                type="button"
                class="w-full py-3.5 rounded-xl bg-[#FEBF01] hover:bg-[#E5AC00] text-gray-950 font-black text-sm shadow transition-all cursor-pointer"
                @click="goToNani"
              >
                {{ t('taifa.register.viewNani') }}
              </button>
              <button
                type="button"
                class="w-full py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                @click="goHome"
              >
                {{ t('taifa.register.returnHome') }}
              </button>
            </div>
          </div>

          <!-- PAYMENT STEP (STEP 1 SUMMARY + STEP 2 PAYMENT) -->
          <template v-else>
            <!-- Step 1 Summary Card -->
            <div class="bg-gray-50 dark:bg-zinc-800/60 rounded-2xl p-4 border border-gray-100 dark:border-zinc-800">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  {{ t('taifa.register.step1Title') }}
                </span>
                <span
                  class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400"
                >
                  <span class="material-icons text-sm">check_circle</span>
                  <span>Tayari</span>
                </span>
              </div>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span class="text-gray-400 block">{{ t('taifa.register.applicant') }}:</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200">{{ applicantName || '—' }}</span>
                </div>
                <div>
                  <span class="text-gray-400 block">{{ t('taifa.register.phone') }}:</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200">+255 {{ applicantPhone || '—' }}</span>
                </div>
                <div
                  v-if="applicantUniversity"
                  class="col-span-2 pt-1 border-t border-gray-200/50 dark:border-zinc-700/50"
                >
                  <span class="text-gray-400 block">{{ t('taifa.register.university') }}:</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200">{{ applicantUniversity }}</span>
                </div>
                <div v-if="applicationId" class="col-span-2 text-[11px] font-mono text-gray-400">
                  Ref: <span class="font-bold text-gray-700 dark:text-gray-300">{{ applicationId }}</span>
                </div>
              </div>
            </div>

            <!-- Step 2 Payment Box -->
            <div
              class="border-2 border-[#FEBF01]/40 bg-[#FEBF01]/5 dark:bg-[#FEBF01]/10 rounded-2xl p-5 text-center relative"
            >
              <span class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-1">
                {{ t('taifa.register.feeBoxTitle') }}
              </span>
              <div class="text-3xl sm:text-4xl font-black text-gray-950 dark:text-white tracking-tight">
                {{ displayAmount }}
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ t('taifa.register.paymentProvider') }}
              </p>

              <!-- Supported Networks Badge Pills -->
              <div
                class="flex items-center justify-center gap-1.5 flex-wrap mt-3 pt-3 border-t border-gray-200/60 dark:border-zinc-700/60"
              >
                <span
                  class="px-2 py-0.5 rounded-md bg-white dark:bg-zinc-800 text-[10px] font-black text-red-600 border border-red-200 dark:border-red-900/40"
                >
                  M-Pesa
                </span>
                <span
                  class="px-2 py-0.5 rounded-md bg-white dark:bg-zinc-800 text-[10px] font-black text-blue-600 border border-blue-200 dark:border-blue-900/40"
                >
                  Mixx by Yas
                </span>
                <span
                  class="px-2 py-0.5 rounded-md bg-white dark:bg-zinc-800 text-[10px] font-black text-red-700 border border-red-200 dark:border-red-900/40"
                >
                  Airtel Money
                </span>
                <span
                  class="px-2 py-0.5 rounded-md bg-white dark:bg-zinc-800 text-[10px] font-black text-orange-600 border border-orange-200 dark:border-orange-900/40"
                >
                  Halopesa
                </span>
              </div>
            </div>

            <!-- Primary Action Button: Pay via PayIt -->
            <div class="space-y-2.5">
              <button
                type="button"
                class="w-full py-4 rounded-xl bg-[#FEBF01] hover:bg-[#E5AC00] text-gray-950 text-base font-black flex items-center justify-center gap-2 shadow-lg hover:shadow-[#FEBF01]/30 transition-all active:scale-98 cursor-pointer"
                @click="openPayItCheckout"
              >
                <span class="material-icons text-xl">payments</span>
                <span>{{ t('taifa.register.payViaPayit') }}</span>
                <span class="material-icons text-base">open_in_new</span>
              </button>

              <button
                type="button"
                class="w-full py-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors cursor-pointer"
                @click="payInSameTab"
              >
                {{ t('taifa.register.payInThisTab') }} →
              </button>
            </div>

            <!-- Live Status Listener Card -->
            <div
              class="rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 p-4 text-left"
            >
              <div class="flex items-start gap-3">
                <span class="material-icons animate-spin text-[#FEBF01] text-xl shrink-0 mt-0.5">sync</span>
                <div class="flex-1">
                  <p class="text-xs font-bold text-amber-900 dark:text-amber-200 leading-snug">
                    {{ t('taifa.register.waitingPayment') }}
                  </p>
                  <p class="text-[11px] text-amber-700 dark:text-amber-300 mt-1">
                    {{
                      t(
                        'taifa.register.openInNewTab',
                        'Once you approve the prompt on your phone, this modal updates automatically.',
                      )
                    }}
                  </p>
                </div>
              </div>

              <!-- Manual Status Refresh Button -->
              <div
                class="mt-3 pt-3 border-t border-amber-200/50 dark:border-amber-900/40 flex items-center justify-between"
              >
                <span class="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                  {{ isCheckingStatus ? 'Checking status…' : 'Paid already?' }}
                </span>
                <button
                  type="button"
                  :disabled="isCheckingStatus"
                  class="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 hover:bg-amber-100 dark:hover:bg-zinc-700 text-xs font-bold text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-60"
                  @click="checkPaymentStatus"
                >
                  <span v-if="isCheckingStatus" class="material-icons animate-spin text-xs">sync</span>
                  <span>{{ t('taifa.register.checkStatus') }}</span>
                </button>
              </div>
            </div>
          </template>
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
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-fade-in {
  animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
