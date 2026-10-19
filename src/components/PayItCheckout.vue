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
type ProviderId = 'MPESA' | 'MIX_BY_YAS' | 'AIRTEL' | 'HALOPESA'

interface ProviderOption {
  id: ProviderId
  label: string
  brand: string
  textColor: string
}

const providers: ProviderOption[] = [
  { id: 'MPESA', label: 'M-Pesa', brand: 'Vodacom', textColor: 'text-red-600 dark:text-red-400' },
  { id: 'MIX_BY_YAS', label: 'Mixx by Yas', brand: 'Yas / Tigo', textColor: 'text-sky-600 dark:text-sky-400' },
  { id: 'AIRTEL', label: 'Airtel Money', brand: 'Airtel', textColor: 'text-red-700 dark:text-red-400' },
  { id: 'HALOPESA', label: 'Halopesa', brand: 'Halotel', textColor: 'text-orange-600 dark:text-orange-400' },
]

const currentStep = ref<Step>('payment')
const isCheckingStatus = ref(false)
const isSubmittingPayment = ref(false)
const paymentPromptSent = ref(false)
const paymentError = ref('')
const selectedProvider = ref<ProviderId>('MPESA')
const payerPhone = ref('')
const payerName = ref('')
const payerPurpose = ref('Kicheko Application fees')
let pollingInterval: ReturnType<typeof setInterval> | null = null

function cleanPhone(raw: string): string {
  const digits = (raw || '').replace(/\D/g, '')
  if (digits.startsWith('255')) return digits.slice(3)
  if (digits.startsWith('0')) return digits.slice(1)
  return digits
}

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

async function submitPayItForm(): Promise<void> {
  paymentError.value = ''
  const phoneDigits = payerPhone.value.replace(/\D/g, '')
  if (!phoneDigits || phoneDigits.length < 9) {
    paymentError.value = t('taifa.register.invalidPhone')
    return
  }

  isSubmittingPayment.value = true

  const fullPhone = phoneDigits.startsWith('255')
    ? phoneDigits
    : phoneDigits.startsWith('0')
      ? '255' + phoneDigits.slice(1)
      : '255' + phoneDigits

  try {
    sessionStorage.setItem('pending_application_id', props.applicationId)
  } catch {
    /* ignore storage access error */
  }

  let sessionInitiated = false

  try {
    const sessionRes = await fetch(`https://app.payit.co.tz/api/public/payment-links/${props.slug}/checkout-sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': `kicheko-${props.applicationId || Date.now()}-${Date.now()}`,
      },
      body: JSON.stringify({
        amount: '1000.00',
        currency: props.currency,
        payer_purpose: payerPurpose.value || 'Kicheko Application fees',
        merchant_reference: props.applicationId || 'kicheko-app',
      }),
    })

    if (sessionRes.ok) {
      const sessionData = await sessionRes.json()
      if (sessionData?.checkout_token && sessionData?.payment_id) {
        const attemptRes = await fetch(
          `https://app.payit.co.tz/api/public/checkout-sessions/${encodeURIComponent(sessionData.payment_id)}/mobile-money-attempts`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Checkout ${sessionData.checkout_token}`,
            },
            body: JSON.stringify({
              mobile_number: fullPhone,
              provider: selectedProvider.value,
            }),
          },
        )
        if (attemptRes.ok) {
          sessionInitiated = true
        }
      }
    }
  } catch {
    // Cross-origin restrictions fallback
  }

  if (!sessionInitiated) {
    window.open(props.checkoutUrl, '_blank', 'noopener,noreferrer')
  }

  paymentPromptSent.value = true
  isSubmittingPayment.value = false
  startPolling()
}

function openPayItCheckout(): void {
  try {
    sessionStorage.setItem('pending_application_id', props.applicationId)
  } catch {
    /* ignore */
  }
  window.open(props.checkoutUrl, '_blank', 'noopener,noreferrer')
  startPolling()
}

