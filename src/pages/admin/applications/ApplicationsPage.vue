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

      <!-- Quick Actions: Vote fee + Open/Close window + Refresh -->
      <div class="flex flex-wrap items-center gap-2">
        <div
          class="flex items-center gap-1.5 pl-3 pr-1 py-1 rounded-xl border border-gray-200 dark:border-zinc-700"
          :title="t('taifa.admin.voteFeeLabel')"
        >
          <span class="text-[11px] font-bold text-gray-500">{{ t('taifa.admin.voteFeeLabel') }}</span>
          <input
            v-model.number="voteFeeInput"
            type="number"
            min="100"
            step="100"
            class="w-20 px-2 py-1.5 rounded-lg bg-gray-50 dark:bg-zinc-800 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FEBF01]"
          />
          <button
            type="button"
            class="px-2.5 py-1.5 rounded-lg bg-[#FEBF01] hover:bg-[#E5AC00] disabled:opacity-40 text-gray-950 text-[11px] font-black"
            :disabled="savingFee || voteFeeInput === applicationsStore.voteFee || voteFeeInput < 100"
            @click="saveVoteFee"
          >
            {{ t('taifa.admin.saveBtn') }}
          </button>
        </div>
        <div
          class="flex items-center gap-1.5 pl-3 pr-1 py-1 rounded-xl border border-gray-200 dark:border-zinc-700"
          :title="t('taifa.admin.appFeeLabel')"
        >
          <span class="text-[11px] font-bold text-gray-500">{{ t('taifa.admin.appFeeLabel') }}</span>
          <input
            v-model.number="appFeeInput"
            type="number"
            min="100"
            step="100"
            class="w-24 px-2 py-1.5 rounded-lg bg-gray-50 dark:bg-zinc-800 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FEBF01]"
          />
          <button
            type="button"
            class="px-2.5 py-1.5 rounded-lg bg-[#FEBF01] hover:bg-[#E5AC00] disabled:opacity-40 text-gray-950 text-[11px] font-black"
            :disabled="savingAppFee || appFeeInput === applicationsStore.applicationFee || appFeeInput < 100"
            @click="saveAppFee"
          >
            {{ t('taifa.admin.saveBtn') }}
          </button>
        </div>
        <button
          type="button"
          class="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          :class="
            applicationsStore.applicationsOpen
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          "
          :disabled="togglingOpen"
          @click="toggleApplicationsOpen"
        >
          <span v-if="togglingOpen" class="material-icons text-base animate-spin">sync</span>
          <span v-else class="material-icons text-base">{{
            applicationsStore.applicationsOpen ? 'lock_open' : 'lock'
          }}</span>
          <span>{{
            applicationsStore.applicationsOpen
              ? t('taifa.admin.applicationsOpenBtn')
              : t('taifa.admin.applicationsClosedBtn')
          }}</span>
        </button>
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

    <!-- Flow Hint -->
    <div
      class="flex items-start gap-2.5 px-4 py-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-300"
    >
      <span class="material-icons text-lg shrink-0 mt-0.5">route</span>
      <p class="text-xs font-medium leading-relaxed">
        {{ t('taifa.admin.flowHint') }}
      </p>
    </div>

    <!-- Filter Tabs & Search -->
    <div
      class="sticky top-0 z-20 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-3.5 shadow-sm dark:border-gray-800 dark:bg-[#18181b] sm:flex-row sm:items-center sm:justify-between"
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
      <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
        <div class="relative w-full sm:w-64">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
            <span class="material-icons text-sm">search</span>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('taifa.admin.searchPlaceholder')"
            class="w-full rounded-xl border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-3 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FEBF01] dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-white"
          />
        </div>
        <div class="w-full sm:w-60">
          <label class="sr-only" for="application-batch-filter">
            {{ t('taifa.admin.batches.filterLabel') }}
          </label>
          <select
            id="application-batch-filter"
            :value="batchFilter"
            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FEBF01] dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-gray-200"
            @change="setBatchFilter"
          >
            <option value="all">{{ t('taifa.admin.batches.filterAll') }}</option>
            <option v-for="batch in votingBatchesStore.batches" :key="batch.id" :value="batch.id">
              {{ batch.title }} ({{ t('taifa.admin.batches.levelValue', { level: batch.level }) }}){{
                batch.votingOpen ? ` ${t('taifa.admin.batches.openSuffix')}` : ''
              }}
            </option>
            <option value="none">{{ t('taifa.admin.batches.filterNone') }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Bulk Level Bar -->
    <div
      v-if="selectedIds.size > 0"
      class="flex flex-wrap items-center gap-3 px-4 py-3 rounded-2xl bg-[#FEBF01]/10 border border-[#FEBF01]/50 shadow-sm"
    >
      <span class="text-xs font-black text-gray-900 dark:text-white">
        {{ t('taifa.admin.bulkSelected', { n: selectedIds.size }) }}
      </span>
      <span class="text-[11px] text-gray-500 dark:text-gray-400">
        {{ t('taifa.admin.bulkHint') }}
      </span>
      <div class="flex flex-wrap items-center gap-2 ml-auto">
        <select
          v-model.number="bulkLevel"
          class="px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FEBF01]"
        >
          <option v-for="n in 4" :key="n" :value="n">{{ t('taifa.admin.levelLabel', { n }) }}</option>
        </select>
        <button
          type="button"
          class="px-4 py-2 rounded-xl bg-[#FEBF01] hover:bg-[#E5AC00] text-gray-950 text-xs font-black shadow-sm transition-colors"
          :disabled="bulkUpdating"
          @click="applyBulkLevel"
        >
          <span v-if="bulkUpdating" class="material-icons text-sm animate-spin align-middle">sync</span>
          {{ bulkUpdating ? t('taifa.admin.bulkUpdating') : t('taifa.admin.bulkApply') }}
        </button>
        <div class="flex flex-wrap items-center gap-2">
          <select
            v-model="batchTarget"
            :aria-label="t('taifa.admin.batches.selectBatch')"
            class="max-w-56 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FEBF01] dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-200"
          >
            <option value="">{{ t('taifa.admin.batches.selectBatch') }}</option>
            <option v-for="batch in votingBatchesStore.batches" :key="batch.id" :value="batch.id">
              {{ batch.title }} ({{ t('taifa.admin.batches.levelValue', { level: batch.level }) }})
            </option>
            <option value="new">{{ t('taifa.admin.batches.newOption') }}</option>
          </select>
          <template v-if="batchTarget === 'new'">
            <label class="sr-only" for="bulk-new-batch-title">
              {{ t('taifa.admin.batches.newBatchTitle') }}
            </label>
            <input
              id="bulk-new-batch-title"
              v-model="newBatchTitle"
              maxlength="120"
              :placeholder="t('taifa.admin.batches.newBatchTitlePlaceholder')"
              class="w-40 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FEBF01] dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-200"
            />
            <label class="sr-only" for="bulk-new-batch-level">
              {{ t('taifa.admin.batches.newBatchLevel') }}
            </label>
            <select
              id="bulk-new-batch-level"
              v-model.number="newBatchLevel"
              class="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FEBF01] dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-200"
            >
              <option v-for="level in [2, 3, 4]" :key="level" :value="level">
                {{ t('taifa.admin.batches.levelValue', { level }) }}
              </option>
            </select>
          </template>
          <button
            type="button"
            class="rounded-xl bg-[#1B2A4A] px-4 py-2 text-xs font-black text-white shadow-sm transition-colors hover:bg-[#263B68] disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="addingToBatch || !validBatchTarget"
            @click="addSelectedToBatch"
          >
            <span v-if="addingToBatch" class="material-icons align-middle text-sm animate-spin">sync</span>
            {{ addingToBatch ? t('taifa.admin.batches.adding') : t('taifa.admin.batches.addToBatch') }}
          </button>
        </div>
        <button
          type="button"
          class="px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 text-xs font-bold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
          @click="selectedIds.clear()"
        >
          {{ t('taifa.admin.bulkClear') }}
        </button>
      </div>
    </div>

    <!-- Applications Table -->
    <div
      class="bg-white dark:bg-[#18181b] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
    >
      <VaDataTable class="applications-table" :columns="appColumns" :items="filteredApplications" items-track-by="id">
        <!-- Select-all checkbox (approved rows only) -->
        <template #header(select)>
          <input
            type="checkbox"
            class="accent-[#FEBF01] cursor-pointer"
            :checked="allApprovedSelected"
            :indeterminate.prop="someApprovedSelected && !allApprovedSelected"
            :title="t('taifa.admin.bulkSelectAll')"
            @change="toggleSelectAll"
          />
        </template>

        <!-- Bulk select -->
        <template #cell(select)="{ rowData: app }">
          <input
            type="checkbox"
            class="accent-[#FEBF01] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            :value="app.id"
            :disabled="app.status !== 'approved'"
            :checked="selectedIds.has(app.id)"
            :title="app.status !== 'approved' ? t('taifa.admin.levelNeedsApproval') : ''"
            @change="toggleSelect(app.id)"
          />
        </template>

        <!-- Name & Username -->
        <template #cell(applicant)="{ rowData: app }">
          <div class="flex items-center gap-3 py-1">
            <div
              class="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 font-black flex items-center justify-center text-sm shadow-sm shrink-0"
            >
              {{ app.firstName.charAt(0) }}{{ app.lastName.charAt(0) }}
            </div>
            <div>
              <div class="font-black text-gray-900 dark:text-white text-sm">{{ app.firstName }} {{ app.lastName }}</div>
              <div class="text-[11px] text-gray-400">@{{ app.username }}</div>
            </div>
          </div>
        </template>

        <!-- University -->
        <template #cell(university)="{ rowData: app }">
          <div class="font-semibold text-gray-800 dark:text-gray-200 text-xs">
            {{ app.university }}
          </div>
        </template>

        <!-- Phone & Date -->
        <template #cell(phone)="{ rowData: app }">
          <div class="font-mono text-gray-800 dark:text-gray-200 text-xs">
            {{ app.phone }}
          </div>
          <div class="text-[11px] text-gray-400">
            {{ app.appliedAt }}
          </div>
        </template>

        <!-- Fee Status -->
        <template #cell(fee)="{ rowData: app }">
          <div v-if="app.paymentStatus === 'paid'" class="flex flex-col">
            <span class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
              <span class="material-icons text-sm">check_circle</span>
              <span>{{ t('taifa.admin.feePaidLabel', { amount: app.amountPaid.toLocaleString() }) }}</span>
            </span>
            <span class="text-[10px] text-gray-400 font-mono"> {{ app.paymentMethod }} • {{ app.paymentRef }} </span>
          </div>
          <div v-else-if="app.paymentStatus === 'underpaid'" class="flex flex-col">
            <span class="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-bold text-xs">
              <span class="material-icons text-sm">error</span>
              <span>{{
                t('taifa.admin.feeUnderpaidLabel', {
                  amount: app.amountPaid.toLocaleString(),
                  fee: app.feeAmount.toLocaleString(),
                })
              }}</span>
            </span>
            <span class="text-[10px] text-gray-400 font-mono"> {{ app.paymentMethod }} • {{ app.paymentRef }} </span>
          </div>
          <div v-else-if="app.paymentStatus === 'processing'" class="flex flex-col">
            <span class="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold text-xs">
              <span class="material-icons text-sm animate-spin">sync</span>
              <span>{{ t('taifa.admin.feeProcessingLabel') }}</span>
            </span>
            <span class="text-[10px] text-gray-400 font-mono">{{ app.paymentRef }}</span>
          </div>
          <div v-else class="flex flex-col">
            <span class="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400 font-bold text-xs">
              <span class="material-icons text-sm">schedule</span>
              <span>{{ t('taifa.admin.feePendingLabel') }}</span>
            </span>
            <span class="text-[10px] text-gray-400">TSh {{ app.feeAmount.toLocaleString() }}</span>
          </div>
        </template>

        <!-- Application Status -->
        <template #cell(status)="{ rowData: app }">
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
        </template>

        <!-- Audition Level + Votes -->
        <template #cell(level)="{ rowData: app }">
          <div class="flex flex-col items-start gap-1.5">
            <div class="flex items-center gap-2">
              <select
                :value="app.auditionLevel"
                :disabled="levelUpdating === app.id || app.status !== 'approved'"
                :title="app.status !== 'approved' ? t('taifa.admin.levelNeedsApproval') : ''"
                class="px-2 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FEBF01] disabled:opacity-40 disabled:cursor-not-allowed"
                @change="changeLevel(app, ($event.target as HTMLSelectElement).value, $event)"
              >
                <option v-for="n in 4" :key="n" :value="n">
                  {{ t('taifa.admin.levelLabel', { n }) }}
                </option>
              </select>
              <span
                v-if="app.auditionLevel >= 2"
                class="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400"
              >
                <span class="material-icons text-xs">how_to_vote</span>
                {{ app.voteCount }}
              </span>
              <span
                v-else
                class="inline-flex items-center gap-0.5 text-[10px] font-bold text-gray-400"
                :title="t('taifa.admin.notOnVoteList')"
              >
                <span class="material-icons text-xs">visibility_off</span>
              </span>
            </div>
            <span
              v-if="app.batchTitle"
              class="block max-w-[12rem] truncate rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
              :title="app.batchTitle"
            >
              {{ app.batchTitle }}
            </span>
            <span v-else-if="app.auditionLevel >= 2" class="text-[10px] font-semibold text-gray-400 dark:text-gray-500">
              {{ t('taifa.admin.batches.noBatchVoteList') }}
            </span>
          </div>
        </template>

        <!-- Actions -->
        <template #cell(actions)="{ rowData: app }">
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
        </template>

        <!-- Empty State -->
        <template #no-data>
          <div class="py-12 text-center text-gray-400">
            <span class="material-icons text-4xl mb-2 text-gray-300">inbox</span>
            <p class="font-bold text-sm">{{ t('taifa.admin.emptyTitle') }}</p>
            <p class="text-xs text-gray-400">{{ t('taifa.admin.emptyDesc') }}</p>
          </div>
        </template>
      </VaDataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { defineVaDataTableColumns } from 'vuestic-ui'
import { useComedianApplicationsStore } from '../../../stores/comedian-applications'
import type { ComedianApplication } from '../../../stores/comedian-applications'
import { useVotingBatchesStore } from '../../../stores/voting-batches'
import type { VotingBatch } from '../../../stores/voting-batches'

const { t } = useI18n()
const applicationsStore = useComedianApplicationsStore()
const votingBatchesStore = useVotingBatchesStore()
const batchFilter = ref<'all' | 'none' | number>('all')
const batchFilterStorageKey = 'kicheko.admin.applications.batchFilter'

const appColumns = computed(() =>
  defineVaDataTableColumns([
    { label: ' ', key: 'select', width: '2.5rem', thAlign: 'center', tdAlign: 'center' },
    { label: t('taifa.admin.applicantTh'), key: 'applicant' },
    { label: t('taifa.admin.universityTh'), key: 'university' },
    { label: t('taifa.admin.phoneTh'), key: 'phone' },
    { label: t('taifa.admin.feeTh'), key: 'fee' },
    { label: t('taifa.admin.statusTh'), key: 'status' },
    { label: t('taifa.admin.levelTh'), key: 'level' },
    { label: ' ', key: 'actions', thAlign: 'right', tdAlign: 'right' },
  ]),
)

const voteFeeInput = ref(applicationsStore.voteFee)
const appFeeInput = ref(applicationsStore.applicationFee)
const savingFee = ref(false)
const savingAppFee = ref(false)

onMounted(async () => {
  applicationsStore.fetchApplicationsFromBackend()
  await votingBatchesStore.fetchBatches()
  restoreBatchFilter()
  await applicationsStore.fetchConfig()
  voteFeeInput.value = applicationsStore.voteFee
  appFeeInput.value = applicationsStore.applicationFee
})

const saveVoteFee = async () => {
  savingFee.value = true
  try {
    await applicationsStore.setVoteFee(voteFeeInput.value)
  } finally {
    voteFeeInput.value = applicationsStore.voteFee
    savingFee.value = false
  }
}

const saveAppFee = async () => {
  savingAppFee.value = true
  try {
    await applicationsStore.setApplicationFee(appFeeInput.value)
  } finally {
    appFeeInput.value = applicationsStore.applicationFee
    savingAppFee.value = false
  }
}

const togglingOpen = ref(false)
const levelUpdating = ref<string | null>(null)

const toggleApplicationsOpen = async () => {
  togglingOpen.value = true
  try {
    await applicationsStore.setApplicationsOpen(!applicationsStore.applicationsOpen)
  } finally {
    togglingOpen.value = false
  }
}

const changeLevel = async (app: ComedianApplication, level: string, event: Event) => {
  if (app.status !== 'approved') {
    alert(t('taifa.admin.levelNeedsApproval'))
    return
  }
  const newLevel = Number(level)
  if (app.batchId && newLevel !== app.auditionLevel) {
    const confirmed = window.confirm(t('taifa.admin.batches.levelChangeConfirm', { title: app.batchTitle || '' }))
    if (!confirmed) {
      const select = event.target as HTMLSelectElement
      select.value = String(app.auditionLevel)
      return
    }
  }
  levelUpdating.value = app.id
  try {
    await applicationsStore.setAuditionLevel(app.id, newLevel)
  } catch {
    await applicationsStore.fetchApplicationsFromBackend()
  } finally {
    levelUpdating.value = null
  }
}

// ── Bulk audition level ───────────────────────────────────────
const selectedIds = ref(new Set<string>())
const bulkLevel = ref(2)
const bulkUpdating = ref(false)
const batchTarget = ref<number | 'new' | ''>('')
const newBatchTitle = ref('')
const newBatchLevel = ref(2)
const addingToBatch = ref(false)

const approvedApplications = computed(() => applicationsStore.applications.filter((a) => a.status === 'approved'))
const validBatchTarget = computed(
  () =>
    selectedIds.value.size > 0 &&
    (batchTarget.value === 'new' ? newBatchTitle.value.trim().length > 0 : typeof batchTarget.value === 'number'),
)

const allApprovedSelected = computed(
  () => approvedApplications.value.length > 0 && approvedApplications.value.every((a) => selectedIds.value.has(a.id)),
)

const someApprovedSelected = computed(() => approvedApplications.value.some((a) => selectedIds.value.has(a.id)))

const toggleSelect = (id: string) => {
  if (selectedIds.value.has(id)) selectedIds.value.delete(id)
  else selectedIds.value.add(id)
}

const toggleSelectAll = () => {
  if (allApprovedSelected.value) {
    approvedApplications.value.forEach((a) => selectedIds.value.delete(a.id))
  } else {
    approvedApplications.value.forEach((a) => selectedIds.value.add(a.id))
  }
}

const applyBulkLevel = async () => {
  bulkUpdating.value = true
  try {
    const { skipped } = await applicationsStore.bulkSetAuditionLevel([...selectedIds.value], bulkLevel.value)
    if (skipped.length > 0) {
      alert(t('taifa.admin.bulkSkipped', { n: skipped.length }))
    }
    selectedIds.value.clear()
  } finally {
    bulkUpdating.value = false
  }
}

const addSelectedToBatch = async () => {
  if (!validBatchTarget.value) return
  addingToBatch.value = true
  try {
    let batchId: number
    let existingBatch: VotingBatch | undefined
    if (batchTarget.value === 'new') {
      const createdBatch = await votingBatchesStore.createBatch({
        title: newBatchTitle.value.trim(),
        level: newBatchLevel.value,
        votingOpen: true,
      })
      batchId = createdBatch.id
    } else if (typeof batchTarget.value === 'number') {
      batchId = batchTarget.value
      existingBatch = votingBatchesStore.batches.find((batch) => batch.id === batchId)
    } else {
      return
    }

    const { skipped } = await votingBatchesStore.addApplicants(batchId, [...selectedIds.value])
    if (skipped.length) {
      window.alert(t('taifa.admin.batches.skipped', { count: skipped.length }))
    }
    if (
      existingBatch &&
      !existingBatch.votingOpen &&
      window.confirm(t('taifa.admin.batches.openVotingNowConfirm', { title: existingBatch.title }))
    ) {
      await votingBatchesStore.updateBatch(batchId, { votingOpen: true })
    }
    await Promise.all([applicationsStore.fetchApplicationsFromBackend(), votingBatchesStore.fetchBatches()])
    selectedIds.value.clear()
    batchTarget.value = ''
    newBatchTitle.value = ''
    newBatchLevel.value = 2
  } finally {
    addingToBatch.value = false
  }
}

const currentFilter = ref<'all' | 'pending_review' | 'approved' | 'rejected'>('all')
const searchQuery = ref('')

const restoreBatchFilter = () => {
  const storedValue = window.localStorage.getItem(batchFilterStorageKey)
  if (storedValue === 'all' || storedValue === 'none') {
    batchFilter.value = storedValue
  } else {
    const storedBatchId = storedValue ? Number(storedValue) : Number.NaN
    const storedBatchExists =
      Number.isSafeInteger(storedBatchId) && votingBatchesStore.batches.some((batch) => batch.id === storedBatchId)

    if (storedBatchExists) {
      batchFilter.value = storedBatchId
    } else {
      const newestOpenBatch = [...votingBatchesStore.batches]
        .filter((batch) => batch.votingOpen)
        .sort((first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt))[0]
      batchFilter.value = newestOpenBatch?.id ?? 'all'
    }
  }
  window.localStorage.setItem(batchFilterStorageKey, String(batchFilter.value))
}

const setBatchFilter = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value
  batchFilter.value = value === 'all' || value === 'none' ? value : Number(value)
  window.localStorage.setItem(batchFilterStorageKey, String(batchFilter.value))
}

