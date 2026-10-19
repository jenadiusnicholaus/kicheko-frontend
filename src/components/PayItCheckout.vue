<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  loadPayItSdk,
  PAYIT_SLUG,
  PAYIT_STANDALONE_URL,
  type PayItCheckoutInstance,
  type PayItResult,
} from '../lib/payit'

const props = withDefaults(
  defineProps<{
    open: boolean
    slug?: string
    mode?: 'modal' | 'inline' | 'redirect'
    title?: string
    description?: string
  }>(),
  {
    slug: PAYIT_SLUG,
    mode: 'modal',
    title: '',
    description: '',
  },
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success', result: PayItResult): void
  (e: 'failure', result: PayItResult): void
}>()

const { t } = useI18n()

type Phase = 'loading' | 'ready' | 'processing' | 'succeeded' | 'failed' | 'error'

const containerRef = ref<HTMLElement | null>(null)
const phase = ref<Phase>('loading')
const errorMessage = ref('')
const paymentId = ref('')
const failureStatus = ref('')

let checkout: PayItCheckoutInstance | null = null
let readyTimer: ReturnType<typeof setTimeout> | null = null

// An unauthorized origin (e.g. missing in AllowedOrigins) or disabled embed answers 404
// and onReady never fires.
const READY_TIMEOUT_MS = 12_000

function clearReadyTimer(): void {
  if (!readyTimer) return
  clearTimeout(readyTimer)
  readyTimer = null
}

const isInline = computed(() => props.mode === 'inline')
const isRedirect = computed(() => props.mode === 'redirect')

// In modal mode the SDK renders its own overlay; our shell only shows surrounding states.
// In inline mode, our shell hosts the iframe container across ready/processing states.
// In redirect mode, our shell displays a loading/redirecting message until navigation occurs.
const showShell = computed(() => {
  if (!props.open) return false
  if (isInline.value || isRedirect.value) return true
  return phase.value !== 'ready' && phase.value !== 'processing'
})

function teardown(): void {
  clearReadyTimer()
  if (!checkout) return
  try {
    checkout.destroy()
  } catch {
    /* SDK already torn down */
  }
  checkout = null
}

async function mountCheckout(): Promise<void> {
  phase.value = 'loading'
  errorMessage.value = ''
  paymentId.value = ''
  failureStatus.value = ''

  if (isRedirect.value) {
    try {
      const sdk = await loadPayItSdk()
      checkout = sdk.checkout({
        slug: props.slug,
        mode: 'redirect',
      })
      checkout.open()
    } catch {
      window.location.assign(PAYIT_STANDALONE_URL)
    }
    return
  }

  let sdk
  try {
    sdk = await loadPayItSdk()
  } catch {
    phase.value = 'error'
    errorMessage.value = t('taifa.payment.loadError')
    return
  }

  if (!props.open) return

  await nextTick()

  let container: HTMLElement | undefined
  if (isInline.value) {
    if (!containerRef.value) return
    container = containerRef.value
  }

  teardown()

  const closeSdkModal = (): void => {
    if (isInline.value) return
    try {
      checkout?.close()
    } catch {
      /* already closed */
    }
  }

  try {
    checkout = sdk.checkout({
      slug: props.slug,
      mode: isInline.value ? 'inline' : 'modal',
      ...(container ? { container } : {}),
      onReady: () => {
        clearReadyTimer()
        phase.value = 'ready'
      },
      onProcessing: (result) => {
        clearReadyTimer()
        phase.value = 'processing'
        paymentId.value = result.payment_id
      },
      onSuccess: (result) => {
        clearReadyTimer()
        phase.value = 'succeeded'
        paymentId.value = result.payment_id
        closeSdkModal()
        emit('success', result)
      },
      onFailure: (result) => {
        clearReadyTimer()
        phase.value = 'failed'
        paymentId.value = result.payment_id
        failureStatus.value = result.status
        closeSdkModal()
        emit('failure', result)
      },
      onClose: () => {
        emit('close')
      },
    })
    checkout.open()

    clearReadyTimer()
    readyTimer = setTimeout(() => {
      if (phase.value !== 'loading') return
      teardown()
      phase.value = 'error'
      errorMessage.value = t('taifa.payment.timeoutError')
    }, READY_TIMEOUT_MS)
  } catch {
    phase.value = 'error'
    errorMessage.value = t('taifa.payment.startError')
  }
}

function close(): void {
  emit('close')
}

function retry(): void {
  teardown()
  void mountCheckout()
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && showShell.value) close()
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      document.addEventListener('keydown', onKeydown)
      document.body.style.overflow = 'hidden'
      void mountCheckout()
      return
    }
    document.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
    teardown()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
  teardown()
})

