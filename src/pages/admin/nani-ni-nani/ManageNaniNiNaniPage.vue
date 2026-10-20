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
          <span class="material-icons text-2xl">sports_kabaddi</span>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {{ t('taifa.admin.nani.title') }}
            </h1>
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-800"
            >
              {{ t('taifa.admin.nani.battlesCount', { count: naniStore.battles.length }) }}
            </span>
          </div>
          <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {{ t('taifa.admin.nani.subtitle') }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2.5">
        <RouterLink
          to="/nani-ni-nani"
          target="_blank"
          class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <span class="material-icons text-base">visibility</span>
          <span>{{ t('taifa.admin.nani.viewBtn') }}</span>
          <span class="material-icons text-xs">open_in_new</span>
        </RouterLink>

        <button
          type="button"
          class="px-5 py-2.5 rounded-xl bg-[#FEBF01] hover:bg-[#E5AC00] text-gray-950 text-xs font-black shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
          @click="openAddModal"
        >
          <span class="material-icons text-base">add</span>
          <span>{{ t('taifa.admin.nani.newBattleBtn') }}</span>
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="naniStore.isLoading" class="flex items-center justify-center py-16">
      <span class="material-icons text-4xl text-[#FEBF01] animate-spin">sync</span>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="naniStore.battles.length === 0"
      class="py-16 text-center text-gray-400 bg-white dark:bg-[#18181b] rounded-3xl border border-gray-200 dark:border-gray-800"
    >
      <span class="material-icons text-4xl mb-2 text-gray-300">sports_kabaddi</span>
      <p class="font-bold text-sm">{{ t('taifa.admin.nani.emptyBattles') }}</p>
    </div>

    <!-- Battles Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="b in naniStore.battles"
        :key="b.id"
        class="bg-white dark:bg-[#18181b] border rounded-3xl shadow-sm overflow-hidden flex flex-col transition-all"
        :class="
          b.status === 'active' ? 'border-emerald-300 dark:border-emerald-800' : 'border-gray-200 dark:border-gray-800'
        "
      >
        <div class="p-5 flex-1 flex flex-col gap-3">
          <!-- Title + status -->
          <div class="flex items-start justify-between gap-2">
            <div>
              <h3 class="font-black text-gray-900 dark:text-white">{{ b.title }}</h3>
              <p class="text-[11px] text-gray-400 font-semibold mt-0.5">
                {{ t('taifa.admin.nani.roundLabel') }} {{ b.roundNumber }}
                <span v-if="b.categoryName"> • {{ b.categoryName }}</span>
              </p>
            </div>
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0" :class="statusBadgeClass(b.status)">
              {{ statusLabel(b.status) }}
            </span>
          </div>

          <!-- Contestants -->
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900">
              <div class="flex items-center gap-2">
                <img
                  v-if="b.contestantA.photo"
                  :src="b.contestantA.photo"
                  class="w-8 h-8 rounded-full object-cover bg-white"
                />
                <div class="min-w-0">
                  <div class="font-black text-gray-900 dark:text-white truncate">{{ b.contestantA.name }}</div>
                  <div class="text-[10px] text-blue-700 dark:text-blue-400 font-bold">
                    {{ b.contestantA.universityCode }}
                  </div>
                </div>
              </div>
              <div class="mt-1.5 font-black text-gray-700 dark:text-gray-300">
                {{ b.contestantA.votes.toLocaleString() }} {{ t('taifa.nani.votes') }}
              </div>
            </div>
            <div
              class="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900"
            >
              <div class="flex items-center gap-2">
                <img
                  v-if="b.contestantB.photo"
                  :src="b.contestantB.photo"
                  class="w-8 h-8 rounded-full object-cover bg-white"
                />
                <div class="min-w-0">
                  <div class="font-black text-gray-900 dark:text-white truncate">{{ b.contestantB.name }}</div>
                  <div class="text-[10px] text-amber-700 dark:text-amber-400 font-bold">
                    {{ b.contestantB.universityCode }}
                  </div>
                </div>
              </div>
              <div class="mt-1.5 font-black text-gray-700 dark:text-gray-300">
                {{ b.contestantB.votes.toLocaleString() }} {{ t('taifa.nani.votes') }}
              </div>
            </div>
          </div>

          <div class="text-[11px] text-gray-400 font-semibold">
            {{ t('taifa.admin.nani.feeLabel') }}: TSh {{ b.voteFee.toLocaleString() }}
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-zinc-800">
          <button
            v-if="b.status !== 'active'"
            type="button"
            class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] transition-all"
            @click="activateBattle(b.id)"
          >
            {{ t('taifa.admin.nani.activateBtn') }}
          </button>
          <span v-else class="text-emerald-600 text-[11px] font-black inline-flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {{ t('taifa.dashboard.liveOnline') }}
          </span>

          <div class="flex items-center gap-1.5">
            <button
              type="button"
              class="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 text-xs font-bold transition-colors"
              @click="openEditModal(b)"
            >
              {{ t('taifa.admin.editBtn') }}
            </button>
            <button
              type="button"
              class="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
              :title="t('taifa.admin.deleteLabel')"
              @click="deleteBattle(b.id)"
            >
              <span class="material-icons text-base">delete_outline</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create / Edit Battle Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        class="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto"
      >
        <button
          type="button"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          @click="showModal = false"
        >
          <span class="material-icons text-lg">close</span>
        </button>

        <h3 class="text-xl font-black text-gray-900 dark:text-white mb-4">
          {{ isEditing ? t('taifa.admin.nani.editBattleTitle') : t('taifa.admin.nani.newBattleTitle') }}
        </h3>

        <form class="space-y-4 text-xs" @submit.prevent="saveBattle">
          <!-- Battle meta -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="sm:col-span-2">
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
                t('taifa.admin.nani.titleLabel')
              }}</label>
              <input
                v-model="form.title"
                type="text"
                required
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
                t('taifa.admin.nani.roundLabel')
              }}</label>
              <input
                v-model.number="form.roundNumber"
                type="number"
                min="1"
                required
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
                t('taifa.admin.nani.feeLabel')
              }}</label>
              <input
                value="TSh 1,000"
                type="text"
                readonly
                disabled
                :title="t('taifa.admin.nani.feeFixed')"
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 font-mono cursor-not-allowed"
              />
            </div>
            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
                t('taifa.admin.nani.categoryLabel')
              }}</label>
              <select
                v-model="form.category"
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white"
              >
                <option value="">{{ t('taifa.admin.nani.categoryNone') }}</option>
                <option v-for="c in typesStore.types" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
                t('taifa.admin.nani.statusLabel')
              }}</label>
              <select
                v-model="form.status"
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white"
              >
                <option value="draft">{{ t('taifa.admin.nani.statusDraft') }}</option>
                <option value="active">{{ t('taifa.admin.nani.statusActive') }}</option>
                <option value="ended">{{ t('taifa.admin.nani.statusEnded') }}</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
                t('taifa.admin.nani.themeColorLabel')
              }}</label>
              <div class="flex items-center gap-2.5">
                <input
                  v-model="form.themeColor"
                  type="color"
                  class="w-12 h-10 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 cursor-pointer p-1"
                />
                <input
                  v-model="form.themeColor"
                  type="text"
                  maxlength="7"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white font-mono"
                />
              </div>
            </div>
          </div>

          <!-- Contestant A -->
          <div
            class="p-4 rounded-2xl border border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 space-y-3"
          >
            <h4 class="font-black text-blue-800 dark:text-blue-300 text-xs uppercase tracking-wide">
              {{ t('taifa.admin.nani.contestantATitle') }}
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
                  t('taifa.admin.nani.nameLabel')
                }}</label>
                <input
                  v-model="form.contestantA.name"
                  type="text"
                  required
                  class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
                  t('taifa.admin.nani.initialVotesLabel')
                }}</label>
                <input
                  v-model.number="form.contestantA.votes"
                  type="number"
                  min="0"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white font-mono"
                />
              </div>
              <div class="sm:col-span-2">
                <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
                  t('taifa.admin.universityTh')
                }}</label>
                <select
                  v-model="form.contestantA.universityCode"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                  @change="onUniChange('contestantA')"
                >
                  <option value="">{{ t('taifa.register.selectUniversity') }}</option>
                  <option v-for="u in uniOptions('contestantA')" :key="u.id" :value="u.code">
                    {{ u.code }} — {{ u.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
                  t('taifa.admin.manageFame.photoLabel')
                }}</label>
                <input
                  type="file"
                  accept="image/*"
                  class="w-full text-xs file:mr-2 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-[#FEBF01] file:text-gray-950 file:font-black file:text-[11px] file:cursor-pointer"
                  @change="(e) => onFileChange(e, 'contestantAPhoto')"
                />
              </div>
              <div>
                <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
                  t('taifa.admin.nani.videoUrlLabel')
                }}</label>
                <input
                  v-model="form.contestantA.videoUrl"
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white font-mono"
                />
              </div>
            </div>
          </div>

          <!-- Contestant B -->
          <div
            class="p-4 rounded-2xl border border-amber-100 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 space-y-3"
          >
            <h4 class="font-black text-amber-800 dark:text-amber-300 text-xs uppercase tracking-wide">
              {{ t('taifa.admin.nani.contestantBTitle') }}
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
                  t('taifa.admin.nani.nameLabel')
                }}</label>
                <input
                  v-model="form.contestantB.name"
                  type="text"
                  required
                  class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
                  t('taifa.admin.nani.initialVotesLabel')
                }}</label>
                <input
                  v-model.number="form.contestantB.votes"
                  type="number"
                  min="0"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white font-mono"
                />
              </div>
              <div class="sm:col-span-2">
                <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
                  t('taifa.admin.universityTh')
                }}</label>
                <select
                  v-model="form.contestantB.universityCode"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                  @change="onUniChange('contestantB')"
                >
                  <option value="">{{ t('taifa.register.selectUniversity') }}</option>
                  <option v-for="u in uniOptions('contestantB')" :key="u.id" :value="u.code">
                    {{ u.code }} — {{ u.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
                  t('taifa.admin.manageFame.photoLabel')
                }}</label>
                <input
                  type="file"
                  accept="image/*"
                  class="w-full text-xs file:mr-2 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-[#FEBF01] file:text-gray-950 file:font-black file:text-[11px] file:cursor-pointer"
                  @change="(e) => onFileChange(e, 'contestantBPhoto')"
                />
              </div>
              <div>
                <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
                  t('taifa.admin.nani.videoUrlLabel')
                }}</label>
                <input
                  v-model="form.contestantB.videoUrl"
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white font-mono"
                />
              </div>
            </div>
          </div>

          <p v-if="saveError" class="text-xs font-semibold text-red-600 dark:text-red-400">{{ saveError }}</p>

          <div class="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 font-bold"
              @click="showModal = false"
            >
              {{ t('taifa.admin.cancelBtn') }}
            </button>
            <button
              type="submit"
              :disabled="isSaving"
              class="px-5 py-2.5 rounded-xl bg-[#FEBF01] hover:bg-[#E5AC00] text-gray-950 font-black shadow-md cursor-pointer disabled:opacity-60 flex items-center gap-2"
            >
              <span v-if="isSaving" class="material-icons animate-spin text-base">sync</span>
              {{ isSaving ? t('taifa.admin.universities.savingBtn') : t('taifa.admin.manageFame.saveBtn') }}
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
import { useNaniNiNaniStore, type BattleRound, type BattleImageFiles } from '../../../stores/nani-ni-nani'
import { useEntertainmentTypesStore } from '../../../stores/entertainment-types'
import { useUniversitiesStore } from '../../../stores/universities'
import { compressImage } from '../../../utils/image'