watch(
  () => votingBatchesStore.batches.map((batch) => batch.id),
  (batchIds) => {
    if (typeof batchFilter.value === 'number' && !batchIds.includes(batchFilter.value)) {
      batchFilter.value = 'all'
      window.localStorage.setItem(batchFilterStorageKey, 'all')
    }
  },
)

const batchFilteredApplications = computed(() =>
  applicationsStore.applications.filter((app) => {
    if (batchFilter.value === 'none') return app.batchId === null
    if (typeof batchFilter.value === 'number') return app.batchId === batchFilter.value
    return true
  }),
)

const filterTabs = computed(() => [
  { id: 'all' as const, label: t('taifa.admin.all'), count: batchFilteredApplications.value.length },
  {
    id: 'pending_review' as const,
    label: t('taifa.admin.filterPending'),
    count: batchFilteredApplications.value.filter(
      (app) => app.status === 'pending' || app.status === 'paid_pending_review',
    ).length,
  },
  {
    id: 'approved' as const,
    label: t('taifa.admin.filterApproved'),
    count: batchFilteredApplications.value.filter((app) => app.status === 'approved').length,
  },
  {
    id: 'rejected' as const,
    label: t('taifa.admin.filterRejected'),
    count: batchFilteredApplications.value.filter((app) => app.status === 'rejected').length,
  },
])

const filteredApplications = computed(() => {
  return batchFilteredApplications.value.filter((app) => {
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
</script>