function editDetails(): void {
  paymentPromptSent.value = false
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

const selectedProviderLabel = computed(() => {
  return providers.find((p) => p.id === selectedProvider.value)?.label || 'Mobile Money'
})

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      currentStep.value = 'payment'
      paymentPromptSent.value = false
      paymentError.value = ''
      payerPhone.value = cleanPhone(props.applicantPhone)
      payerName.value = props.applicantName || ''
      payerPurpose.value = 'Kicheko Application fees'
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

        <!-- Two-Step Progress Pill Indicator (Step 1 Completed -> Step 2 PayIt Payment Form) -->
        <div
          class="px-6 py-3 bg-gray-50/70 dark:bg-zinc-800/40 border-b border-gray-100 dark:border-zinc-800 flex items-center gap-3"
        >
          <!-- Step 1: Application (Completed) -->
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

          <!-- Step 2: Payment Form (Active) -->
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
        <div class="p-6 overflow-y-auto flex-1 space-y-4">
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

          <!-- STEP 2: NATIVE PAYIT PAYMENT FORM (NO DUPLICATE INFO) -->
          <template v-else>
            <!-- PayIt Amount Banner -->
            <div
              class="rounded-2xl border border-gray-200/80 dark:border-zinc-800 bg-gradient-to-r from-gray-50 to-amber-50/40 dark:from-zinc-800/60 dark:to-zinc-800/30 p-4 sm:p-5 flex items-center justify-between shadow-sm"
            >
              <div>
                <span class="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                  PayIt Checkout · Ada ya Usajili
                </span>
                <div class="text-3xl font-black text-gray-950 dark:text-white tracking-tight mt-0.5">
                  {{ displayAmount }}
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400"> Kicheko Application fees </span>
              </div>
              <div
                class="w-12 h-12 rounded-2xl bg-[#FEBF01]/15 text-gray-950 dark:text-[#FEBF01] flex items-center justify-center font-black border border-[#FEBF01]/30 shadow-inner"
              >
                <span class="material-icons text-2xl text-[#FEBF01]">payments</span>
              </div>
            </div>

            <!-- PROMPT SENT STATE -->
            <div
              v-if="paymentPromptSent"
              class="rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 p-4 sm:p-5 text-left space-y-3"
            >
              <div class="flex items-start gap-3">
                <span class="material-icons animate-spin text-[#FEBF01] text-2xl shrink-0 mt-0.5">sync</span>
                <div class="flex-1">
                  <h4 class="text-sm font-black text-amber-950 dark:text-amber-200">
                    {{ t('taifa.register.promptSentTitle') }}
                  </h4>
                  <p class="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                    {{ t('taifa.register.promptSentDesc', { phone: payerPhone }) }} ({{ selectedProviderLabel }}).
                  </p>
                  <p class="text-[11px] text-amber-700/80 dark:text-amber-400 mt-1.5 font-medium">
                    {{
                      t(
                        'taifa.register.openInNewTab',
                        'Once you approve the prompt on your phone, this modal updates automatically.',
                      )
                    }}
                  </p>
                </div>
              </div>

              <!-- Action Controls in Waiting State -->
              <div
                class="pt-3 border-t border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between gap-2 flex-wrap"
              >
                <button
                  type="button"
                  class="text-xs font-bold text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
                  @click="editDetails"
                >
                  <span class="material-icons text-sm">edit</span>
                  <span>{{ t('taifa.register.changeDetails') }}</span>
                </button>

                <button
                  type="button"
                  :disabled="isCheckingStatus"
                  class="px-3.5 py-1.5 rounded-xl bg-white dark:bg-zinc-800 hover:bg-amber-100 dark:hover:bg-zinc-700 text-xs font-bold text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-60"
                  @click="checkPaymentStatus"
                >
                  <span v-if="isCheckingStatus" class="material-icons animate-spin text-xs">sync</span>
                  <span>{{ t('taifa.register.checkStatus') }}</span>
                </button>
              </div>
            </div>

            <!-- THE PAYIT FORM -->
            <form v-else class="space-y-4" @submit.prevent="submitPayItForm">
              <!-- Field 1: Payment Method (Mobile Money & Provider Selector) -->
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  {{ t('taifa.register.paymentMethod') }}
                </label>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    v-for="provider in providers"
                    :key="provider.id"
                    type="button"
                    class="p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer"
                    :class="
                      selectedProvider === provider.id
                        ? 'border-[#FEBF01] bg-[#FEBF01]/10 dark:bg-[#FEBF01]/20 ring-2 ring-[#FEBF01]/40 shadow-sm'
                        : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 bg-white dark:bg-zinc-800/80'
                    "
                    @click="selectedProvider = provider.id"
                  >
                    <div class="flex items-center justify-between w-full">
                      <span class="text-xs font-black" :class="provider.textColor">
                        {{ provider.label }}
                      </span>
                      <span
                        v-if="selectedProvider === provider.id"
                        class="w-4 h-4 rounded-full bg-[#FEBF01] text-gray-950 flex items-center justify-center text-[10px] font-bold"
                      >
                        ✓
                      </span>
                    </div>
                    <span class="text-[10px] text-gray-400 mt-1 block font-medium">
                      {{ provider.brand }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- Field 2: Phone Number (Prefilled, Editable with 🇹🇿 +255) -->
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  {{ t('taifa.register.payerPhone') }}
                </label>
                <div
                  class="flex rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/60 focus-within:ring-2 focus-within:ring-[#FEBF01] focus-within:border-[#FEBF01] transition-all overflow-hidden"
                >
                  <div
                    class="flex items-center gap-1.5 px-3 py-3 border-r border-gray-200 dark:border-zinc-700 text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100/70 dark:bg-zinc-800"
                  >
                    <span class="text-base">🇹🇿</span>
                    <span>+255</span>
                  </div>
                  <input
                    v-model="payerPhone"
                    type="tel"
                    required
                    placeholder="712 345 678"
                    class="w-full px-3 py-3 bg-transparent text-sm font-semibold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                  />
                </div>
                <p v-if="paymentError" class="text-xs text-red-600 dark:text-red-400 font-medium">
                  {{ paymentError }}
                </p>
              </div>

              <!-- Field 3: Full Name (Contact Information) -->
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  {{ t('taifa.register.payerName') }}
                </label>
                <input
                  v-model="payerName"
                  type="text"
                  placeholder="Full name"
                  class="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/60 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#FEBF01] focus:border-[#FEBF01] transition-all"
                />
              </div>

              <!-- Field 4: Purpose (Optional) -->
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  {{ t('taifa.register.purpose') }}
                </label>
                <input
                  v-model="payerPurpose"
                  type="text"
                  placeholder="e.g. Invoice 42"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/60 text-xs text-gray-600 dark:text-gray-300 placeholder-gray-400 focus:bg-white dark:focus:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#FEBF01] focus:border-[#FEBF01] transition-all"
                />
              </div>

              <!-- Submit Button -->
              <div class="pt-2 space-y-2">
                <button
                  type="submit"
                  :disabled="isSubmittingPayment"
                  class="w-full py-3.5 rounded-xl bg-[#FEBF01] hover:bg-[#E5AC00] text-gray-950 text-sm font-black flex items-center justify-center gap-2 shadow-lg hover:shadow-[#FEBF01]/30 transition-all active:scale-98 disabled:opacity-60 cursor-pointer"
                >
                  <span v-if="isSubmittingPayment" class="material-icons animate-spin text-base">sync</span>
                  <span v-else class="material-icons text-base">payments</span>
                  <span>
                    {{
                      isSubmittingPayment
                        ? t('taifa.register.confirming')
                        : t('taifa.register.payNow', { amount: displayAmount })
                    }}
                  </span>
                </button>

                <button
                  type="button"
                  class="w-full py-1.5 text-[11px] font-bold text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer text-center block"
                  @click="openPayItCheckout"
                >
                  {{ t('taifa.register.orOpenPayit') }} ↗
                </button>
              </div>

              <!-- Supported Providers List -->
              <div class="pt-2 border-t border-gray-100 dark:border-zinc-800 text-center">
                <span class="text-[10px] text-gray-400 font-medium">
                  {{ t('taifa.register.supportedNetworks') }}
                </span>
              </div>
            </form>
          </template>
        </div>

        <!-- Footnote: PayIt branding -->
        <footer
          class="px-6 py-3 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/60 dark:bg-zinc-800/40 flex items-center justify-between text-[11px] text-gray-400"
        >
          <span class="flex items-center gap-1.5">
            <span class="material-icons text-xs">lock</span>
            <span>PayIt Secure Checkout · powered by payit</span>
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