const { t } = useI18n()
const naniStore = useNaniNiNaniStore()
const typesStore = useEntertainmentTypesStore()
const uniStore = useUniversitiesStore()

onMounted(() => {
  naniStore.fetchBattles()
  typesStore.fetchTypes()
  uniStore.fetchUniversities()
})

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref('')
const isSaving = ref(false)
const saveError = ref('')

const emptyContestant = () => ({
  id: '',
  name: '',
  university: '',
  universityCode: '',
  badgeImage: '',
  photo: '',
  videoUrl: '',
  votes: 0,
})

const form = reactive({
  title: '',
  roundNumber: 1,
  voteFee: 1000,
  themeColor: '#FEBF01',
  status: 'draft' as 'draft' | 'active' | 'ended',
  category: '',
  contestantA: emptyContestant(),
  contestantB: emptyContestant(),
})

const files = reactive<BattleImageFiles>({
  contestantABadge: undefined,
  contestantAPhoto: undefined,
  contestantBBadge: undefined,
  contestantBPhoto: undefined,
})

const onFileChange = async (e: Event, key: keyof BattleImageFiles) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  files[key] = file ? await compressImage(file) : undefined
}

const onUniChange = (side: 'contestantA' | 'contestantB') => {
  const u = uniStore.universities.find((u) => u.code === form[side].universityCode)
  if (u) form[side].university = u.name
}

