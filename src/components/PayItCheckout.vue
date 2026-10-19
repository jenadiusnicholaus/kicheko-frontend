<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
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

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      currentStep.value = 'payment'
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
      class="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      @click.self="close"
    >
      <div
        class="w-full max-w-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh] animate-fade-in"
      >
        <!-- Modal Header -->
        <div class="px-6 pt-5 pb-4 border-b border-gray-100 dark:border-zinc-800 flex items-start justify-between">
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
              class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm"
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
        <div class="flex-1 overflow-y-auto flex flex-col">
          <!-- SUCCESS STATE -->
          <div v-if="currentStep === 'success'" class="p-6 text-center py-6 space-y-4">
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

          <!-- STEP 2: EMBEDDED PAYIT CHECKOUT PAGE -->
          <template v-else>
            <!-- Compact Application Summary -->
            <div class="px-5 py-3 border-b border-gray-100 dark:border-zinc-800">
              <div class="flex items-center justify-between mb-1.5">
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
              <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>
                  <span class="text-gray-400">{{ t('taifa.register.applicant') }}:</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200 ml-1">{{ applicantName || '—' }}</span>
                </div>
                <div>
                  <span class="text-gray-400">{{ t('taifa.register.phone') }}:</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200 ml-1">+255 {{ applicantPhone || '—' }}</span>
                </div>
                <div v-if="applicantUniversity" class="col-span-2">
                  <span class="text-gray-400">{{ t('taifa.register.university') }}:</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200 ml-1">{{ applicantUniversity }}</span>
                </div>
                <div v-if="applicationId" class="col-span-2 text-[11px] font-mono text-gray-400 mt-0.5">
                  Ref: <span class="font-bold text-gray-600 dark:text-gray-300">{{ applicationId }}</span>
                </div>
              </div>
            </div>

            <!-- PayIt Embedded iframe -->
            <div class="flex-1 min-h-0 relative">
              <iframe
                :src="checkoutUrl"
                class="w-full border-0 payit-iframe"
                title="PayIt Checkout"
                allow="payment"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
              />
            </div>

            <!-- Payment Status Listener -->
            <div class="px-5 py-3 border-t border-gray-100 dark:border-zinc-800 bg-amber-50/60 dark:bg-amber-950/20">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2 flex-1 min-w-0">
                  <span class="material-icons animate-spin text-[#FEBF01] text-base shrink-0">sync</span>
                  <p class="text-[11px] text-amber-800 dark:text-amber-300 font-medium truncate">
                    {{ t('taifa.register.waitingPayment') }}
                  </p>
                </div>
                <button
                  type="button"
                  :disabled="isCheckingStatus"
                  class="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 hover:bg-amber-100 dark:hover:bg-zinc-700 text-xs font-bold text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-60 shrink-0"
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
.payit-iframe {
  height: 520px;
  min-height: 420px;
}
</style>
