<template>
  <div class="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 max-w-6xl mx-auto w-full text-center">
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
          {{ t('taifa.home.feeNote', { fee: applicationsStore.applicationFee.toLocaleString() }) }}
        </p>
      </div>
    </template>

    <!-- Applications CLOSED: paid vote leaderboard -->
    <section
      v-else
      class="w-full max-w-5xl mb-24 overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 ring-1 ring-black/5 dark:ring-white/10 shadow-[0_12px_40px_rgba(15,23,42,0.08)] text-left"
    >
      <!-- Header -->
      <header
        class="flex flex-col gap-3 bg-gradient-to-r from-[#1B2A4A] to-[#0F1A30] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10"
      >
        <div class="min-w-0">
          <div class="flex items-center gap-1.5">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300/90">
              {{ t('taifa.home.liveLabel') }}
            </span>
          </div>
          <h1 class="mt-1 truncate text-lg font-bold tracking-tight text-white sm:text-xl">
            {{
              applicationsStore.voteBatches.length === 1
                ? applicationsStore.voteBatches[0].title
                : t('taifa.home.voteTitle')
            }}
          </h1>
          <p class="mt-0.5 text-xs text-white/50">
            {{ t('taifa.home.voteSubtitle') }}
          </p>
        </div>
        <div class="flex shrink-0 items-center gap-2 text-[11px] font-semibold">
          <span
            class="inline-flex items-center gap-1 rounded-md border border-[#FEBF01]/30 bg-[#FEBF01]/10 px-2.5 py-1 text-[#FEBF01]"
          >
            <span class="material-icons text-xs">payments</span>
            {{ t('taifa.home.feePerVote', { fee: applicationsStore.voteFee.toLocaleString() }) }}
          </span>
          <span
            v-if="applicationsStore.voteList.length"
            class="inline-flex items-center gap-1 rounded-md bg-white/10 px-2.5 py-1 text-white/80"
          >
            <span class="material-icons text-xs">groups</span>
            <span class="tabular-nums">{{ applicationsStore.voteList.length }}</span>
            {{ t('taifa.home.contestantsShort') }}
          </span>
        </div>
      </header>

      <div v-if="isLoading" class="flex items-center justify-center py-20 text-gray-400">
        <span class="material-icons animate-spin text-3xl">sync</span>
      </div>

      <div v-else-if="applicationsStore.voteBatches.length === 0" class="py-16 text-center text-gray-400">
        <span class="material-icons mb-3 text-5xl text-gray-300">how_to_vote</span>
        <p class="text-sm font-semibold">{{ t('taifa.home.voteEmpty') }}</p>
      </div>

      <!-- Leaderboards -->
      <div v-else class="divide-y divide-gray-100 dark:divide-zinc-800">
        <section v-for="batch in applicationsStore.voteBatches" :key="batch.id">
          <header
            class="flex items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/60 px-6 py-3 dark:border-zinc-800 dark:bg-zinc-800/40 sm:px-10"
          >
            <div class="flex min-w-0 items-center gap-2.5">
              <span class="h-4 w-1 shrink-0 rounded-full bg-[#FEBF01]"></span>
              <h2 class="truncate text-sm font-bold tracking-wide text-gray-800 dark:text-gray-100">
                {{ batch.title }}
              </h2>
              <span class="shrink-0 text-xs text-gray-400">· {{ batch.applicants.length }}</span>
            </div>
            <span
              class="shrink-0 rounded-md bg-[#FEBF01]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#8A6800] dark:text-[#FEBF01]"
            >
              {{ t('taifa.admin.batches.levelValue', { level: batch.level }) }}
            </span>
          </header>
          <div class="overflow-x-auto">
            <table class="w-full min-w-[640px] table-fixed text-left">
              <thead>
                <tr
                  class="border-b border-gray-100 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:border-zinc-800"
                >
                  <th scope="col" class="w-20 py-2.5 pl-6 pr-3 sm:w-24 sm:pl-10">{{ t('taifa.home.colRank') }}</th>
                  <th scope="col" class="px-3 py-2.5">{{ t('taifa.home.colComedian') }}</th>
                  <th scope="col" class="hidden px-3 py-2.5 md:table-cell">{{ t('taifa.home.colUniversity') }}</th>
                  <th scope="col" class="w-48 px-3 py-2.5">{{ t('taifa.home.colShare') }}</th>
                  <th scope="col" class="w-20 px-3 py-2.5 text-right">{{ t('taifa.home.colVotes') }}</th>
                  <th scope="col" class="w-40 py-2.5 pl-3 pr-6 text-right sm:pr-10">
                    <span class="sr-only">{{ t('taifa.home.vote') }}</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-zinc-800">
                <tr
                  v-for="(applicant, index) in batch.applicants"
                  :key="applicant.id"
                  class="transition-colors hover:bg-gray-50/80 dark:hover:bg-zinc-800/40"
                >
                  <td class="py-3 pl-6 pr-3 sm:pl-10">
                    <div
                      class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold tabular-nums"
                      :class="rankClass(ranksFor(batch.applicants)[index], applicant.votes)"
                    >
                      {{ ranksFor(batch.applicants)[index] }}
                    </div>
                  </td>
                  <td class="px-3 py-3">
                    <div class="flex items-center gap-3">
                      <div
                        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1B2A4A]/5 text-xs font-bold text-[#1B2A4A] dark:bg-white/5 dark:text-gray-200"
                      >
                        {{ initials(applicant.name) }}
                      </div>
                      <div class="min-w-0">
                        <p class="truncate text-sm font-semibold text-gray-900 dark:text-white">
                          {{ applicant.name }}
                        </p>
                        <p class="truncate text-xs text-gray-500 dark:text-gray-400 md:hidden">
                          {{ applicant.university || applicant.universityCode }}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td class="hidden px-3 py-3 md:table-cell">
                    <p class="truncate text-sm text-gray-600 dark:text-gray-300">
                      {{ applicant.university || applicant.universityCode }}
                    </p>
                  </td>
                  <td class="px-3 py-3">
                    <div class="flex items-center gap-2">
                      <div class="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800">
                        <div
                          class="h-full rounded-full transition-all duration-700 ease-out"
                          :class="isLeader(batch.applicants, index) ? 'bg-[#FEBF01]' : 'bg-[#1B2A4A] dark:bg-gray-300'"
                          :style="{ width: `${sharePercent(applicant.votes, batch.applicants)}%` }"
                        ></div>
                      </div>
                      <span
                        class="w-12 text-right text-xs font-bold tabular-nums"
                        :class="
                          isLeader(batch.applicants, index)
                            ? 'text-[#B58800] dark:text-[#FEBF01]'
                            : 'text-gray-700 dark:text-gray-200'
                        "
                      >
                        {{ sharePercent(applicant.votes, batch.applicants) }}%
                      </span>
                    </div>
                  </td>
                  <td class="px-3 py-3 text-right text-sm font-bold tabular-nums text-gray-900 dark:text-white">
                    {{ applicant.votes.toLocaleString() }}
                  </td>
                  <td class="py-3 pl-3 pr-6 text-right sm:pr-10">
                    <button
                      type="button"
                      class="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#1B2A4A]/15 px-3 text-xs font-semibold text-[#1B2A4A] transition-all hover:border-[#FEBF01] hover:bg-[#FEBF01] hover:text-gray-950 active:scale-95 dark:border-white/15 dark:text-white sm:px-4"
                      @click="openVoteModal(applicant)"
                    >
                      <span class="material-icons text-base">how_to_vote</span>
                      <span>{{ t('taifa.home.vote') }}</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <!-- Footer -->
      <footer
        class="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/60 dark:bg-zinc-900 px-6 sm:px-10 py-4"
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

        <!-- Step: payer phone + vote count -->
        <template v-if="voteModal.step === 'form'">
          <label class="block text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-2">
            {{ t('taifa.home.votes') }}
          </label>
          <div class="flex flex-wrap gap-2 mb-4">
            <button
              v-for="n in VOTE_COUNT_CHOICES"
              :key="n"
              type="button"
              class="px-3.5 py-2 rounded-xl text-sm font-bold border transition-all"
              :class="
                voteModal.votesCount === n
                  ? 'bg-[#FEBF01] border-[#FEBF01] text-gray-950'
                  : 'border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300 hover:border-[#FEBF01]'
              "
              @click="voteModal.votesCount = n"
            >
              {{ n }}
            </button>
          </div>

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
        <div v-else-if="voteModal.step === 'waiting'">
          <PaymentWaitingPanel
            :phone="voteModal.phone"
            :checking="checkingVote"
            @check="checkVoteNow"
            @back="backToVoteForm"
            @cancel="closeVoteModal"
          />
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
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useComedianApplicationsStore } from '../../stores/comedian-applications'
import type { VoteListApplicant } from '../../stores/comedian-applications'
import { findPendingPayment, savePendingPayment } from '../../lib/pending-payments'
import PaymentWaitingPanel from '../../components/PaymentWaitingPanel.vue'