const failureCopy: Record<string, string> = {
  ATTEMPTS_EXHAUSTED: t('taifa.payment.failExhausted'),
  EXPIRED: t('taifa.payment.failExpired'),
  CANCELLED: t('taifa.payment.failCancelled'),
}

const failureMessage = computed(() => failureCopy[failureStatus.value.toUpperCase()] ?? t('taifa.payment.failGeneric'))
</script>

<template>
  <Teleport to="body">
    <div
      v-if="showShell"
      class="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      @click.self="close"
    >
      <div
        class="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-2xl relative text-center overflow-hidden flex flex-col"
        :class="isInline ? 'max-w-lg max-h-[92vh]' : 'max-w-sm p-6 sm:p-7'"
      >
        <!-- Modal header if inline -->
        <div
          v-if="isInline"
          class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800 text-left"
        >
          <div>
            <h3 class="font-black text-gray-900 dark:text-white text-base">
              {{ title || t('taifa.register.title') }}
            </h3>
            <p v-if="description" class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {{ description }}
            </p>
          </div>
          <button
            type="button"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            :aria-label="t('taifa.nani.cancel')"
            @click="close"
          >
            <span class="material-icons text-lg">close</span>
          </button>
        </div>

        <!-- Close button if modal status shell -->
        <button
          v-else
          type="button"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          :aria-label="t('taifa.nani.cancel')"
          @click="close"
        >
          <span class="material-icons text-lg">close</span>
        </button>

        <div :class="isInline ? 'p-6 flex-1 overflow-y-auto' : ''">
          <!-- Loading -->
          <div v-if="phase === 'loading'" class="py-8">
            <span class="material-icons animate-spin text-3xl text-[#FEBF01]">sync</span>
            <p class="mt-4 text-sm font-bold text-gray-600 dark:text-gray-300">
              {{ isRedirect ? t('taifa.payment.redirecting') : t('taifa.payment.loading') }}
            </p>
          </div>

          <!-- SDK / mount error (e.g. 404 when origin is not yet allowed in PayIt) -->
          <div v-else-if="phase === 'error'" class="py-6">
            <span class="material-icons text-4xl text-red-500 mb-3">error_outline</span>
            <p class="text-sm font-bold text-gray-800 dark:text-gray-200 mb-5">{{ errorMessage }}</p>
            <div class="space-y-2">
              <button
                type="button"
                class="w-full py-3 rounded-xl bg-[#FEBF01] hover:bg-[#E5AC00] text-gray-950 font-black text-sm transition-all cursor-pointer"
                @click="retry"
              >
                {{ t('taifa.payment.tryAgain') }}
              </button>
              <a
                :href="PAYIT_STANDALONE_URL"
                target="_blank"
                rel="noopener noreferrer"
                class="block w-full py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                {{ t('taifa.payment.openPayit') }}
              </a>
            </div>
          </div>

          <!-- Succeeded -->
          <div v-else-if="phase === 'succeeded'" class="py-6">
            <div
              class="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3"
            >
              <span class="material-icons text-3xl">check_circle</span>
            </div>
            <p class="text-lg font-black text-gray-900 dark:text-white">{{ t('taifa.payment.successTitle') }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ t('taifa.payment.successDesc') }}</p>
            <p v-if="paymentId" class="mt-3 text-[11px] text-gray-400 font-mono">Ref: {{ paymentId }}</p>
          </div>

          <!-- Failed -->
          <div v-else-if="phase === 'failed'" class="py-6">
            <div
              class="w-14 h-14 rounded-full bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400 flex items-center justify-center mx-auto mb-3"
            >
              <span class="material-icons text-3xl">cancel</span>
            </div>
            <p class="text-lg font-black text-gray-900 dark:text-white">{{ t('taifa.payment.failedTitle') }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-5">{{ failureMessage }}</p>
            <button
              type="button"
              class="w-full py-3 rounded-xl bg-[#FEBF01] hover:bg-[#E5AC00] text-gray-950 font-black text-sm transition-all cursor-pointer"
              @click="retry"
            >
              {{ t('taifa.payment.tryAgain') }}
            </button>
          </div>

          <!-- Inline mode only: PayIt SDK mounts its iframe here -->
          <div
            v-if="isInline"
            v-show="phase === 'ready' || phase === 'processing'"
            ref="containerRef"
            class="w-full payit-inline-frame"
          ></div>
        </div>

        <!-- Footnote for inline -->
        <footer
          v-if="isInline"
          class="flex items-center justify-center gap-1.5 py-3 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/60 dark:bg-zinc-800/40 text-[11px] text-gray-400"
        >
          <span class="material-icons text-xs">lock</span>
          {{ t('taifa.payment.secureFooter', 'Payments are processed securely by PayIt.') }}
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.payit-inline-frame :deep(iframe) {
  width: 100%;
  border: 0;
  display: block;
}
</style>
