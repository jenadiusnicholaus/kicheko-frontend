<template>
  <div class="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-2xl mx-auto w-full">
    <!-- Brand Logo -->
    <div class="mb-5 text-center">
      <img src="/image/KICHEKO PRO LOGO.png" alt="Kicheko Pro" class="w-40 sm:w-48 mx-auto object-contain" />
    </div>

    <!-- Pending payment banner — an earlier application payment was never finished -->
    <div
      v-if="pendingPayment"
      class="w-full mb-5 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center gap-3"
    >
      <span class="material-icons text-amber-500 text-2xl shrink-0">schedule</span>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-black text-amber-900 dark:text-amber-200">
          {{ t('taifa.payment.pendingTitle') }}
        </p>
        <p class="text-[11px] text-amber-800/70 dark:text-amber-300/70">
          {{ t('taifa.payment.pendingDesc') }}
        </p>
      </div>
      <button
        type="button"
        class="shrink-0 px-4 py-2.5 rounded-xl bg-[#FEBF01] hover:bg-[#E5AC00] text-gray-950 text-xs font-black shadow transition-all cursor-pointer"
        @click="resumePendingPayment"
      >
        {{ t('taifa.payment.resumeBtn') }}
      </button>
    </div>

    <!-- Registration Card matching Page 2 of PDF -->
    <div
      class="w-full bg-white dark:bg-zinc-900 border border-gray-200/90 dark:border-zinc-800 rounded-3xl shadow-xl p-6 sm:p-10 transition-all relative overflow-hidden"
    >
      <!-- Form Header -->
      <div class="text-center mb-8">
        <h2 class="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          {{ t('taifa.register.createAccount') }}
        </h2>
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1.5">
          {{ t('taifa.register.fillDetails') }}
        </p>
        <p
          class="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 px-3 py-1.5 text-[11px] font-bold text-amber-800 dark:text-amber-300"
        >
          <span class="material-icons text-sm">payments</span>
          {{ t('taifa.register.feeNotice', { fee: applicationsStore.applicationFee.toLocaleString() }) }}
        </p>
      </div>

      <!-- Registration Form -->
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4 sm:space-y-5">
          <!-- First Name & Last Name (Side by Side) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-800 dark:text-gray-200 mb-1.5">
                {{ t('taifa.register.firstName') }}
              </label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <span class="material-icons text-lg">person_outline</span>
                </span>
                <input
                  v-model="form.firstName"
                  type="text"
                  required
                  :placeholder="t('taifa.register.firstNamePlaceholder')"
                  class="w-full pl-10 pr-3.5 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/60 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#FEBF01] focus:border-[#FEBF01] transition-all"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-800 dark:text-gray-200 mb-1.5">
                {{ t('taifa.register.lastName') }}
              </label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <span class="material-icons text-lg">person_outline</span>
                </span>
                <input
                  v-model="form.lastName"
                  type="text"
                  required
                  :placeholder="t('taifa.register.lastNamePlaceholder')"
                  class="w-full pl-10 pr-3.5 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/60 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#FEBF01] focus:border-[#FEBF01] transition-all"
                />
              </div>
            </div>
          </div>

          <!-- Email Address — submitted as the applicant's username for login -->
          <div>
            <label class="block text-xs font-bold text-gray-800 dark:text-gray-200 mb-1.5">
              {{ t('taifa.register.email') }}
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <span class="material-icons text-lg">alternate_email</span>
              </span>
              <input
                v-model="form.email"
                type="email"
                required
                autocomplete="email"
                :placeholder="t('taifa.register.emailPlaceholder')"
                class="w-full pl-10 pr-3.5 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/60 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#FEBF01] focus:border-[#FEBF01] transition-all"
              />
            </div>
          </div>

          <!-- University -->
          <div>
            <label class="block text-xs font-bold text-gray-800 dark:text-gray-200 mb-1.5">
              {{ t('taifa.register.university') }}
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <span class="material-icons text-lg">school</span>
              </span>
              <select
                v-model="form.university"
                required
                class="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/60 text-sm text-gray-900 dark:text-white focus:bg-white dark:focus:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#FEBF01] focus:border-[#FEBF01] transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>{{ t('taifa.register.selectUniversity') }}</option>
                <option v-for="uni in uniStore.universities" :key="uni.id" :value="uni.name">
                  {{ uni.code }} - {{ uni.name }}
                </option>
              </select>
              <span class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
                <span class="material-icons text-lg">expand_more</span>
              </span>
            </div>
          </div>

          <!-- Phone Number with Tanzania Flag and +255 -->
          <div>
            <label class="block text-xs font-bold text-gray-800 dark:text-gray-200 mb-1.5">
              {{ t('taifa.register.phone') }}
            </label>
            <div
              class="relative flex rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/60 focus-within:ring-2 focus-within:ring-[#FEBF01] focus-within:border-[#FEBF01] transition-all overflow-hidden"
            >
              <span class="pl-3.5 flex items-center text-gray-400">
                <span class="material-icons text-lg">call</span>
              </span>
              <!-- Tanzania Flag Badge + Prefix -->
              <div
                class="flex items-center gap-1.5 px-2.5 py-3 border-r border-gray-200 dark:border-zinc-700 text-xs font-bold text-gray-700 dark:text-gray-300"
              >
                <span class="text-base">🇹🇿</span>
                <span>+255</span>
              </div>
              <input
                v-model="form.phone"
                type="tel"
                required
                placeholder="712 345 678"
                class="w-full px-3 py-3 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
            <p class="text-[11px] text-gray-400 mt-1">
              {{ t('taifa.register.phoneNote') }}
            </p>
          </div>

          <!-- Submit Error -->
          <p v-if="submitError" class="text-xs font-semibold text-red-600 dark:text-red-400 text-center">
            {{ submitError }}
          </p>

          <!-- Action Buttons matching PDF -->
          <div class="grid grid-cols-2 gap-4 pt-4 sm:pt-6">
            <button
              type="button"
              class="w-full py-3.5 rounded-xl border border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-800 dark:text-gray-200 text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-98 shadow-sm cursor-pointer"
              @click="router.back()"
            >
              <span class="material-icons text-base">arrow_back</span>
              <span>{{ t('taifa.register.back') }}</span>
            </button>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full py-3.5 rounded-xl bg-[#FEBF01] hover:bg-[#E5AC00] text-gray-950 text-sm font-black flex items-center justify-center gap-2 shadow-md hover:shadow-[#FEBF01]/30 transition-all active:scale-98 disabled:opacity-60 cursor-pointer"
            >
              <span v-if="isSubmitting" class="material-icons animate-spin text-base">sync</span>
              <span>{{ isSubmitting ? t('taifa.register.confirming') : t('taifa.register.next') }}</span>
              <span v-if="!isSubmitting" class="material-icons text-base">arrow_forward</span>
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Already Registered Modal — matched an existing paid application -->
    <div
      v-if="alreadyRegistered"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        class="w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-center"
      >
        <div
          class="w-16 h-16 rounded-full bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400 flex items-center justify-center mx-auto mb-4"
        >
          <span class="material-icons text-3xl">how_to_reg</span>
        </div>

        <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-2">
          {{ t('taifa.register.alreadyRegisteredTitle') }}
        </h3>
        <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          {{ t('taifa.register.alreadyRegisteredDesc') }}
        </p>

        <div class="space-y-2.5">
          <RouterLink
            to="/nani-ni-nani"
            class="block w-full py-3 rounded-xl bg-[#FEBF01] hover:bg-[#E5AC00] text-gray-950 font-black text-sm shadow transition-all"
          >
            {{ t('taifa.register.viewNani') }}
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useComedianApplicationsStore } from '../../stores/comedian-applications'
import { useUniversitiesStore } from '../../stores/universities'
import { findPendingPayment, type PendingPayment } from '../../lib/pending-payments'

