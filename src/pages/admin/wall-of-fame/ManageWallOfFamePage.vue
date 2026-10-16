<template>
  <div class="space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm"
    >
      <div class="flex items-center gap-3.5">
        <div
          class="w-12 h-12 rounded-2xl bg-amber-400 text-gray-950 flex items-center justify-center font-black shadow-md shrink-0"
        >
          <span class="material-icons text-2xl">emoji_events</span>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {{ t('taifa.admin.manageFame.title') }}
            </h1>
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 text-xs font-bold border border-purple-200"
            >
              {{ t('taifa.admin.manageFame.count', { count: fameStore.totalInductees }) }}
            </span>
          </div>
          <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {{ t('taifa.admin.manageFame.subtitle') }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2.5">
        <RouterLink
          to="/wall-of-fame"
          target="_blank"
          class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <span class="material-icons text-base">visibility</span>
          <span>{{ t('taifa.admin.manageFame.viewBtn') }}</span>
          <span class="material-icons text-xs">open_in_new</span>
        </RouterLink>

        <button
          type="button"
          class="px-5 py-2.5 rounded-xl bg-[#FEBF01] hover:bg-[#E5AC00] text-gray-950 text-xs font-black shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
          @click="openAddModal"
        >
          <span class="material-icons text-base">add</span>
          <span>{{ t('taifa.admin.manageFame.addBtn') }}</span>
        </button>
      </div>
    </div>

    <!-- Inductees Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="item in fameStore.inductees"
        :key="item.id"
        class="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all"
      >
        <!-- Top Photo & Crown -->
        <div class="relative w-full aspect-[16/10] bg-slate-900 overflow-hidden">
          <img
            :src="item.photo"
            :alt="item.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

          <!-- Year Badge -->
          <div
            class="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#FEBF01] text-gray-950 font-black text-xs shadow-md"
          >
            {{ t('taifa.admin.manageFame.yearBadge', { year: item.competitionYear }) }}
          </div>

          <!-- Total Votes Badge -->
          <div class="absolute bottom-3 left-3 text-white text-xs font-bold flex items-center gap-1">
            <span class="material-icons text-amber-400 text-sm">star</span>
            <span>{{ t('taifa.admin.manageFame.votesCount', { count: item.totalVotes.toLocaleString() }) }}</span>
          </div>
        </div>

        <!-- Details -->
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div
              class="inline-block px-2.5 py-0.5 rounded-md bg-[#183153] text-white text-[10px] font-black uppercase mb-1.5"
            >
              {{ item.universityCode }}
            </div>
            <h3 class="text-lg font-black text-gray-900 dark:text-white">
              {{ item.name }}
            </h3>
            <p class="text-xs text-gray-400 mb-2">
              {{ item.university }}
            </p>
            <p class="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
              {{ item.bio }}
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-gray-100 dark:border-zinc-800">
            <button
              type="button"
              class="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 text-xs font-bold transition-colors"
              @click="openEditModal(item)"
            >
              {{ t('taifa.admin.editBtn') }}
            </button>
            <button
              type="button"
              class="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
              :title="t('taifa.admin.manageFame.deleteTitle')"
              @click="deleteItem(item.id)"
            >
              <span class="material-icons text-base">delete_outline</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for Adding / Editing Inductee -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        class="w-full max-w-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto"
      >
        <button
          type="button"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          @click="showModal = false"
        >
          <span class="material-icons text-lg">close</span>
        </button>

        <h3 class="text-xl font-black text-gray-900 dark:text-white mb-4">
          {{ isEditing ? t('taifa.admin.manageFame.editTitle') : t('taifa.admin.manageFame.addTitle') }}
        </h3>

        <form class="space-y-4 text-xs" @submit.prevent="saveInductee">
          <div>
            <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
              t('taifa.admin.manageFame.nameLabel')
            }}</label>
            <input
              v-model="modalForm.name"
              type="text"
              required
              class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
                t('taifa.admin.universityTh')
              }}</label>
              <input
                v-model="modalForm.university"
                type="text"
                required
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
                t('taifa.admin.manageFame.codeLabel')
              }}</label>
              <input
                v-model="modalForm.universityCode"
                type="text"
                required
                :placeholder="t('taifa.admin.manageFame.codePlaceholder')"
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
                t('taifa.wall.competitionYear')
              }}</label>
              <input
                v-model.number="modalForm.competitionYear"
                type="number"
                required
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
                t('taifa.wall.totalVotes')
              }}</label>
              <input
                v-model.number="modalForm.totalVotes"
                type="number"
                required
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
              t('taifa.admin.manageFame.bioLabel')
            }}</label>
            <textarea
              v-model="modalForm.bio"
              rows="3"
              required
              class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white"
            ></textarea>
          </div>

          <div>
            <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
              t('taifa.admin.manageFame.quoteLabel')
            }}</label>
            <input
              v-model="modalForm.featuredQuote"
              type="text"
              class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white"
            />
          </div>

          <div class="pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 font-bold"
              @click="showModal = false"
            >
              {{ t('taifa.admin.cancelBtn') }}
            </button>
            <button
              type="submit"
              class="px-5 py-2.5 rounded-xl bg-[#FEBF01] hover:bg-[#E5AC00] text-gray-950 font-black shadow-md cursor-pointer"
            >
              {{ t('taifa.admin.manageFame.saveBtn') }}
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
import { useWallOfFameStore, type WallOfFameInductee } from '../../../stores/wall-of-fame'

const { t } = useI18n()
const fameStore = useWallOfFameStore()

onMounted(() => {
  fameStore.fetchInducteesFromBackend()
})

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref('')

const modalForm = reactive({
  name: '',
  university: '',
  universityCode: '',
  competitionYear: 2026,
  totalVotes: 10000,
  bio: '',
  featuredQuote: '',
  photo: '/taifa/frank_mollel_square.png',
})

const openAddModal = () => {
  isEditing.value = false
  editingId.value = ''
  modalForm.name = ''
  modalForm.university = ''
  modalForm.universityCode = ''
  modalForm.competitionYear = 2026
  modalForm.totalVotes = 10000
  modalForm.bio = ''
  modalForm.featuredQuote = ''
  modalForm.photo = '/taifa/frank_mollel_square.png'
  showModal.value = true
}

const openEditModal = (item: WallOfFameInductee) => {
  isEditing.value = true
  editingId.value = item.id
  modalForm.name = item.name
  modalForm.university = item.university
  modalForm.universityCode = item.universityCode
  modalForm.competitionYear = item.competitionYear
  modalForm.totalVotes = item.totalVotes
  modalForm.bio = item.bio
  modalForm.featuredQuote = item.featuredQuote || ''
  modalForm.photo = item.photo
  showModal.value = true
}

const saveInductee = async () => {
  if (isEditing.value) {
    await fameStore.updateInductee(editingId.value, { ...modalForm })
  } else {
    await fameStore.addInductee({ ...modalForm })
  }
  showModal.value = false
}

const deleteItem = async (id: string) => {
  if (confirm(t('taifa.admin.manageFame.deleteConfirm'))) {
    await fameStore.deleteInductee(id)
  }
}
</script>
