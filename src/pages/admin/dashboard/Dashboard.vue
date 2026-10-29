<template>
  <div class="space-y-6">
    <!-- Studio Header -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm"
    >
      <div class="flex items-center gap-3.5">
        <div
          class="w-12 h-12 rounded-2xl bg-amber-400 text-gray-950 flex items-center justify-center font-black shadow-md shrink-0"
        >
          <img src="/taifa/taifa_icon.png" alt="Taifa House" class="w-8 h-8 object-contain" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {{ t('taifa.admin.title') }} (Taifa House Admin)
            </h1>
            <span
              class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 text-[11px] font-bold"
            >
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {{ t('taifa.dashboard.liveOnline') }}
            </span>
          </div>
          <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {{ t('taifa.admin.subtitle') }}
          </p>
        </div>
      </div>

      <!-- Quick Action Controls -->
      <div class="flex flex-wrap items-center gap-2.5">
        <RouterLink
          to="/"
          target="_blank"
          class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <span class="material-icons text-base">visibility</span>
          <span>{{ t('taifa.dashboard.viewPlatform') }}</span>
          <span class="material-icons text-xs">open_in_new</span>
        </RouterLink>

        <RouterLink
          to="/admin/applications"
          class="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-gray-950 text-xs font-black shadow-md hover:shadow-amber-400/30 flex items-center gap-1.5 transition-all"
        >
          <span class="material-icons text-base">how_to_reg</span>
          <span>{{ t('taifa.dashboard.reviewApps') }} ({{ applicationsStore.pendingReviewCount }})</span>
        </RouterLink>
      </div>
    </div>

    <!-- Core Metrics Overview -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Comedian Applications -->
      <RouterLink
        to="/admin/applications"
        class="p-5 rounded-2xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 shadow-sm hover:border-amber-400 transition-all group"
      >
        <div class="flex items-center justify-between text-gray-400 mb-2">
          <span class="text-xs font-bold uppercase tracking-wider">{{ t('taifa.dashboard.appsCard') }}</span>
          <span class="material-icons text-blue-500 group-hover:scale-110 transition-transform">assignment</span>
        </div>
        <div class="text-3xl font-black text-gray-900 dark:text-white">
          {{ applicationsStore.totalApplications }}
        </div>
        <div class="flex items-center justify-between text-[11px] text-gray-500 mt-1">
          <span
            >{{ t('taifa.dashboard.approved') }}:
            <strong class="text-emerald-600">{{ applicationsStore.approvedCount }}</strong></span
          >
          <span class="text-amber-600 font-bold"
            >{{ applicationsStore.pendingReviewCount }} {{ t('taifa.dashboard.newApps') }}</span
          >
        </div>
      </RouterLink>

      <!-- Fee Revenue (10,000 TSh) -->
      <div class="p-5 rounded-2xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 shadow-sm">
        <div class="flex items-center justify-between text-gray-400 mb-2">
          <span class="text-xs font-bold uppercase tracking-wider">{{ t('taifa.dashboard.feeCard') }}</span>
          <span class="material-icons text-emerald-500">payments</span>
        </div>
        <div class="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
          TSh {{ applicationsStore.totalFeeRevenue.toLocaleString() }}
        </div>
        <div class="text-[11px] text-gray-500 mt-1">
          {{ t('taifa.dashboard.feeFrom') }}
          {{ applicationsStore.applications.filter((a) => a.paymentStatus === 'paid').length }}
        </div>
      </div>

      <!-- Nani ni Nani Votes -->
      <RouterLink
        to="/admin/nani-ni-nani"
        class="p-5 rounded-2xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 shadow-sm hover:border-amber-400 transition-all group"
      >
        <div class="flex items-center justify-between text-gray-400 mb-2">
          <span class="text-xs font-bold uppercase tracking-wider">{{ t('taifa.dashboard.naniVotesCard') }}</span>
          <span class="material-icons text-red-500 group-hover:scale-110 transition-transform">favorite</span>
        </div>
        <div class="text-3xl font-black text-gray-900 dark:text-white">
          {{ naniVotes.toLocaleString() }}
        </div>
        <div class="flex items-center justify-between text-[11px] text-gray-500 mt-1">
          <span
            >{{ t('taifa.dashboard.revenue') }}:
            <strong class="text-amber-500">TSh {{ naniRevenue.toLocaleString() }}</strong></span
          >
          <span>{{ t('taifa.dashboard.perVote') }}</span>
        </div>
      </RouterLink>

      <!-- Wall of Fame Inductees -->
      <RouterLink
        to="/admin/wall-of-fame"
        class="p-5 rounded-2xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 shadow-sm hover:border-amber-400 transition-all group"
      >
        <div class="flex items-center justify-between text-gray-400 mb-2">
          <span class="text-xs font-bold uppercase tracking-wider">{{ t('taifa.dashboard.fameCard') }}</span>
          <span class="material-icons text-purple-500 group-hover:scale-110 transition-transform">emoji_events</span>
        </div>
        <div class="text-3xl font-black text-gray-900 dark:text-white">
          {{ fameStore.totalInductees }}
        </div>
        <div class="text-[11px] text-gray-500 mt-1">{{ t('taifa.dashboard.fameApproved') }}</div>
      </RouterLink>
    </div>

    <!-- Active "Nani ni Nani" Battle Spotlight Card -->
    <div
      v-if="battle"
      class="p-6 rounded-3xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 shadow-sm"
    >
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100 dark:border-zinc-800 mb-6"
      >
        <div>
          <h2 class="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
            <span class="material-icons text-amber-500">sports_kabaddi</span>
            <span>{{ t('taifa.dashboard.activeBattle') }}</span>
          </h2>
          <p class="text-xs text-gray-500">{{ t('taifa.dashboard.voteFeeNote') }}</p>
        </div>

        <RouterLink
          to="/admin/nani-ni-nani"
          class="px-4 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 text-xs font-bold text-gray-800 dark:text-gray-200 transition-colors inline-flex items-center gap-1.5"
        >
          <span>{{ t('taifa.dashboard.manageBattle') }}</span>
          <span class="material-icons text-sm">tune</span>
        </RouterLink>
      </div>

      <!-- Contestant Matchup Bar -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <!-- Contestant A -->
        <div
          class="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <img
              :src="battle.contestantA.badgeImage"
              class="w-10 h-10 object-contain rounded-full bg-white p-1 shadow-sm"
            />
            <div>
              <div class="font-black text-gray-900 dark:text-white text-sm">
                {{ battle.contestantA.name }}
              </div>
              <div class="text-xs text-blue-700 dark:text-blue-400 font-bold">
                {{ battle.contestantA.universityCode }} ({{ battle.contestantA.university }})
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-lg font-black text-gray-900 dark:text-white">
              {{ battle.contestantA.votes.toLocaleString() }}
            </div>
            <div class="text-xs text-gray-500">{{ naniStore.contestantAPercentage }}%</div>
          </div>
        </div>

        <!-- Contestant B -->
        <div
          class="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <img
              :src="battle.contestantB.badgeImage"
              class="w-10 h-10 object-contain rounded-full bg-white p-1 shadow-sm"
            />
            <div>
              <div class="font-black text-gray-900 dark:text-white text-sm">
                {{ battle.contestantB.name }}
              </div>
              <div class="text-xs text-amber-700 dark:text-amber-400 font-bold">
                {{ battle.contestantB.universityCode }} ({{ battle.contestantB.university }})
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-lg font-black text-gray-900 dark:text-white">
              {{ battle.contestantB.votes.toLocaleString() }}
            </div>
            <div class="text-xs text-gray-500">{{ naniStore.contestantBPercentage }}%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Applications Table with Quick Approve -->
    <div class="bg-white dark:bg-[#18181b] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
      <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800 mb-4">
        <div>
          <h2 class="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
            <span class="material-icons text-blue-500">how_to_reg</span>
            <span>{{ t('taifa.dashboard.recentApps') }}</span>
          </h2>
          <p class="text-xs text-gray-500">{{ t('taifa.dashboard.recentAppsDesc') }}</p>
        </div>

        <RouterLink
          to="/admin/applications"
          class="text-xs font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 flex items-center gap-1"
        >
          <span>{{ t('taifa.dashboard.viewAll') }} ({{ applicationsStore.totalApplications }})</span>
          <span class="material-icons text-sm">arrow_forward</span>
        </RouterLink>
      </div>

      <div class="overflow-x-auto">
        <VaDataTable :columns="recentAppColumns" :items="recentApplications" items-track-by="id">
          <template #cell(applicant)="{ rowData: app }">
            <div class="font-black text-gray-900 dark:text-white text-xs">{{ app.firstName }} {{ app.lastName }}</div>
            <div class="text-[11px] text-gray-400">@{{ app.username }} • {{ app.phone }}</div>
          </template>

          <template #cell(university)="{ rowData: app }">
            <span class="font-medium text-gray-800 dark:text-gray-200 text-xs">{{ app.university }}</span>
          </template>

          <template #cell(fee)="{ rowData: app }">
            <span v-if="app.paymentStatus === 'paid'" class="text-emerald-600 font-bold text-xs">
              ✓ {{ t('taifa.dashboard.paid') }} ({{ app.paymentMethod }})
            </span>
            <span v-else class="text-amber-600 font-semibold text-xs"> ⏳ {{ t('taifa.dashboard.unpaid') }} </span>
          </template>

          <template #cell(status)="{ rowData: app }">
            <span
              v-if="app.status === 'approved'"
              class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold"
            >
              {{ t('taifa.dashboard.statusApproved') }}
            </span>
            <span
              v-else-if="app.status === 'paid_pending_review'"
              class="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold"
            >
              {{ t('taifa.dashboard.statusPendingReview') }}
            </span>
            <span v-else class="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px]">
              {{ app.status }}
            </span>
          </template>

          <template #cell(actions)="{ rowData: app }">
            <button
              v-if="app.status !== 'approved'"
              type="button"
              class="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] transition-all"
              @click="applicationsStore.approveApplication(app.id)"
            >
              {{ t('taifa.dashboard.approveBtn') }}
            </button>
            <span v-else class="text-emerald-600 text-xs font-bold"> {{ t('taifa.dashboard.complete') }} </span>
          </template>
        </VaDataTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { defineVaDataTableColumns } from 'vuestic-ui'