/** University options plus the current value so existing battles still display/save. */
const uniOptions = (side: 'contestantA' | 'contestantB') => {
  const code = form[side].universityCode
  const list = uniStore.universities
  if (!code || list.some((u) => u.code === code)) return list
  return [{ id: code, code, name: form[side].university || code, badge: '', location: '', is_active: true }, ...list]
}

const openAddModal = () => {
  isEditing.value = false
  editingId.value = ''
  form.title = ''
  form.roundNumber = naniStore.battles.length + 1
  form.voteFee = 1000
  form.themeColor = '#FEBF01'
  form.status = 'draft'
  form.category = ''
  form.contestantA = emptyContestant()
  form.contestantB = emptyContestant()
  Object.keys(files).forEach((k) => (files[k as keyof BattleImageFiles] = undefined))
  saveError.value = ''
  showModal.value = true
}

const openEditModal = (b: BattleRound) => {
  isEditing.value = true
  editingId.value = b.id
  form.title = b.title
  form.roundNumber = b.roundNumber
  form.voteFee = b.voteFee
  form.themeColor = b.themeColor || '#FEBF01'
  form.status = b.status
  form.category = b.category || ''
  form.contestantA = { ...b.contestantA }
  form.contestantB = { ...b.contestantB }
  Object.keys(files).forEach((k) => (files[k as keyof BattleImageFiles] = undefined))
  saveError.value = ''
  showModal.value = true
}

