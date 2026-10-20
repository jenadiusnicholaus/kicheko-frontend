<template>
  <div class="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 max-w-4xl mx-auto w-full text-center">
    <!-- Brand Logo with Sunburst Effect -->
    <div class="mb-6 sm:mb-8 animate-fade-in">
      <img
        src="/taifa/kicheko_pro_logo.png"
        :alt="t('taifa.pages.pro.logoAlt')"
        class="max-w-full mx-auto object-contain drop-shadow-sm hover:scale-102 transition-transform duration-300"
        :class="applicationsStore.applicationsOpen ? 'w-48 sm:w-64' : 'w-28 sm:w-36'"
      />
    </div>

    <!-- Applications OPEN: hero question + register CTA -->
    <template v-if="applicationsStore.applicationsOpen">
      <h1
        class="text-3xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-tight max-w-2xl mx-auto mb-8 sm:mb-10"
      >
        {{ t('taifa.home.question') }}
      </h1>

      <div class="mb-10 sm:mb-12">
        <RouterLink
          to="/register-comedian"
          class="inline-flex items-center justify-center gap-3 px-10 sm:px-14 py-4 sm:py-5 rounded-2xl bg-[#FEBF01] hover:bg-[#E5AC00] active:scale-95 text-gray-950 font-black text-xl sm:text-2xl shadow-xl hover:shadow-[#FEBF01]/40 transition-all transform hover:-translate-y-1 cursor-pointer"
        >
          <span>{{ t('taifa.home.yes') }}</span>
          <span class="material-icons text-2xl sm:text-3xl">arrow_forward</span>
        </RouterLink>
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-3 font-medium">
          {{ t('taifa.home.feeNote') }}
        </p>
      </div>
    </template>

    <!-- Applications CLOSED: paid vote poll chart -->
    <div
      v-else
      class="w-full max-w-3xl mb-24 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden text-left"
    >
      <!-- Header -->
      <div class="bg-[#1B2A4A] px-5 sm:px-6 py-4 sm:py-5">
        <h1 class="text-lg sm:text-2xl font-black text-white tracking-tight">
          {{ t('taifa.home.voteTitle') }}
        </h1>
      </div>

      <div class="px-4 sm:px-6 py-5">
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-5">
          {{ t('taifa.home.voteDesc', { fee: applicationsStore.voteFee.toLocaleString() }) }}
        </p>

        <div v-if="isLoading" class="flex items-center justify-center py-16 text-gray-400">
          <span class="material-icons animate-spin text-3xl">sync</span>
        </div>

        <div v-else-if="applicationsStore.voteList.length === 0" class="py-12 text-center text-gray-400">
          <span class="material-icons text-5xl mb-3 text-gray-300">how_to_vote</span>
          <p class="font-bold text-sm">{{ t('taifa.home.voteEmpty') }}</p>
        </div>

        <!-- Poll rows -->
        <div v-else class="space-y-2">
          <div
            v-for="(applicant, index) in applicationsStore.voteList"
            :key="applicant.id"
            class="grid grid-cols-[2rem_minmax(0,7rem)_1fr_auto] sm:grid-cols-[2.25rem_minmax(0,10rem)_1fr_3.5rem_3.75rem_auto] items-center gap-2 sm:gap-3"
          >
            <!-- Rank chip -->
            <div
              class="h-8 rounded-md flex items-center justify-center text-xs font-black"
              :class="
                index === 0
                  ? 'bg-[#FEBF01] text-gray-950'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400'
              "
            >
              {{ index + 1 }}
            </div>

            <!-- Name -->
            <div class="min-w-0">
              <div class="font-black text-gray-900 dark:text-white text-xs sm:text-sm truncate">
                {{ applicant.name }}
              </div>
              <div class="text-[10px] text-gray-400 truncate">
                {{ applicant.universityCode || applicant.university }}
              </div>
            </div>

            <!-- Bar (relative to leader) + mobile figures -->
            <div class="min-w-0">
              <div class="h-8 rounded-md bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  class="h-full rounded-md transition-all duration-700 ease-out"
                  :style="{ width: `${barWidth(applicant.votes)}%`, backgroundColor: barColor(index) }"
                ></div>
              </div>
              <div class="sm:hidden mt-0.5 text-[10px] text-gray-500 font-bold tabular-nums">
                {{ applicant.votes.toLocaleString() }} {{ t('taifa.home.votes') }} ·
                {{ sharePercent(applicant.votes) }}%
              </div>
            </div>

            <!-- Votes -->
            <div class="hidden sm:block text-right font-black text-gray-900 dark:text-white text-sm tabular-nums">
              {{ applicant.votes.toLocaleString() }}
            </div>

            <!-- Share chip -->
            <div class="hidden sm:flex justify-end">
              <span
                class="px-1.5 py-0.5 rounded-md text-[11px] font-bold tabular-nums"
                :class="
                  index === 0
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400'
                "
              >
                {{ sharePercent(applicant.votes) }}%
              </span>
            </div>

            <!-- Vote button -->
            <button
              type="button"
              class="h-8 px-3 rounded-md bg-[#FEBF01] hover:bg-[#E5AC00] active:scale-95 text-gray-950 font-black text-[11px] sm:text-xs flex items-center gap-1 shadow-sm transition-all"
              @click="openVoteModal(applicant)"
            >
              <span class="material-icons text-sm">how_to_vote</span>
              <span class="hidden sm:inline">{{ t('taifa.home.vote') }}</span>
            </button>
          </div>
        </div>

        <!-- Totals -->
        <div
          v-if="applicationsStore.voteList.length > 0"
          class="mt-6 inline-flex items-center gap-3 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3"
        >
          <span class="px-2 py-1 rounded-md bg-[#1B2A4A] text-white text-sm font-black tabular-nums">
            {{ totalVotes.toLocaleString() }}
          </span>
          <div>
            <div class="text-sm font-black text-gray-900 dark:text-white">{{ t('taifa.home.totalVotes') }}</div>
            <div class="text-[11px] text-gray-500">
              {{ t('taifa.home.contestantsCount', { n: applicationsStore.voteList.length }) }}
            </div>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-100 dark:border-zinc-800 px-5 sm:px-6 py-3 flex items-center justify-end gap-2">
        <img src="/taifa/taifa_logo.png" alt="Taifa House" class="h-7 w-7 rounded-full object-cover" />
        <span class="text-xs font-black text-[#1B2A4A] dark:text-gray-300">Taifa House</span>
      </div>
    </div>

    <!-- ───── Paid Vote Modal ───── -->
    <div
      v-if="voteModal.applicant"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="closeVoteModal"
    >
      <div class="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-6 text-left">
        <div class="flex items-start gap-3 mb-5">
          <div class="w-10 h-10 rounded-2xl bg-[#FEBF01] text-gray-950 flex items-center justify-center shrink-0">
            <span class="material-icons">how_to_vote</span>
          </div>
          <div class="min-w-0">
            <h2 class="text-base font-black text-gray-900 dark:text-white truncate">
              {{ t('taifa.home.voteFor', { name: voteModal.applicant.name }) }}
            </h2>
            <p class="text-xs text-gray-500">
              {{ t('taifa.home.feePerVote', { fee: applicationsStore.voteFee.toLocaleString() }) }}
            </p>
          </div>
          <button
            v-if="voteModal.step !== 'waiting'"
            type="button"
            class="ml-auto p-1 text-gray-400 hover:text-gray-600"
            @click="closeVoteModal"
          >
            <span class="material-icons">close</span>
          </button>
        </div>

        <!-- Step: choose votes + phone -->
        <template v-if="voteModal.step === 'form'">
          <label class="block text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-2">
            {{ t('taifa.home.howManyVotes') }}
          </label>
          <div class="grid grid-cols-4 gap-2 mb-3">
            <button
              v-for="n in presetCounts"
              :key="n"
              type="button"
              class="py-2 rounded-xl text-sm font-black border transition-colors"
              :class="
                voteModal.count === n
                  ? 'bg-[#FEBF01] border-[#FEBF01] text-gray-950'
                  : 'border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800'
              "
              @click="voteModal.count = n"
            >
              {{ n }}
            </button>
          </div>
          <input
            v-model.number="voteModal.count"
            type="number"
            min="1"
            max="1000"
            class="w-full mb-4 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FEBF01]"
          />

          <label class="block text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-2">
            {{ t('taifa.home.payerPhone') }}
          </label>
          <input
            v-model="voteModal.phone"
            type="tel"
            inputmode="tel"
            placeholder="0712 345 678"
            class="w-full mb-4 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-sm font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FEBF01]"
          />

          <div class="flex items-center justify-between bg-gray-50 dark:bg-zinc-800 rounded-xl px-4 py-3 mb-4">
            <span class="text-xs font-bold text-gray-500">{{ t('taifa.home.totalToPay') }}</span>
            <span class="text-lg font-black text-gray-900 dark:text-white tabular-nums">
              TSh {{ totalAmount.toLocaleString() }}
            </span>
          </div>

          <p v-if="voteModal.error" class="text-xs text-red-600 font-bold mb-3">{{ voteModal.error }}</p>

          <button
            type="button"
            class="w-full py-3 rounded-xl bg-[#FEBF01] hover:bg-[#E5AC00] disabled:opacity-50 disabled:cursor-not-allowed text-gray-950 font-black text-sm flex items-center justify-center gap-2 shadow transition-all"
            :disabled="!canPay || voteModal.submitting"
            @click="submitVote"
          >
            <span v-if="voteModal.submitting" class="material-icons text-base animate-spin">sync</span>
            <span>{{ t('taifa.home.payAndVote', { amount: totalAmount.toLocaleString() }) }}</span>
          </button>
        </template>

        <!-- Step: waiting for webhook -->
        <div v-else-if="voteModal.step === 'waiting'" class="text-center py-4">
          <span class="material-icons text-5xl text-[#FEBF01] animate-pulse mb-3">phone_iphone</span>
          <p class="font-black text-gray-900 dark:text-white text-sm mb-1">{{ t('taifa.home.approveOnPhone') }}</p>
          <p class="text-xs text-gray-500">{{ t('taifa.home.approveOnPhoneDesc') }}</p>
        </div>

        <!-- Step: done -->
        <div v-else-if="voteModal.step === 'done'" class="text-center py-4">
          <span class="material-icons text-5xl text-emerald-500 mb-3">check_circle</span>
          <p class="font-black text-gray-900 dark:text-white text-sm mb-4">
            {{ t('taifa.home.votesAdded', { n: voteModal.count, name: voteModal.applicant.name }) }}
          </p>
          <button
            type="button"
            class="w-full py-2.5 rounded-xl bg-[#FEBF01] text-gray-950 font-black text-sm"
            @click="closeVoteModal"
          >
            {{ t('taifa.home.done') }}
          </button>
        </div>

        <!-- Step: failed / timed out -->
        <div v-else class="text-center py-4">
          <span
            class="material-icons text-5xl mb-3"
            :class="voteModal.step === 'failed' ? 'text-red-500' : 'text-amber-500'"
          >
            {{ voteModal.step === 'failed' ? 'error' : 'schedule' }}
          </span>
          <p class="font-black text-gray-900 dark:text-white text-sm mb-4">
            {{ voteModal.step === 'failed' ? t('taifa.home.voteFailed') : t('taifa.home.votePending') }}
          </p>
          <button
            type="button"
            class="w-full py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-bold text-sm"
            @click="closeVoteModal"
          >
            {{ t('taifa.home.done') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useComedianApplicationsStore } from '../../stores/comedian-applications'
import type { VoteListApplicant } from '../../stores/comedian-applications'

const { t } = useI18n()
const applicationsStore = useComedianApplicationsStore()

const isLoading = ref(true)
const presetCounts = [1, 5, 10, 20]
const BAR_COLORS = ['#FEBF01', '#1B2A4A', '#F97316', '#DC2626', '#EF4444', '#0D9488', '#2563EB', '#7C3AED']

const totalVotes = computed(() => applicationsStore.voteList.reduce((sum, a) => sum + a.votes, 0))
const maxVotes = computed(() => Math.max(0, ...applicationsStore.voteList.map((a) => a.votes)))

const barWidth = (votes: number) => (maxVotes.value > 0 ? Math.max(1.5, (votes / maxVotes.value) * 100) : 1.5)
const sharePercent = (votes: number) => (totalVotes.value > 0 ? ((votes / totalVotes.value) * 100).toFixed(1) : '0.0')
const barColor = (index: number) => BAR_COLORS[index % BAR_COLORS.length]

// ── Paid vote modal ───────────────────────────────────────────
type Step = 'form' | 'waiting' | 'done' | 'failed' | 'pending'

const voteModal = reactive({
  applicant: null as VoteListApplicant | null,
  step: 'form' as Step,
  count: 1,
  phone: '',
  submitting: false,
  error: '',
})

const totalAmount = computed(() => Math.max(0, Number(voteModal.count) || 0) * applicationsStore.voteFee)
const canPay = computed(() => {
  const n = Number(voteModal.count)
  return Number.isInteger(n) && n >= 1 && n <= 1000 && voteModal.phone.replace(/\D/g, '').length >= 9
})

let pollTimer: ReturnType<typeof setTimeout> | null = null
const stopPolling = () => {
  if (pollTimer) clearTimeout(pollTimer)
  pollTimer = null
}

const openVoteModal = (applicant: VoteListApplicant) => {
  Object.assign(voteModal, { applicant, step: 'form', count: 1, submitting: false, error: '' })
}

const closeVoteModal = () => {
  stopPolling()
  voteModal.applicant = null
}

const pollVote = (voteId: number, deadline: number) => {
  pollTimer = setTimeout(async () => {
    const s = await applicationsStore.fetchVoteStatus(voteId)
    if (s?.confirmed) {
      voteModal.step = 'done'
      await applicationsStore.fetchVoteList()
    } else if (s && ['failed', 'underpaid'].includes(s.payment_status)) {
      voteModal.step = 'failed'
    } else if (Date.now() > deadline) {
      voteModal.step = 'pending'
    } else {
      pollVote(voteId, deadline)
    }
  }, 3000)
}

const submitVote = async () => {
  if (!voteModal.applicant || !canPay.value) return
  voteModal.submitting = true
  voteModal.error = ''
  try {
    const res = await applicationsStore.buyVotes(voteModal.applicant.id, Number(voteModal.count), voteModal.phone)
    voteModal.step = 'waiting'
    pollVote(res.vote_id, Date.now() + 120_000)
  } catch (e: any) {
    voteModal.error = e?.response?.data?.detail || t('taifa.home.voteFailed')
  } finally {
    voteModal.submitting = false
  }
}

onMounted(async () => {
  try {
    await applicationsStore.fetchVoteList()
  } finally {
    isLoading.value = false
  }
})

onBeforeUnmount(stopPolling)
</script>
