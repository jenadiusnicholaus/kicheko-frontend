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

    <!-- Applications CLOSED: paid vote leaderboard -->
    <section
      v-else
      class="w-full max-w-3xl mb-24 overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 ring-1 ring-black/5 dark:ring-white/10 shadow-[0_12px_40px_rgba(15,23,42,0.08)] text-left"
    >
      <!-- Header -->
      <header class="bg-gradient-to-br from-[#1B2A4A] to-[#0F1A30] px-5 sm:px-7 py-5 sm:py-6">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <div class="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80">
                {{ t('taifa.home.liveLabel') }}
              </span>
            </div>
            <h1 class="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              {{ t('taifa.home.voteTitle') }}
            </h1>
            <p class="mt-1 text-xs sm:text-sm text-white/60">
              {{ t('taifa.home.voteSubtitle') }}
            </p>
          </div>
          <div v-if="applicationsStore.voteList.length" class="shrink-0 text-right">
            <div class="text-2xl sm:text-3xl font-extrabold tabular-nums text-white">
              {{ applicationsStore.voteList.length }}
            </div>
            <div class="text-[10px] font-semibold uppercase tracking-wider text-white/50">
              {{ t('taifa.home.contestantsShort') }}
            </div>
          </div>
        </div>
      </header>

      <div v-if="isLoading" class="flex items-center justify-center py-20 text-gray-400">
        <span class="material-icons animate-spin text-3xl">sync</span>
      </div>

      <div v-else-if="applicationsStore.voteList.length === 0" class="py-16 text-center text-gray-400">
        <span class="material-icons mb-3 text-5xl text-gray-300">how_to_vote</span>
        <p class="text-sm font-semibold">{{ t('taifa.home.voteEmpty') }}</p>
      </div>

      <!-- Leaderboard -->
      <ol v-else class="divide-y divide-gray-100 dark:divide-zinc-800">
        <li
          v-for="(applicant, index) in applicationsStore.voteList"
          :key="applicant.id"
          class="group flex items-center gap-3 sm:gap-4 px-4 sm:px-7 py-3.5 transition-colors hover:bg-gray-50/80 dark:hover:bg-zinc-800/40"
        >
          <!-- Rank -->
          <div
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums"
            :class="rankClass(ranks[index], applicant.votes)"
          >
            {{ ranks[index] }}
          </div>

          <!-- Avatar -->
          <div
            class="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1B2A4A]/5 dark:bg-white/5 text-sm font-bold text-[#1B2A4A] dark:text-gray-200"
          >
            {{ initials(applicant.name) }}
          </div>

          <!-- Name -->
          <div class="w-24 sm:w-44 shrink-0 min-w-0">
            <p class="truncate text-sm font-semibold text-gray-900 dark:text-white">{{ applicant.name }}</p>
            <p class="truncate text-[11px] text-gray-500 dark:text-gray-400">
              {{ applicant.university || applicant.universityCode }}
            </p>
          </div>

          <!-- Progress bar (true vote share) -->
          <div class="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800">
            <div
              class="h-full rounded-full transition-all duration-700 ease-out"
              :class="isLeader(index) ? 'bg-[#FEBF01]' : 'bg-[#1B2A4A] dark:bg-gray-300'"
              :style="{ width: `${sharePercent(applicant.votes)}%` }"
            ></div>
          </div>

          <!-- Percentage -->
          <span
            class="w-14 shrink-0 text-right text-sm sm:text-base font-bold tabular-nums"
            :class="isLeader(index) ? 'text-[#B58800] dark:text-[#FEBF01]' : 'text-gray-900 dark:text-white'"
          >
            {{ sharePercent(applicant.votes) }}%
          </span>

          <!-- Vote -->
          <button
            type="button"
            class="shrink-0 inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#1B2A4A]/15 dark:border-white/15 px-3 sm:px-4 text-xs font-semibold text-[#1B2A4A] dark:text-white transition-all hover:border-[#FEBF01] hover:bg-[#FEBF01] hover:text-gray-950 active:scale-95"
            @click="openVoteModal(applicant)"
          >
            <span class="material-icons text-base">how_to_vote</span>
            <span class="hidden sm:inline">{{ t('taifa.home.vote') }}</span>
          </button>
        </li>
      </ol>

      <!-- Footer -->
      <footer
        class="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/60 dark:bg-zinc-900 px-5 sm:px-7 py-3.5"
      >
        <p class="text-[11px] text-gray-500 dark:text-gray-400">
          {{ t('taifa.home.voteFooter', { fee: applicationsStore.voteFee.toLocaleString() }) }}
        </p>
        <div class="flex items-center gap-2">
          <img src="/taifa/taifa_logo.png" alt="Taifa House" class="h-6 w-6 rounded-full object-cover" />
          <span class="text-[11px] font-semibold text-gray-600 dark:text-gray-300">Taifa House</span>
        </div>
      </footer>
    </section>

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

        <!-- Step: payer phone (one vote per payment) -->
        <template v-if="voteModal.step === 'form'">
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
            {{ t('taifa.home.votesAdded', { name: voteModal.applicant.name, pct: currentShare }) }}
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

const totalVotes = computed(() => applicationsStore.voteList.reduce((sum, a) => sum + a.votes, 0))
const sharePercent = (votes: number) => (totalVotes.value > 0 ? ((votes / totalVotes.value) * 100).toFixed(1) : '0.0')

/** Competition ranking — tied vote counts share the same rank. */
const ranks = computed(() => {
  const list = applicationsStore.voteList
  return list.map((a) => 1 + list.filter((o) => o.votes > a.votes).length)
})
const isLeader = (index: number) => ranks.value[index] === 1 && (applicationsStore.voteList[index]?.votes ?? 0) > 0
const rankClass = (rank: number, votes: number) => {
  if (votes <= 0) return 'bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-gray-400'
  if (rank === 1) return 'bg-[#FEBF01] text-gray-950 shadow-sm'
  if (rank === 2) return 'bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-gray-200'
  if (rank === 3) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
  return 'bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-gray-400'
}
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')

// ── Paid vote modal ───────────────────────────────────────────
type Step = 'form' | 'waiting' | 'done' | 'failed' | 'pending'

const voteModal = reactive({
  applicant: null as VoteListApplicant | null,
  step: 'form' as Step,
  phone: '',
  submitting: false,
  error: '',
})

/** The voted applicant's share after the vote list refreshes. */
const currentShare = computed(() => {
  const a = applicationsStore.voteList.find((x) => x.id === voteModal.applicant?.id)
  return sharePercent(a?.votes ?? 0)
})

// One vote per payment
const totalAmount = computed(() => applicationsStore.voteFee)
const canPay = computed(() => voteModal.phone.replace(/\D/g, '').length >= 9)

let pollTimer: ReturnType<typeof setTimeout> | null = null
const stopPolling = () => {
  if (pollTimer) clearTimeout(pollTimer)
  pollTimer = null
}

const openVoteModal = (applicant: VoteListApplicant) => {
  Object.assign(voteModal, { applicant, step: 'form', submitting: false, error: '' })
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
    const res = await applicationsStore.buyVotes(voteModal.applicant.id, 1, voteModal.phone)
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
