<template>
  <div class="flex flex-col gap-6 p-4 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2.5">
          <span
            class="w-10 h-10 rounded-xl bg-[#FEBF01]/15 text-[#c89400] flex items-center justify-center material-icons text-xl"
          >
            how_to_vote
          </span>
          <h1 class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
            {{ t('taifa.voteStats.title') }}
          </h1>
        </div>
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          {{ t('taifa.voteStats.subtitle') }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
          @click="refresh"
        >
          <span class="material-icons text-base" :class="{ 'animate-spin': store.isLoading }">refresh</span>
          <span>{{ t('taifa.admin.refreshBtn') }}</span>
        </button>
      </div>
    </div>

    <!-- Error state — e.g. 403 when the logged-in user isn't staff -->
    <div
      v-if="store.error"
      class="flex items-start gap-2.5 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 text-red-800 dark:text-red-300"
    >
      <span class="material-icons text-lg shrink-0 mt-0.5">error</span>
      <p class="text-xs font-medium leading-relaxed">{{ store.error }}</p>
    </div>

    <!-- Section tabs -->
    <div class="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-zinc-800 w-fit">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        class="px-4 py-2 rounded-lg text-xs font-bold transition-colors"
        :class="
          activeTab === tab.key
            ? 'bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
        "
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-5 rounded-2xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 shadow-sm">
        <div class="flex items-center justify-between text-gray-400 mb-2">
          <span class="text-xs font-bold uppercase tracking-wider">{{ t('taifa.voteStats.purchases') }}</span>
          <span class="material-icons text-blue-500">shopping_cart</span>
        </div>
        <div class="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
          {{ section.totals.purchases.toLocaleString() }}
        </div>
        <span class="text-[11px] text-gray-500">{{ t('taifa.voteStats.purchasesDesc') }}</span>
      </div>
      <div class="p-5 rounded-2xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 shadow-sm">
        <div class="flex items-center justify-between text-gray-400 mb-2">
          <span class="text-xs font-bold uppercase tracking-wider">{{ t('taifa.voteStats.confirmed') }}</span>
          <span class="material-icons text-emerald-500">verified</span>
        </div>
        <div class="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
          {{ section.totals.confirmed.toLocaleString() }}
        </div>
        <span class="text-[11px] text-gray-500">{{ t('taifa.voteStats.confirmedDesc') }}</span>
      </div>
      <div class="p-5 rounded-2xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 shadow-sm">
        <div class="flex items-center justify-between text-gray-400 mb-2">
          <span class="text-xs font-bold uppercase tracking-wider">{{ t('taifa.voteStats.votesCast') }}</span>
          <span class="material-icons text-purple-500">how_to_vote</span>
        </div>
        <div class="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
          {{ section.totals.votes.toLocaleString() }}
        </div>
        <span class="text-[11px] text-gray-500">{{ t('taifa.voteStats.votesCastDesc') }}</span>
      </div>
      <div class="p-5 rounded-2xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 shadow-sm">
        <div class="flex items-center justify-between text-gray-400 mb-2">
          <span class="text-xs font-bold uppercase tracking-wider">{{ t('taifa.voteStats.revenue') }}</span>
          <span class="material-icons text-[#FEBF01]">payments</span>
        </div>
        <div class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
          TSh {{ section.totals.revenue.toLocaleString() }}
        </div>
        <span class="text-[11px] text-gray-500">{{ t('taifa.voteStats.revenueDesc') }}</span>
      </div>
    </div>

    <div class="grid lg:grid-cols-5 gap-6">
      <!-- Leaderboard -->
      <div
        class="lg:col-span-2 rounded-2xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden self-start"
      >
        <div class="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center gap-2">
          <span class="material-icons text-[#FEBF01]">leaderboard</span>
          <h2 class="text-sm font-black text-gray-900 dark:text-white">{{ t('taifa.voteStats.leaderboard') }}</h2>
        </div>
        <div v-if="section.leaderboard.length === 0" class="px-5 py-10 text-center text-xs text-gray-400">
          {{ t('taifa.voteStats.empty') }}
        </div>
        <ul v-else class="divide-y divide-gray-100 dark:divide-zinc-800">
          <li
            v-for="(entry, i) in section.leaderboard"
            :key="entry.application_id || `${entry.battle_id}:${entry.name}`"
            class="flex items-center gap-3 px-5 py-3"
          >
            <span
              class="w-7 h-7 rounded-lg text-[11px] font-black flex items-center justify-center shrink-0"
              :class="
                i === 0 ? 'bg-[#FEBF01] text-gray-950' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400'
              "
            >
              {{ i + 1 }}
            </span>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ entry.name }}</p>
              <p v-if="entry.battle" class="text-[11px] text-gray-400 truncate">{{ entry.battle }}</p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-sm font-black text-gray-900 dark:text-white">{{ entry.votes.toLocaleString() }}</p>
              <p class="text-[11px] text-gray-400">TSh {{ entry.revenue.toLocaleString() }}</p>
            </div>
          </li>
        </ul>
      </div>

      <!-- Purchase feed -->
      <div
        class="lg:col-span-3 rounded-2xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
      >
        <div class="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="material-icons text-blue-500">receipt_long</span>
            <h2 class="text-sm font-black text-gray-900 dark:text-white">{{ t('taifa.voteStats.recentPurchases') }}</h2>
          </div>
          <span v-if="store.fetchedAt" class="text-[11px] text-gray-400">
            {{ t('taifa.voteStats.updatedAt', { time: fetchedAtLabel }) }}
          </span>
        </div>
        <div v-if="section.votes.length === 0" class="px-5 py-10 text-center text-xs text-gray-400">
          {{ t('taifa.voteStats.empty') }}
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr
                class="text-[10px] uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-zinc-800"
              >
                <th class="px-5 py-3 font-bold">{{ t('taifa.voteStats.colVotedFor') }}</th>
                <th class="px-3 py-3 font-bold">{{ t('taifa.voteStats.colVotes') }}</th>
                <th class="px-3 py-3 font-bold">{{ t('taifa.voteStats.colAmount') }}</th>
                <th class="px-3 py-3 font-bold">{{ t('taifa.voteStats.colStatus') }}</th>
                <th class="px-3 py-3 font-bold">{{ t('taifa.voteStats.colPhone') }}</th>
                <th class="px-5 py-3 font-bold text-right">{{ t('taifa.voteStats.colTime') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-zinc-800/60">
              <tr v-for="v in section.votes" :key="v.id" class="text-xs">
                <td class="px-5 py-3">
                  <p class="font-bold text-gray-900 dark:text-white">{{ v.voted_for }}</p>
                  <p v-if="v.battle" class="text-[10px] text-gray-400">{{ v.battle }}</p>
                  <p v-else-if="v.university" class="text-[10px] text-gray-400">{{ v.university }}</p>
                </td>
                <td class="px-3 py-3 font-bold text-gray-700 dark:text-gray-300">×{{ v.votes_count }}</td>
                <td class="px-3 py-3 font-black text-gray-900 dark:text-white whitespace-nowrap">
                  TSh {{ v.amount.toLocaleString() }}
                </td>
                <td class="px-3 py-3">
                  <span
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                    :class="statusClass(v)"
                  >
                    <span class="material-icons text-[11px]">{{ v.confirmed ? 'check_circle' : 'schedule' }}</span>
                    {{ statusLabel(v) }}
                  </span>
                </td>
                <td class="px-3 py-3 text-gray-400">{{ v.phone || '—' }}</td>
                <td class="px-5 py-3 text-right text-gray-400 whitespace-nowrap">{{ timeAgo(v.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVoteStatsStore, type VotePurchase, type VoteSection } from '../../../stores/vote-stats'

const { t, locale } = useI18n()
const store = useVoteStatsStore()

const activeTab = ref<'comedian' | 'nani'>('comedian')
const tabs = computed(() => [
  { key: 'comedian' as const, label: t('taifa.voteStats.tabKicheko') },
  { key: 'nani' as const, label: t('taifa.voteStats.tabNani') },
])

const section = computed<VoteSection>(() => (activeTab.value === 'comedian' ? store.comedian : store.nani))

const fetchedAtLabel = computed(() =>
  store.fetchedAt ? new Date(store.fetchedAt).toLocaleTimeString(locale.value) : '',
)

const statusLabel = (v: VotePurchase) =>
  v.confirmed
    ? t('taifa.voteStats.statusPaid')
    : v.payment_status === 'processing' || v.payment_status === 'pending'
      ? t('taifa.voteStats.statusPending')
      : t('taifa.voteStats.statusFailed')

const statusClass = (v: VotePurchase) =>
  v.confirmed
    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'
    : v.payment_status === 'processing' || v.payment_status === 'pending'
      ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400'
      : 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400'

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return t('taifa.voteStats.justNow')
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return new Date(iso).toLocaleDateString(locale.value)
}

const refresh = () => store.fetchVoteStats()

let timer: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  refresh()
  timer = setInterval(refresh, 15000)
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