const { t } = useI18n()
const applicationsStore = useComedianApplicationsStore()

const isLoading = ref(true)

const sharePercent = (votes: number, applicants: VoteListApplicant[]) => {
  const total = applicants.reduce((sum, applicant) => sum + applicant.votes, 0)
  return total > 0 ? ((votes / total) * 100).toFixed(1) : '0.0'
}

/** Competition ranking — tied vote counts share the same rank. */
const ranksFor = (applicants: VoteListApplicant[]) =>
  applicants.map((applicant) => 1 + applicants.filter((other) => other.votes > applicant.votes).length)
const isLeader = (applicants: VoteListApplicant[], index: number) =>
  ranksFor(applicants)[index] === 1 && (applicants[index]?.votes ?? 0) > 0
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
  votesCount: 1,
  phone: '',
  submitting: false,
  error: '',
})

/** The voted applicant's share after the vote list refreshes. */
const currentShare = computed(() => {
  const a = applicationsStore.voteList.find((x) => x.id === voteModal.applicant?.id)
  const batch = applicationsStore.voteBatches.find((candidate) => candidate.id === a?.batchId)
  return sharePercent(a?.votes ?? 0, batch?.applicants ?? [])
})

// Payer picks how many votes — backend charges votesCount x voteFee (max 1000).
const VOTE_COUNT_CHOICES = [1, 5, 10, 25, 50, 100]
const VOTE_DRAFT_KEY = 'kicheko_vote_draft'