const saveBattle = async () => {
  isSaving.value = true
  saveError.value = ''
  try {
    const payload = {
      title: form.title,
      roundNumber: form.roundNumber,
      voteFee: form.voteFee,
      themeColor: form.themeColor,
      status: form.status,
      category: form.category || null,
      contestantA: { ...form.contestantA },
      contestantB: { ...form.contestantB },
    }
    if (isEditing.value) {
      await naniStore.updateBattle(editingId.value, payload, files)
    } else {
      await naniStore.createBattle(payload, files)
    }
    showModal.value = false
  } catch (e: any) {
    const detail = e?.response?.data
    if (detail && typeof detail === 'object') {
      saveError.value = Object.entries(detail)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
        .join(' ')
    } else {
      saveError.value = e?.message || 'Save failed'
    }
  } finally {
    isSaving.value = false
  }
}

const activateBattle = async (id: string) => {
  await naniStore.updateBattle(id, { status: 'active' })
}

const deleteBattle = async (id: string) => {
  if (confirm(t('taifa.admin.nani.deleteBattleConfirm'))) {
    await naniStore.deleteBattle(id)
  }
}

const statusBadgeClass = (status: string) =>
  status === 'active'
    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
    : status === 'ended'
      ? 'bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-gray-400'
      : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'

const statusLabel = (status: string) =>
  status === 'active'
    ? t('taifa.admin.nani.statusActive')
    : status === 'ended'
      ? t('taifa.admin.nani.statusEnded')
      : t('taifa.admin.nani.statusDraft')
</script>
