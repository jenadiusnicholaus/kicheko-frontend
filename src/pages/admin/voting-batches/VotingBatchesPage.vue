<template>
  <div class="space-y-6">
    <div
      class="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#18181b] sm:p-6"
    >
      <div class="flex items-center gap-3.5">
        <div
          class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FEBF01] text-gray-950 shadow-md"
        >
          <span class="material-icons text-2xl">how_to_vote</span>
        </div>
        <div>
          <h1 class="text-xl font-black tracking-tight text-gray-900 dark:text-white sm:text-2xl">
            {{ t('taifa.admin.batches.title') }}
          </h1>
          <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
            {{ t('taifa.admin.batches.subtitle') }}
          </p>
        </div>
      </div>

      <form
        class="grid gap-3 border-t border-gray-100 pt-4 dark:border-zinc-800 sm:grid-cols-[1fr_10rem_auto]"
        @submit.prevent="createNewBatch"
      >
        <label class="sr-only" for="batch-title">{{ t('taifa.admin.batches.titleLabel') }}</label>
        <input
          id="batch-title"
          v-model="newTitle"
          required
          maxlength="120"
          :placeholder="t('taifa.admin.batches.titlePlaceholder')"
          class="min-w-0 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FEBF01] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
        />
        <label class="sr-only" for="batch-level">{{ t('taifa.admin.batches.levelLabel') }}</label>
        <select
          id="batch-level"
          v-model.number="newLevel"
          class="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FEBF01] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
        >
          <option v-for="level in levels" :key="level" :value="level">
            {{ t('taifa.admin.batches.levelValue', { level }) }}
          </option>
        </select>
        <button
          type="submit"
          class="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#FEBF01] px-5 py-2.5 text-xs font-black text-gray-950 shadow-sm transition-colors hover:bg-[#E5AC00]"
        >
          <span class="material-icons text-base">add</span>
          {{ t('taifa.admin.batches.create') }}
        </button>
      </form>
    </div>

    <p
      v-if="errorMessage"
      class="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-300"
    >
      {{ errorMessage }}
    </p>

    <div v-if="batchStore.isLoading && batchStore.batches.length === 0" class="py-16 text-center text-gray-400">
      <span class="material-icons animate-spin text-3xl">sync</span>
    </div>
    <div
      v-else-if="batchStore.batches.length === 0"
      class="rounded-3xl border border-dashed border-gray-300 bg-white py-16 text-center text-gray-500 dark:border-zinc-700 dark:bg-[#18181b] dark:text-gray-400"
    >
      <span class="material-icons mb-2 text-4xl">how_to_vote</span>
      <p class="text-sm font-semibold">{{ t('taifa.admin.batches.empty') }}</p>
    </div>

    <article
      v-for="batch in batchStore.batches"
      :key="batch.id"
      class="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#18181b]"
    >
      <div class="flex flex-col gap-4 border-b border-gray-100 p-5 dark:border-zinc-800 sm:p-6">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex min-w-0 flex-1 items-center gap-3">
            <span class="material-icons text-2xl text-[#B58800]">how_to_vote</span>
            <input
              v-model="titleDrafts[batch.id]"
              maxlength="120"
              :aria-label="t('taifa.admin.batches.titleLabel')"
              class="min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1 text-lg font-black text-gray-900 hover:border-gray-200 focus:border-[#FEBF01] focus:outline-none dark:text-white dark:hover:border-zinc-700"
              @change="saveBatchTitle(batch)"
              @keydown.enter.prevent="saveBatchTitle(batch)"
            />
            <span
              class="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
            >
              {{ t('taifa.admin.batches.levelValue', { level: batch.level }) }}
            </span>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <label class="sr-only" :for="`level-${batch.id}`">{{ t('taifa.admin.batches.levelLabel') }}</label>
            <select
              :id="`level-${batch.id}`"
              :value="batch.level"
              class="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FEBF01] dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-200"
              @change="changeBatchLevel(batch, $event)"
            >
              <option v-for="level in levels" :key="level" :value="level">
                {{ t('taifa.admin.batches.levelValue', { level }) }}
              </option>
            </select>
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black text-white transition-colors"
              :class="batch.votingOpen ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-500 hover:bg-gray-600'"
              @click="setVotingOpen(batch, !batch.votingOpen)"
            >
              <span class="material-icons text-sm">{{ batch.votingOpen ? 'lock_open' : 'lock' }}</span>
              {{ batch.votingOpen ? t('taifa.admin.batches.closeVoting') : t('taifa.admin.batches.openVoting') }}
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-1 rounded-xl border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/40"
              @click="deleteBatch(batch)"
            >
              <span class="material-icons text-sm">delete</span>
              {{ t('taifa.admin.batches.delete') }}
            </button>
          </div>
        </div>

        <p class="text-xs font-semibold text-gray-500 dark:text-gray-400">
          {{ t('taifa.admin.batches.applicantCount', { count: batch.applicantCount }) }}
        </p>
      </div>

      <div class="space-y-6 p-5 sm:p-6">
        <div class="overflow-x-auto rounded-2xl border border-gray-100 dark:border-zinc-800">
          <table class="w-full min-w-[34rem] text-left text-sm">
            <thead
              class="bg-gray-50 text-[11px] font-bold uppercase tracking-wide text-gray-500 dark:bg-zinc-800/70 dark:text-gray-400"
            >
              <tr>
                <th class="w-10 px-4 py-3">
                  <span class="sr-only">{{ t('taifa.admin.batches.selectApplicant') }}</span>
                </th>
                <th class="px-4 py-3">{{ t('taifa.admin.batches.applicant') }}</th>
                <th class="px-4 py-3">{{ t('taifa.admin.batches.university') }}</th>
                <th class="px-4 py-3 text-right">{{ t('taifa.admin.batches.votes') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-zinc-800">
              <tr v-for="app in batchApplicants(batch)" :key="app.id">
                <td class="px-4 py-3">
                  <input
                    type="checkbox"
                    :checked="selectedByBatch[batch.id]?.includes(app.id) || false"
                    :aria-label="t('taifa.admin.batches.selectApplicant')"
                    class="h-4 w-4 accent-[#FEBF01]"
                    @change="toggleSelection(selectedByBatch, batch.id, app.id)"
                  />
                </td>
                <td class="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                  {{ applicantName(app) }}
                </td>
                <td class="px-4 py-3 text-gray-500 dark:text-gray-400">{{ app.university || '—' }}</td>
                <td class="px-4 py-3 text-right font-bold tabular-nums text-gray-900 dark:text-white">
                  {{ app.voteCount.toLocaleString() }}
                </td>
              </tr>
              <tr v-if="batchApplicants(batch).length === 0">
                <td colspan="4" class="px-4 py-6 text-center text-xs text-gray-400">
                  {{ t('taifa.admin.batches.noApplicants') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-800"
            :disabled="!selectedByBatch[batch.id]?.length"
            @click="removeSelected(batch)"
          >
            {{ t('taifa.admin.batches.removeSelected') }}
          </button>
          <label class="sr-only" :for="`promote-${batch.id}`">{{ t('taifa.admin.batches.promoteTo') }}</label>
          <select
            :id="`promote-${batch.id}`"
            v-model.number="promotionTargets[batch.id]"
            class="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-200"
          >
            <option :value="undefined">{{ t('taifa.admin.batches.promoteTo') }}</option>
            <option v-for="target in higherLevelBatches(batch)" :key="target.id" :value="target.id">
              {{ target.title }}
            </option>
          </select>
          <button
            type="button"
            class="rounded-xl bg-[#FEBF01] px-3.5 py-2 text-xs font-black text-gray-950 hover:bg-[#E5AC00] disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="!selectedByBatch[batch.id]?.length || !promotionTargets[batch.id]"
            @click="promoteSelected(batch)"
          >
            {{ t('taifa.admin.batches.promote') }}
          </button>
        </div>

        <div class="rounded-2xl border border-gray-100 p-4 dark:border-zinc-800">
          <h3 class="mb-3 text-sm font-black text-gray-900 dark:text-white">
            {{ t('taifa.admin.batches.addApplicants') }}
          </h3>
          <div class="max-h-64 space-y-2 overflow-y-auto">
            <label
              v-for="app in addableApplicants(batch)"
              :key="app.id"
              class="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800"
            >
              <input
                type="checkbox"
                :checked="addSelectedByBatch[batch.id]?.includes(app.id) || false"
                class="h-4 w-4 accent-[#FEBF01]"
                @change="toggleSelection(addSelectedByBatch, batch.id, app.id)"
              />
              <span class="min-w-0 flex-1 truncate text-xs font-semibold text-gray-800 dark:text-gray-200">
                {{ applicantName(app) }} · {{ app.university || '—' }}
              </span>
              <span v-if="app.batchTitle" class="shrink-0 text-[10px] text-gray-500 dark:text-gray-400">
                {{ t('taifa.admin.batches.currentBatch', { title: app.batchTitle }) }}
              </span>
            </label>
            <p v-if="addableApplicants(batch).length === 0" class="py-3 text-xs text-gray-400">
              {{ t('taifa.admin.batches.noAvailableApplicants') }}
            </p>
          </div>
          <button
            type="button"
            class="mt-3 rounded-xl bg-[#FEBF01] px-4 py-2 text-xs font-black text-gray-950 hover:bg-[#E5AC00] disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="!addSelectedByBatch[batch.id]?.length"
            @click="addSelected(batch)"
          >
            {{ t('taifa.admin.batches.addSelected') }}
          </button>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useComedianApplicationsStore } from '../../../stores/comedian-applications'
import type { ComedianApplication } from '../../../stores/comedian-applications'
import { useVotingBatchesStore } from '../../../stores/voting-batches'
import type { VotingBatch } from '../../../stores/voting-batches'

const { t } = useI18n()
const applicationsStore = useComedianApplicationsStore()
const batchStore = useVotingBatchesStore()
const levels = [2, 3, 4]
const newTitle = ref('')
const newLevel = ref(2)
const errorMessage = ref('')
const titleDrafts = reactive<Record<number, string>>({})
const selectedByBatch = reactive<Record<number, string[]>>({})
const addSelectedByBatch = reactive<Record<number, string[]>>({})
const promotionTargets = reactive<Record<number, number | undefined>>({})

const approvedApplications = computed(() => applicationsStore.applications.filter((app) => app.status === 'approved'))

const applicantName = (app: ComedianApplication) =>
  app.displayName || `${app.firstName} ${app.lastName}`.trim() || app.username

const batchApplicants = (batch: VotingBatch) => applicationsStore.applications.filter((app) => app.batchId === batch.id)

const addableApplicants = (batch: VotingBatch) => approvedApplications.value.filter((app) => app.batchId !== batch.id)

const higherLevelBatches = (batch: VotingBatch) => batchStore.batches.filter((other) => other.level > batch.level)

const toggleSelection = (selections: Record<number, string[]>, batchId: number, id: string) => {
  const ids = selections[batchId] || (selections[batchId] = [])
  const index = ids.indexOf(id)
  if (index === -1) ids.push(id)
  else ids.splice(index, 1)
}

const refreshData = async () => {
  await Promise.all([batchStore.fetchBatches(), applicationsStore.fetchApplicationsFromBackend()])
  batchStore.batches.forEach((batch) => {
    titleDrafts[batch.id] = batch.title
  })
}

const mutateAndRefresh = async (mutation: () => Promise<unknown>) => {
  errorMessage.value = ''
  try {
    await mutation()
    await refreshData()
  } catch {
    errorMessage.value = t('taifa.admin.batches.error')
  }
}

const createNewBatch = async () => {
  const title = newTitle.value.trim()
  if (!title) return
  await mutateAndRefresh(async () => {
    await batchStore.createBatch({ title, level: newLevel.value })
    newTitle.value = ''
  })
}

const saveBatchTitle = async (batch: VotingBatch) => {
  const title = (titleDrafts[batch.id] || '').trim()
  if (!title || title === batch.title) {
    titleDrafts[batch.id] = batch.title
    return
  }
  await mutateAndRefresh(() => batchStore.updateBatch(batch.id, { title }))
}

const changeBatchLevel = async (batch: VotingBatch, event: Event) => {
  const level = Number((event.target as HTMLSelectElement).value)
  await mutateAndRefresh(() => batchStore.updateBatch(batch.id, { level }))
}

const setVotingOpen = async (batch: VotingBatch, votingOpen: boolean) => {
  await mutateAndRefresh(() => batchStore.updateBatch(batch.id, { votingOpen }))
}

const deleteBatch = async (batch: VotingBatch) => {
  if (!window.confirm(t('taifa.admin.batches.deleteConfirm', { title: batch.title }))) return
  await mutateAndRefresh(() => batchStore.deleteBatch(batch.id))
}

const addSelected = async (batch: VotingBatch) => {
  const ids = [...(addSelectedByBatch[batch.id] || [])]
  await mutateAndRefresh(async () => {
    const { skipped } = await batchStore.addApplicants(batch.id, ids)
    if (skipped.length) {
      window.alert(t('taifa.admin.batches.skipped', { count: skipped.length }))
    }
    addSelectedByBatch[batch.id] = []
  })
}

const removeSelected = async (batch: VotingBatch) => {
  const ids = [...(selectedByBatch[batch.id] || [])]
  await mutateAndRefresh(async () => {
    await batchStore.removeApplicants(batch.id, ids)
    selectedByBatch[batch.id] = []
  })
}

const promoteSelected = async (batch: VotingBatch) => {
  const targetId = promotionTargets[batch.id]
  if (!targetId) return
  const ids = [...(selectedByBatch[batch.id] || [])]
  await mutateAndRefresh(async () => {
    const { skipped } = await batchStore.addApplicants(targetId, ids)
    if (skipped.length) {
      window.alert(t('taifa.admin.batches.skipped', { count: skipped.length }))
    }
    selectedByBatch[batch.id] = []
  })
}

onMounted(refreshData)
</script>