import { useComedianApplicationsStore } from '../../../stores/comedian-applications'
import { useNaniNiNaniStore } from '../../../stores/nani-ni-nani'
import { useWallOfFameStore } from '../../../stores/wall-of-fame'
import { useVoteStatsStore } from '../../../stores/vote-stats'

const { t } = useI18n()
const applicationsStore = useComedianApplicationsStore()
const naniStore = useNaniNiNaniStore()
const fameStore = useWallOfFameStore()
const voteStatsStore = useVoteStatsStore()

const battle = computed(() => naniStore.activeBattle)

// Confirmed payment totals from /payments/vote-stats/ — fall back to the
// battle-derived estimate only while the stats endpoint hasn't answered.
const naniVotes = computed(() => (voteStatsStore.fetchedAt ? voteStatsStore.nani.totals.votes : naniStore.totalVotes))
const naniRevenue = computed(() =>
  voteStatsStore.fetchedAt ? voteStatsStore.nani.totals.revenue : naniStore.voteRevenue,
)

const recentApplications = computed(() => applicationsStore.applications.slice(0, 5))

const recentAppColumns = computed(() =>
  defineVaDataTableColumns([
    { label: t('taifa.dashboard.applicantTh'), key: 'applicant' },
    { label: t('taifa.dashboard.universityTh'), key: 'university' },
    { label: t('taifa.dashboard.feeTh'), key: 'fee' },
    { label: t('taifa.dashboard.statusTh'), key: 'status' },
    { label: ' ', key: 'actions', thAlign: 'right', tdAlign: 'right' },
  ]),
)

onMounted(() => {
  naniStore.fetchActiveBattle()
  applicationsStore.fetchApplicationsFromBackend()
  fameStore.fetchInducteesFromBackend()
  voteStatsStore.fetchVoteStats()
})
</script>
