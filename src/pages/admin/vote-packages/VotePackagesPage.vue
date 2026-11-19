<template>
  <div class="space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm"
    >
      <div class="flex items-center gap-3.5 min-w-0">
        <div
          class="w-12 h-12 rounded-2xl bg-[#FEBF01] text-gray-950 flex items-center justify-center font-black shadow-md shrink-0"
        >
          <span class="material-icons text-2xl">inventory_2</span>
        </div>
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <h1 class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {{ t('taifa.admin.votePackages.title') }}
            </h1>
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-400 text-xs font-bold border border-violet-200 dark:border-violet-800"
            >
              {{ t('taifa.admin.votePackages.count', { count: packagesStore.packages.length }) }}
            </span>
          </div>
          <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {{ t('taifa.admin.votePackages.subtitle') }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2.5">
        <button
          type="button"
          class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          @click="packagesStore.fetchPackages()"
        >
          <span class="material-icons text-base">refresh</span>
          <span>{{ t('taifa.admin.refreshBtn') }}</span>
        </button>
        <button
          type="button"
          class="px-5 py-2.5 rounded-xl bg-[#FEBF01] hover:bg-[#E5AC00] text-gray-950 text-xs font-black shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
          @click="openAddModal"
        >
          <span class="material-icons text-base">add</span>
          <span>{{ t('taifa.admin.votePackages.addBtn') }}</span>
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="packagesStore.isLoading" class="flex items-center justify-center py-16">
      <span class="material-icons text-4xl text-[#FEBF01] animate-spin">sync</span>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="packagesStore.packages.length === 0"
      class="py-16 text-center text-gray-400 bg-white dark:bg-[#18181b] rounded-3xl border border-gray-200 dark:border-gray-800"
    >
      <span class="material-icons text-4xl mb-2 text-gray-300">inventory_2</span>
      <p class="font-bold text-sm">{{ t('taifa.admin.votePackages.empty') }}</p>
    </div>

    <!-- Packages Table -->
    <div
      v-else
      class="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden"
    >
      <table class="w-full text-left">
        <thead>
          <tr
            class="text-[10px] font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-zinc-800"
          >
            <th class="px-5 py-3">{{ t('taifa.admin.votePackages.nameLabel') }}</th>
            <th class="px-5 py-3 text-right">{{ t('taifa.admin.votePackages.votesLabel') }}</th>
            <th class="px-5 py-3 text-right">{{ t('taifa.admin.votePackages.priceLabel') }}</th>
            <th class="px-5 py-3">{{ t('taifa.admin.votePackages.appliesToLabel') }}</th>
            <th class="px-5 py-3 text-right">{{ t('taifa.admin.votePackages.sortLabel') }}</th>
            <th class="px-5 py-3">{{ t('taifa.admin.votePackages.statusLabel') }}</th>
            <th class="px-5 py-3 text-right">{{ t('taifa.admin.actionsTh') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-zinc-800">
          <tr v-for="pkg in packagesStore.packages" :key="pkg.id">
            <td class="px-5 py-3 text-sm font-bold text-gray-900 dark:text-white">{{ pkg.name }}</td>
            <td class="px-5 py-3 text-sm font-semibold text-right tabular-nums text-gray-700 dark:text-gray-300">
              {{ pkg.votes.toLocaleString() }}
            </td>
            <td class="px-5 py-3 text-sm font-semibold text-right tabular-nums text-gray-700 dark:text-gray-300">
              TSh {{ pkg.price.toLocaleString() }}
            </td>
            <td class="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">
              {{ appliesToLabel(pkg.applies_to) }}
            </td>
            <td class="px-5 py-3 text-sm text-right tabular-nums text-gray-500 dark:text-gray-400">
              {{ pkg.sort_order }}
            </td>
            <td class="px-5 py-3">
              <span
                class="px-2.5 py-1 rounded-full text-[11px] font-bold"
                :class="
                  pkg.is_active
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400'
                "
              >
                {{
                  pkg.is_active ? t('taifa.admin.categories.statusActive') : t('taifa.admin.categories.statusInactive')
                }}
              </span>
            </td>
            <td class="px-5 py-3">
              <div class="flex items-center justify-end gap-3">
                <button
                  type="button"
                  class="text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1 cursor-pointer"
                  @click="openEditModal(pkg)"
                >
                  <span class="material-icons text-sm">edit</span>
                  <span>{{ t('taifa.admin.editBtn') }}</span>
                </button>
                <button
                  type="button"
                  class="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                  @click="deletePackage(pkg.id)"
                >
                  <span class="material-icons text-sm">delete</span>
                  <span>{{ t('taifa.admin.deleteLabel') }}</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        class="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div class="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
          <h2 class="text-lg font-black text-gray-900 dark:text-white">
            {{ isEditing ? t('taifa.admin.votePackages.editTitle') : t('taifa.admin.votePackages.addTitle') }}
          </h2>
          <button
            type="button"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-white"
            @click="showModal = false"
          >
            <span class="material-icons">close</span>
          </button>
        </div>

        <form class="space-y-4 text-xs" @submit.prevent="savePackage">
          <div>
            <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
              t('taifa.admin.votePackages.nameLabel')
            }}</label>
            <input
              v-model="modalForm.name"
              type="text"
              required
              :placeholder="t('taifa.admin.votePackages.namePlaceholder')"
              class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
                t('taifa.admin.votePackages.votesLabel')
              }}</label>
              <input
                v-model.number="modalForm.votes"
                type="number"
                min="1"
                required
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
                t('taifa.admin.votePackages.priceLabel')
              }}</label>
              <input
                v-model.number="modalForm.price"
                type="number"
                min="100"
                required
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
                t('taifa.admin.votePackages.appliesToLabel')
              }}</label>
              <select
                v-model="modalForm.applies_to"
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white"
              >
                <option value="all">{{ t('taifa.admin.votePackages.appliesAll') }}</option>
                <option value="comedian">{{ t('taifa.admin.votePackages.appliesComedian') }}</option>
                <option value="nani">{{ t('taifa.admin.votePackages.appliesNani') }}</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
                t('taifa.admin.votePackages.sortLabel')
              }}</label>
              <input
                v-model.number="modalForm.sort_order"
                type="number"
                min="0"
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div class="flex items-center gap-2">
            <input
              id="package-active"
              v-model="modalForm.is_active"
              type="checkbox"
              class="rounded text-amber-500 focus:ring-amber-400"
            />
            <label for="package-active" class="font-bold text-gray-700 dark:text-gray-300">{{
              t('taifa.admin.votePackages.activeLabel')
            }}</label>
          </div>

          <p v-if="saveError" class="text-xs font-semibold text-red-600 dark:text-red-400">{{ saveError }}</p>

          <div class="pt-3 flex items-center justify-end gap-2 border-t border-gray-100 dark:border-zinc-800">
            <button
              type="button"
              class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 font-bold cursor-pointer"
              @click="showModal = false"
            >
              {{ t('taifa.admin.cancelBtn') }}
            </button>
            <button
              type="submit"
              :disabled="isSaving"
              class="px-5 py-2.5 rounded-xl bg-[#FEBF01] hover:bg-[#E5AC00] text-gray-950 font-black shadow-md cursor-pointer disabled:opacity-50"
            >
              {{ isSaving ? t('taifa.admin.universities.savingBtn') : t('taifa.admin.universities.saveBtn') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVotePackagesStore, type VotePackage } from '../../../stores/vote-packages'

const { t } = useI18n()
const packagesStore = useVotePackagesStore()

onMounted(() => {
  packagesStore.fetchPackages()
})

const appliesToLabel = (value: VotePackage['applies_to']) =>
  t(
    value === 'comedian'
      ? 'taifa.admin.votePackages.appliesComedian'
      : value === 'nani'
        ? 'taifa.admin.votePackages.appliesNani'
        : 'taifa.admin.votePackages.appliesAll',
  )

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref('')
const isSaving = ref(false)
const saveError = ref('')

const modalForm = reactive({
  name: '',
  votes: 1,
  price: 100,
  applies_to: 'all' as VotePackage['applies_to'],
  sort_order: 0,
  is_active: true,
})

const openAddModal = () => {
  isEditing.value = false
  editingId.value = ''
  modalForm.name = ''
  modalForm.votes = 1
  modalForm.price = 100
  modalForm.applies_to = 'all'
  modalForm.sort_order = 0
  modalForm.is_active = true
  saveError.value = ''
  showModal.value = true
}

const openEditModal = (pkg: VotePackage) => {
  isEditing.value = true
  editingId.value = pkg.id
  modalForm.name = pkg.name
  modalForm.votes = pkg.votes
  modalForm.price = pkg.price
  modalForm.applies_to = pkg.applies_to
  modalForm.sort_order = pkg.sort_order
  modalForm.is_active = pkg.is_active
  saveError.value = ''
  showModal.value = true
}

const savePackage = async () => {
  isSaving.value = true
  saveError.value = ''
  try {
    if (isEditing.value) {
      await packagesStore.updatePackage(editingId.value, { ...modalForm })
    } else {
      await packagesStore.createPackage({ ...modalForm })
    }
    showModal.value = false
  } catch (e: any) {
    const detail = e?.response?.data
    saveError.value =
      detail && typeof detail === 'object'
        ? Object.entries(detail)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
            .join(' ')
        : e?.message || 'Save failed'
  } finally {
    isSaving.value = false
  }
}

const deletePackage = async (id: string) => {
  if (confirm(t('taifa.admin.votePackages.deleteConfirm'))) {
    await packagesStore.deletePackage(id)
  }
}
</script>