// Restore the in-progress vote form so a refresh/back doesn't wipe it.
try {
  const draft = JSON.parse(sessionStorage.getItem(VOTE_DRAFT_KEY) || 'null')
  if (draft) {
    voteModal.phone = draft.phone || ''
    if (VOTE_COUNT_CHOICES.includes(draft.votesCount)) voteModal.votesCount = draft.votesCount
  }
} catch {
  /* ignore storage access error */
}

watch(
  () => [voteModal.phone, voteModal.votesCount],
  ([phone, votesCount]) => {
    try {
      sessionStorage.setItem(VOTE_DRAFT_KEY, JSON.stringify({ phone, votesCount }))
    } catch {
      /* ignore storage access error */
    }
  },
)

const totalAmount = computed(() => voteModal.votesCount * applicationsStore.voteFee)
const canPay = computed(() => voteModal.phone.replace(/\D/g, '').length >= 9)

const checkingVote = ref(false)
const votePaymentId = ref('')

let pollTimer: ReturnType<typeof setTimeout> | null = null
const stopPolling = () => {
  if (pollTimer) clearTimeout(pollTimer)
  pollTimer = null
}

const openVoteModal = (applicant: VoteListApplicant) => {
  // A cancelled payment stays in pending-payments — reopen the waiting step
  // instead of initiating (and charging) a second payment for the same applicant.
  const pending = findPendingPayment('comedian_vote', applicant.id)
  if (pending) {
    Object.assign(voteModal, {
      applicant,
      step: 'waiting',
      votesCount: pending.votesCount || 1,
      phone: pending.phone || '',
      submitting: false,
      error: '',
    })
    votePaymentId.value = pending.paymentId
    pollVote(pending.paymentId, Date.now() + 120_000)
    checkVoteNow()
    return
  }
  Object.assign(voteModal, { applicant, step: 'form', submitting: false, error: '' })
  votePaymentId.value = ''
}

