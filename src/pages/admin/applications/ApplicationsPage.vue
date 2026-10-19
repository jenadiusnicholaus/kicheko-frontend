<template>
  <div class="space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm"
    >
      <div class="flex items-center gap-3.5">
        <div
          class="w-12 h-12 rounded-2xl bg-[#FEBF01] text-gray-950 flex items-center justify-center font-black shadow-md shrink-0"
        >
          <span class="material-icons text-2xl">how_to_reg</span>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {{ t('taifa.admin.applicationsTitle') }}
            </h1>
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-800"
            >
              {{ t('taifa.admin.feeBadge') }}
            </span>
          </div>
          <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {{ t('taifa.admin.subtitle') }}
          </p>
        </div>
      </div>

      <!-- Quick Action: Refresh -->
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
          @click="applicationsStore.fetchApplicationsFromBackend()"
        >
          <span class="material-icons text-base">refresh</span>
          <span>{{ t('taifa.admin.refreshBtn') }}</span>
        </button>
      </div>
    </div>

    <!-- Stat Summary Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Applications -->
      <div class="p-5 rounded-2xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 shadow-sm">
        <div class="flex items-center justify-between text-gray-400 mb-2">
          <span class="text-xs font-bold uppercase tracking-wider">{{ t('taifa.admin.totalApps') }}</span>
          <span class="material-icons text-blue-500">assignment</span>
        </div>
        <div class="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
          {{ applicationsStore.totalApplications }}
        </div>
        <span class="text-[11px] text-gray-500">{{ t('taifa.admin.totalAppsDesc') }}</span>
      </div>

      <!-- Paid & Pending Review -->
      <div class="p-5 rounded-2xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 shadow-sm">
        <div class="flex items-center justify-between text-gray-400 mb-2">
          <span class="text-xs font-bold uppercase tracking-wider">{{ t('taifa.admin.pendingApproval') }}</span>
          <span class="material-icons text-amber-500">pending_actions</span>
        </div>
        <div class="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
          {{ applicationsStore.pendingReviewCount }}
        </div>
        <span class="text-[11px] text-gray-500">{{ t('taifa.admin.pendingPaidDesc') }}</span>
      </div>

      <!-- Approved Comedians -->
      <div class="p-5 rounded-2xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 shadow-sm">
        <div class="flex items-center justify-between text-gray-400 mb-2">
          <span class="text-xs font-bold uppercase tracking-wider">{{ t('taifa.admin.confirmedApps') }}</span>
          <span class="material-icons text-emerald-500">check_circle</span>
        </div>
        <div class="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
          {{ applicationsStore.approvedCount }}
        </div>
        <span class="text-[11px] text-gray-500">{{ t('taifa.admin.confirmedDesc') }}</span>
      </div>

      <!-- Total Fee Revenue Collected -->
      <div class="p-5 rounded-2xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 shadow-sm">
        <div class="flex items-center justify-between text-gray-400 mb-2">
          <span class="text-xs font-bold uppercase tracking-wider">{{ t('taifa.admin.feeRevenueTitle') }}</span>
          <span class="material-icons text-[#FEBF01]">payments</span>
        </div>
        <div class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
          TSh {{ applicationsStore.totalFeeRevenue.toLocaleString() }}
        </div>
        <span class="text-[11px] text-gray-500">{{ t('taifa.admin.feeRevenueDesc') }}</span>
      </div>
    </div>

    <!-- Filter Tabs & Search -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#18181b] p-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm"
    >
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
        <button
          v-for="tab in filterTabs"
          :key="tab.id"
          type="button"
          class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer"
          :class="
            currentFilter === tab.id
              ? 'bg-[#FEBF01] text-gray-950 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
          "
          @click="currentFilter = tab.id"
        >
          <span>{{ tab.label }}</span>
          <span
            class="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px]"
            :class="currentFilter === tab.id ? 'bg-black/15' : 'bg-gray-200 dark:bg-zinc-700'"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- Search Input -->
      <div class="relative w-full sm:w-64">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <span class="material-icons text-sm">search</span>
        </span>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="t('taifa.admin.searchPlaceholder')"
          class="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/80 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FEBF01]"
        />
      </div>
    </div>

    <!-- Applications Table -->
    <div
      class="bg-white dark:bg-[#18181b] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr
              class="bg-gray-50/80 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-[11px]"
            >
              <th class="py-3.5 px-4 sm:px-6">{{ t('taifa.admin.applicantTh') }}</th>
              <th class="py-3.5 px-4">{{ t('taifa.admin.universityTh') }}</th>
              <th class="py-3.5 px-4">{{ t('taifa.admin.phoneTh') }}</th>
              <th class="py-3.5 px-4">{{ t('taifa.admin.feeTh') }}</th>
              <th class="py-3.5 px-4">{{ t('taifa.admin.statusTh') }}</th>
              <th class="py-3.5 px-4 sm:px-6 text-right">{{ t('taifa.admin.actionsTh') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-zinc-800 text-gray-700 dark:text-gray-300">
            <tr
              v-for="app in filteredApplications"
              :key="app.id"
              class="hover:bg-gray-50/60 dark:hover:bg-zinc-800/40 transition-colors"
            >
              <!-- Name & Username -->
              <td class="py-4 px-4 sm:px-6">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 font-black flex items-center justify-center text-sm shadow-sm shrink-0"
                  >
                    {{ app.firstName.charAt(0) }}{{ app.lastName.charAt(0) }}
                  </div>
                  <div>
                    <div class="font-black text-gray-900 dark:text-white text-sm">
                      {{ app.firstName }} {{ app.lastName }}
                    </div>
                    <div class="text-[11px] text-gray-400">@{{ app.username }}</div>
                  </div>
                </div>
              </td>

              <!-- University -->
              <td class="py-4 px-4">
                <div class="font-semibold text-gray-800 dark:text-gray-200">
                  {{ app.university }}
                </div>
              </td>

              <!-- Phone & Date -->
              <td class="py-4 px-4">
                <div class="font-mono text-gray-800 dark:text-gray-200">
                  {{ app.phone }}
                </div>
                <div class="text-[11px] text-gray-400">
                  {{ app.appliedAt }}
                </div>
              </td>

              <!-- Fee Status -->
              <td class="py-4 px-4">
                <div v-if="app.paymentStatus === 'paid'" class="flex flex-col">
                  <span class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <span class="material-icons text-sm">check_circle</span>
                    <span>{{ t('taifa.admin.feePaidLabel') }}</span>
                  </span>
                  <span class="text-[10px] text-gray-400 font-mono">
                    {{ app.paymentMethod }} • {{ app.paymentRef }}
                  </span>
                </div>
                <div v-else-if="app.paymentStatus === 'processing'" class="flex flex-col">
                  <span class="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                    <span class="material-icons text-sm animate-spin">sync</span>
                    <span>{{ t('taifa.admin.feeProcessingLabel') }}</span>
                  </span>
                  <span class="text-[10px] text-gray-400 font-mono">{{ app.paymentRef }}</span>
                </div>
                <div v-else class="flex flex-col">
                  <span class="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400 font-bold">
                    <span class="material-icons text-sm">schedule</span>
                    <span>{{ t('taifa.admin.feePendingLabel') }}</span>
                  </span>
                  <span class="text-[10px] text-gray-400">TSh {{ app.feeAmount.toLocaleString() }}</span>
                </div>
              </td>

              <!-- Application Status -->
              <td class="py-4 px-4">
                <span
                  v-if="app.status === 'approved'"
                  class="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 font-bold text-[11px] inline-flex items-center gap-1"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {{ t('taifa.dashboard.statusApproved') }}
                </span>
                <span
                  v-else-if="app.status === 'pending' || app.status === 'paid_pending_review'"
                  class="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 font-bold text-[11px] inline-flex items-center gap-1"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  {{ t('taifa.admin.statusPendingAdmin') }}
                </span>
                <span
                  v-else-if="app.status === 'pending_payment'"
                  class="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 font-bold text-[11px]"
                >
                  {{ t('taifa.admin.statusPendingFee') }}
                </span>
                <span
                  v-else-if="app.status === 'rejected'"
                  class="px-2.5 py-1 rounded-full bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400 font-bold text-[11px]"
                >
                  {{ t('taifa.admin.statusRejected') }}
                </span>
              </td>

              <!-- Actions -->
              <td class="py-4 px-4 sm:px-6 text-right">
                <div class="flex items-center justify-end gap-1.5 flex-wrap">
                  <!-- Approve Button -->
                  <button
                    v-if="app.status !== 'approved'"
                    type="button"
                    class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1 shadow-sm transition-all"
                    :title="t('taifa.admin.approveBtn')"
                    @click="confirmApp(app.id)"
                  >
                    <span class="material-icons text-sm">verified</span>
                    <span>{{ t('taifa.admin.approveBtn') }}</span>
                  </button>

                  <!-- Send Credentials Button (approved only) -->
                  <button
                    v-if="app.status === 'approved'"
                    type="button"
                    class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center gap-1 shadow-sm transition-all"
                    :title="t('taifa.admin.sendCredBtn')"
                    @click="openCredentials(app)"
                  >
                    <span class="material-icons text-sm">send</span>
                    <span>{{ t('taifa.admin.sendCredBtn') }}</span>
                  </button>

                  <!-- Reject Button -->
                  <button
                    v-if="app.status !== 'rejected'"
                    type="button"
                    class="px-2.5 py-1.5 rounded-xl border border-red-200 dark:border-red-900/60 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-bold transition-all"
                    :title="t('taifa.admin.rejectBtn')"
                    @click="rejectApp(app.id)"
                  >
                    {{ t('taifa.admin.rejectBtn') }}
                  </button>

                  <!-- Delete -->
                  <button
                    type="button"
                    class="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                    :title="t('taifa.admin.deleteBtn')"
                    @click="deleteApp(app.id)"
                  >
                    <span class="material-icons text-base">delete_outline</span>
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredApplications.length === 0">
              <td colspan="6" class="py-12 text-center text-gray-400">
                <span class="material-icons text-4xl mb-2 text-gray-300">inbox</span>
                <p class="font-bold text-sm">{{ t('taifa.admin.emptyTitle') }}</p>
                <p class="text-xs text-gray-400">{{ t('taifa.admin.emptyDesc') }}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ───── Send Credentials Modal ───── -->
    <div
      v-if="credModal.show"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="credModal.show = false"
    >
      <div
        class="w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-7"
      >
        <!-- Modal Header -->
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow">
            <span class="material-icons text-xl">vpn_key</span>
          </div>
          <div>
            <h2 class="text-base font-black text-gray-900 dark:text-white">
              {{ t('taifa.admin.credModalTitle') }}
            </h2>
            <p class="text-xs text-gray-500">{{ credModal.app?.firstName }} {{ credModal.app?.lastName }}</p>
          </div>
          <button type="button" class="ml-auto p-1 text-gray-400 hover:text-gray-600" @click="credModal.show = false">
            <span class="material-icons">close</span>
          </button>
        </div>

        <!-- Credentials Card -->
        <div class="bg-gray-50 dark:bg-zinc-800 rounded-2xl p-4 space-y-3 mb-5 font-mono text-sm">
          <div class="flex justify-between items-center">
            <span class="text-gray-500 text-xs font-sans font-bold uppercase tracking-wide">{{
              t('taifa.admin.credUsername')
            }}</span>
            <span class="font-bold text-gray-900 dark:text-white">{{ credModal.app?.username }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500 text-xs font-sans font-bold uppercase tracking-wide">{{
              t('taifa.admin.credPassword')
            }}</span>
            <span class="font-bold text-emerald-600 dark:text-emerald-400">{{ credModal.tempPassword || '—' }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500 text-xs font-sans font-bold uppercase tracking-wide">{{
              t('taifa.admin.credPhone')
            }}</span>
            <span class="font-bold text-gray-900 dark:text-white">{{ credModal.app?.phone }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500 text-xs font-sans font-bold uppercase tracking-wide">{{
              t('taifa.admin.credStatus')
            }}</span>
            <span
              :class="credModal.sent ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-amber-600 font-bold'"
            >
              {{ credModal.sent ? t('taifa.admin.credSent') : t('taifa.admin.credNotSent') }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col gap-2.5">
          <button
            type="button"
            class="w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow transition-all"
            :class="
              credModal.sent && !credModal.sending
                ? 'bg-emerald-600 text-white'
                : 'bg-[#FEBF01] hover:bg-[#E5AC00] text-gray-950'
            "
            :disabled="credModal.sending"
            @click="doSendCredentials"
          >
            <span v-if="credModal.sending" class="material-icons animate-spin text-base">sync</span>
            <span v-else-if="credModal.sent" class="material-icons text-base">check_circle</span>
            <span v-else class="material-icons text-base">mark_email_read</span>
            <span>{{
              credModal.sending
                ? t('taifa.admin.credSending')
                : credModal.sent
                  ? t('taifa.admin.credSent')
                  : t('taifa.admin.credSendBtn')
            }}</span>
          </button>
          <button
            type="button"
            class="w-full py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            @click="copyCredentials"
          >
            <span class="material-icons text-sm align-middle mr-1">content_copy</span>
            {{ t('taifa.admin.credCopyBtn') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useComedianApplicationsStore } from '../../../stores/comedian-applications'
import type { ComedianApplication } from '../../../stores/comedian-applications'

const { t } = useI18n()
const applicationsStore = useComedianApplicationsStore()

onMounted(() => {
  applicationsStore.fetchApplicationsFromBackend()
})

const currentFilter = ref<'all' | 'pending_review' | 'approved' | 'rejected'>('all')
const searchQuery = ref('')

const filterTabs = computed(() => [
  { id: 'all' as const, label: t('taifa.admin.all'), count: applicationsStore.totalApplications },
  { id: 'pending_review' as const, label: t('taifa.admin.filterPending'), count: applicationsStore.pendingReviewCount },
  { id: 'approved' as const, label: t('taifa.admin.filterApproved'), count: applicationsStore.approvedCount },
  { id: 'rejected' as const, label: t('taifa.admin.filterRejected'), count: applicationsStore.rejectedCount },
])

const filteredApplications = computed(() => {
  return applicationsStore.applications.filter((app) => {
    if (currentFilter.value === 'pending_review' && app.status !== 'pending' && app.status !== 'paid_pending_review')
      return false
    if (currentFilter.value === 'approved' && app.status !== 'approved') return false
    if (currentFilter.value === 'rejected' && app.status !== 'rejected') return false

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match =
        app.firstName.toLowerCase().includes(q) ||
        app.lastName.toLowerCase().includes(q) ||
        app.username.toLowerCase().includes(q) ||
        app.university.toLowerCase().includes(q) ||
        app.phone.includes(q)
      if (!match) return false
    }
    return true
  })
})

const confirmApp = (id: string) => {
  applicationsStore.approveApplication(id)
}

const rejectApp = (id: string) => {
  applicationsStore.rejectApplication(id)
}

const deleteApp = async (id: string) => {
  if (confirm(t('taifa.admin.deleteConfirm'))) {
    await applicationsStore.deleteApplication(id)
  }
}

// ── Credentials Modal ──────────────────────────────────────────
interface CredModal {
  show: boolean
  app: ComedianApplication | null
  tempPassword: string
  sent: boolean
  sending: boolean
}

const credModal = reactive<CredModal>({
  show: false,
  app: null,
  tempPassword: '',
  sent: false,
  sending: false,
})

const openCredentials = (app: ComedianApplication) => {
  credModal.app = app
  credModal.tempPassword = app.tempPassword || ''
  credModal.sent = !!app.tempPassword
  credModal.sending = false
  credModal.show = true
}

const doSendCredentials = async () => {
  if (!credModal.app) return
  credModal.sending = true
  try {
    const result = await applicationsStore.sendCredentials(credModal.app.id)
    if (result?.temp_password) {
      credModal.tempPassword = result.temp_password
    }
    credModal.sent = true
  } finally {
    credModal.sending = false
  }
}

const copyCredentials = () => {
  if (!credModal.app) return
  const text = [
    t('taifa.admin.credMsgGreeting', { name: credModal.app.firstName }),
    t('taifa.admin.credMsgApproved'),
    t('taifa.admin.credMsgUsername', { username: credModal.app.username }),
    t('taifa.admin.credMsgPassword', {
      password: credModal.tempPassword || t('taifa.admin.credMsgSendFirst'),
    }),
    t('taifa.admin.credMsgPhone', { phone: credModal.app.phone }),
  ].join('\n')
  navigator.clipboard.writeText(text).catch(() => {})
}
</script>