const router = useRouter()
const { t } = useI18n()
const applicationsStore = useComedianApplicationsStore()
const uniStore = useUniversitiesStore()

/** An application payment that was initiated earlier but never confirmed. */
const pendingPayment = ref<PendingPayment | null>(null)

onMounted(async () => {
  uniStore.fetchUniversities()
  const pending = findPendingPayment('application_fee')
  if (!pending) return
  // If the webhook already confirmed it, fetchPaymentStatus clears the
  // record — only show the banner while the payment is still outstanding.
  await applicationsStore.fetchPaymentStatus(pending.paymentId)
  pendingPayment.value = findPendingPayment('application_fee') || null
})

const resumePendingPayment = () => {
  if (!pendingPayment.value) return
  router.push({
    name: 'payment-checkout',
    query: {
      app: pendingPayment.value.referenceId || '',
      name: pendingPayment.value.label || '',
      phone: pendingPayment.value.phone || '',
    },
  })
}

const FORM_DRAFT_KEY = 'kicheko_registration_draft'

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  university: '',
  phone: '',
})

// Restore in-progress form details so a refresh or navigating back from
// the checkout doesn't wipe what the applicant already typed.
try {
  const draft = sessionStorage.getItem(FORM_DRAFT_KEY)
  if (draft) Object.assign(form, JSON.parse(draft))
} catch {
  /* ignore storage access error */
}

watch(
  form,
  (v) => {
    try {
      sessionStorage.setItem(FORM_DRAFT_KEY, JSON.stringify(v))
    } catch {
      /* ignore storage access error */
    }
  },
  { deep: true },
)

const isSubmitting = ref(false)
const submitError = ref('')
const alreadyRegistered = ref(false)

/** Phone match tolerant of formatting/country-code differences (last 9 digits). */
const samePhone = (a: string, b: string) => {
  const da = a.replace(/\D/g, '')
  const db = b.replace(/\D/g, '')
  return !!da && !!db && da.slice(-9) === db.slice(-9)
}

const handleSubmit = async () => {
  isSubmitting.value = true
  submitError.value = ''
  try {
    const email = form.email.trim().toLowerCase()
    const app = await applicationsStore.createApplication({
      firstName: form.firstName,
      lastName: form.lastName,
      // The email doubles as the username — it's what they'll log in with.
      username: email,
      email,
      university: form.university,
      phone: form.phone,
    })
    // The backend may return an existing application instead of creating a
    // new one. Only trust it when the record belongs to the details just
    // submitted (same phone or email) — otherwise it isn't their
    // application, so don't pay against it and don't claim "already
    // registered" for a stranger's record.
    const ownRecord =
      samePhone(app.phone, form.phone) || app.email?.toLowerCase() === email || app.username?.toLowerCase() === email
    if (!ownRecord) {
      submitError.value = t('taifa.register.submitFailed')
      return
    }
    if (app.paymentStatus === 'paid') {
      alreadyRegistered.value = true
      try {
        sessionStorage.removeItem(FORM_DRAFT_KEY)
      } catch {
        /* ignore storage access error */
      }
      return
    }
    try {
      sessionStorage.setItem('pending_application_id', app.id)
    } catch {
      /* ignore storage access error */
    }
    router.push({
      name: 'payment-checkout',
      query: {
        app: app.id,
        name: `${form.firstName} ${form.lastName}`.trim(),
        phone: form.phone,
        uni: form.university,
      },
    })
  } catch (e: any) {
    submitError.value = e?.response?.data?.detail || e?.message || t('taifa.register.submitFailed')
  } finally {
    isSubmitting.value = false
  }
}
</script>
