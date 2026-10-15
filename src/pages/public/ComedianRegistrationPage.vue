<template>
  <div class="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-2xl mx-auto w-full">
    <!-- Brand Logo -->
    <div class="mb-5 text-center">
      <img src="/taifa/kicheko_pro_logo.png" alt="Kicheko Pro" class="w-40 sm:w-48 mx-auto object-contain" />
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

          <!-- Username -->
          <div>
            <label class="block text-xs font-bold text-gray-800 dark:text-gray-200 mb-1.5">
              {{ t('taifa.register.username') }}
            </label>
            <div class="relative">
              <span
                class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 font-semibold text-sm"
              >
                @
              </span>
              <input
                v-model="form.username"
                type="text"
                required
                :placeholder="t('taifa.register.usernamePlaceholder')"
                class="w-full pl-9 pr-3.5 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/60 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#FEBF01] focus:border-[#FEBF01] transition-all"
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
                <option v-for="uni in uniStore.universityNames" :key="uni" :value="uni">
                  {{ uni }}
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
              class="w-full py-3.5 rounded-xl bg-[#FEBF01] hover:bg-[#E5AC00] text-gray-950 text-sm font-black flex items-center justify-center gap-2 shadow-md hover:shadow-[#FEBF01]/30 transition-all active:scale-98 cursor-pointer"
            >
              <span>{{ t('taifa.register.submit') }}</span>
              <span class="material-icons text-base">arrow_forward</span>
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Step 2: Confirm Application & 10,000 TSh Fee Payment Modal -->
    <div
      v-if="showPaymentModal"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        class="w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-7 relative overflow-hidden"
      >
        <!-- Close Button -->
        <button
          type="button"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          @click="showPaymentModal = false"
        >
          <span class="material-icons text-lg">close</span>
        </button>

        <!-- Illustration -->
        <div class="text-center mb-4">
          <img src="/taifa/payment_cards_icon.png" alt="Payment" class="h-16 mx-auto object-contain mb-2" />
          <h3 class="text-xl font-black text-gray-900 dark:text-white">
            {{ t('taifa.register.confirmTitle') }}
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {{ t('taifa.register.confirmFeeDesc') }}
          </p>
        </div>

        <!-- Application Summary Card -->
        <div
          class="p-3.5 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/80 mb-4 text-xs space-y-1.5"
        >
          <div class="flex justify-between">
            <span class="text-gray-500">{{ t('taifa.register.applicant') }}:</span>
            <span class="font-bold text-gray-900 dark:text-white"
              >{{ form.firstName }} {{ form.lastName }} (@{{ form.username }})</span
            >
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">{{ t('taifa.register.university') }}:</span>
            <span class="font-bold text-gray-900 dark:text-white truncate max-w-[200px]">{{ form.university }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">{{ t('taifa.register.phone') }}:</span>
            <span class="font-bold text-gray-900 dark:text-white">+255 {{ form.phone }}</span>
          </div>
        </div>

        <!-- Fee Amount Box -->
        <div
          class="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-center mb-4"
        >
          <div class="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
            {{ t('taifa.register.feeBoxTitle') }}
          </div>
          <div class="text-3xl font-black text-amber-900 dark:text-amber-300 mt-0.5">TSh 10,000</div>
        </div>

        <!-- Payment Method Selection -->
        <div class="mb-5">
          <label class="block text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">
            {{ t('taifa.register.selectPayment') }}
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="method in paymentMethods"
              :key="method.id"
              type="button"
              class="p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer"
              :class="
                selectedPaymentMethod === method.id
                  ? 'border-[#FEBF01] bg-amber-50/60 dark:bg-amber-950/40 text-gray-950 dark:text-white font-bold ring-1 ring-[#FEBF01]'
                  : 'border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300'
              "
              @click="selectedPaymentMethod = method.id"
            >
              <span class="text-lg">{{ method.icon }}</span>
              <span class="text-xs font-medium">{{ method.name }}</span>
            </button>
          </div>
        </div>

        <!-- Submit Payment Button -->
        <div class="space-y-2">
          <button
            type="button"
            :disabled="isProcessingPayment"
            class="w-full py-3.5 rounded-xl bg-[#FEBF01] hover:bg-[#E5AC00] text-gray-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 disabled:opacity-60 cursor-pointer"
            @click="processPayment"
          >
            <span v-if="isProcessingPayment" class="material-icons animate-spin text-base">sync</span>
            <span v-else class="material-icons text-base">payments</span>
            <span>
              {{ isProcessingPayment ? t('taifa.register.confirming') : t('taifa.register.payAndSubmit') }}
            </span>
          </button>

          <button
            type="button"
            class="w-full py-2.5 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-semibold cursor-pointer"
            @click="showPaymentModal = false"
          >
            {{ t('taifa.register.cancel') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Success Screen Modal -->
    <div
      v-if="showSuccessModal"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        class="w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-center"
      >
        <div
          class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 text-3xl"
        >
          ✓
        </div>

        <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-2">
          {{ t('taifa.register.successTitle') }}
        </h3>
        <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">
          {{ t('taifa.register.successDesc') }}
        </p>

        <!-- Reference badge -->
        <div class="p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl mb-6 text-xs text-gray-500 dark:text-gray-400">
          {{ t('taifa.register.paymentRef') }}
          <span class="font-mono font-bold text-gray-900 dark:text-white">{{ completedRef }}</span>
        </div>

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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useComedianApplicationsStore } from '../../stores/comedian-applications'
import { useUniversitiesStore } from '../../stores/universities'

const router = useRouter()
const { t } = useI18n()
const applicationsStore = useComedianApplicationsStore()
const uniStore = useUniversitiesStore()

onMounted(() => {
  uniStore.fetchUniversities()
})

const form = reactive({
  firstName: '',
  lastName: '',
  username: '',
  university: '',
  phone: '',
})

const showPaymentModal = ref(false)
const showSuccessModal = ref(false)
const isProcessingPayment = ref(false)
const createdAppId = ref('')
const completedRef = ref('')

const paymentMethods = [
  { id: 'M-Pesa', name: 'Vodacom M-Pesa', icon: '🔴' },
  { id: 'Tigo Pesa', name: 'Tigo Pesa / Mixx', icon: '🔵' },
  { id: 'Airtel Money', name: 'Airtel Money', icon: '🟡' },
  { id: 'HaloPesa', name: 'HaloPesa', icon: '🟠' },
]

const selectedPaymentMethod = ref('M-Pesa')

const handleSubmit = async () => {
  const app = await applicationsStore.createApplication({
    firstName: form.firstName,
    lastName: form.lastName,
    username: form.username,
    university: form.university,
    phone: form.phone,
  })
  createdAppId.value = app.id
  showPaymentModal.value = true
}

const processPayment = async () => {
  isProcessingPayment.value = true
  const refNum = `${selectedPaymentMethod.value.slice(0, 2).toUpperCase()}-${Math.floor(1000000 + Math.random() * 9000000)}`
  await applicationsStore.payApplicationFee(createdAppId.value, selectedPaymentMethod.value, refNum)
  isProcessingPayment.value = false
  completedRef.value = refNum
  showPaymentModal.value = false
  showSuccessModal.value = true
}
</script>