const closeVoteModal = () => {
  stopPolling()
  voteModal.applicant = null
}

/** Applies a status response to the vote modal. Returns true when the
 * payment reached a terminal state (confirmed or failed). */
const applyVoteStatus = (s: { confirmed?: boolean; payment_status?: string } | null): boolean => {
  if (s?.confirmed) {
    voteModal.step = 'done'
    applicationsStore.fetchVoteList()
    return true
  }
  if (s && ['failed', 'underpaid'].includes(s.payment_status ?? '')) {
    voteModal.step = 'failed'
    return true
  }
  return false
}

const pollVote = (paymentId: string, deadline: number) => {
  pollTimer = setTimeout(async () => {
    const s = await applicationsStore.fetchVoteStatus(paymentId)
    if (!applyVoteStatus(s)) {
      if (Date.now() > deadline) voteModal.step = 'pending'
      else pollVote(paymentId, deadline)
    }
  }, 3000)
}

const checkVoteNow = async () => {
  if (!votePaymentId.value || checkingVote.value) return
  checkingVote.value = true
  try {
    const settled = applyVoteStatus(await applicationsStore.fetchVoteStatus(votePaymentId.value))
    // Still unpaid — re-initiate so a fresh USSD prompt is pushed.
    if (!settled) await submitVote()
  } finally {
    checkingVote.value = false
  }
}

const backToVoteForm = () => {
  stopPolling()
  voteModal.step = 'form'
}

/** Reopens the vote modal if a vote payment was left unfinished earlier.
 * If it already settled, show the done state; otherwise reopen the form
 * prefilled so pressing pay pushes a fresh USSD prompt. */
const resumePendingVote = async () => {
  const pending = findPendingPayment('comedian_vote')
  if (!pending) return
  const applicant = applicationsStore.voteList.find((a) => a.id === pending.referenceId)
  if (!applicant) return
  const s = await applicationsStore.fetchVoteStatus(pending.paymentId)
  const settled = !!(s && (s.confirmed || s.payment_status === 'paid'))
  if (settled) applicationsStore.fetchVoteList()
  Object.assign(voteModal, {
    applicant,
    step: settled ? 'done' : 'form',
    votesCount: pending.votesCount || 1,
    phone: pending.phone || '',
    submitting: false,
    error: '',
  })
}

const submitVote = async () => {
  if (!voteModal.applicant || !canPay.value) return
  voteModal.submitting = true
  voteModal.error = ''
  try {
    const res = await applicationsStore.buyVotes(voteModal.applicant.id, voteModal.votesCount, voteModal.phone)
    votePaymentId.value = res.payment_id
    savePendingPayment({
      paymentId: res.payment_id,
      purpose: 'comedian_vote',
      referenceId: voteModal.applicant.id,
      label: voteModal.applicant.name,
      amount: res.amount,
      votesCount: voteModal.votesCount,
      phone: voteModal.phone,
    })
    voteModal.step = 'waiting'
    pollVote(res.payment_id, Date.now() + 120_000)
  } catch (e: any) {
    voteModal.error = e?.response?.data?.detail || t('taifa.home.voteFailed')
  } finally {
    voteModal.submitting = false
  }
}

onMounted(async () => {
  try {
    await applicationsStore.fetchVoteList()
    resumePendingVote()
  } finally {
    isLoading.value = false
  }
})

onBeforeUnmount(stopPolling)
</script>
