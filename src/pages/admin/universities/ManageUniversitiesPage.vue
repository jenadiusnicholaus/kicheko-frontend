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
          <span class="material-icons text-2xl">school</span>
        </div>
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <h1 class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {{ t('taifa.admin.universities.title') }}
            </h1>
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-800"
            >
              {{ t('taifa.admin.universities.count', { count: uniStore.totalUniversities }) }}
            </span>
          </div>
          <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {{ t('taifa.admin.universities.subtitle') }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2.5">
        <button
          type="button"
          class="px-5 py-2.5 rounded-xl bg-[#FEBF01] hover:bg-[#E5AC00] text-gray-950 text-xs font-black shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
          @click="openAddModal"
        >
          <span class="material-icons text-base">add</span>
          <span>{{ t('taifa.admin.universities.addBtn') }}</span>
        </button>
      </div>
    </div>

    <!-- Universities Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div
        v-for="uni in uniStore.universities"
        :key="uni.id"
        class="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
      >
        <div>
          <div class="flex items-start justify-between gap-3 mb-4">
            <div
              class="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 p-2 flex items-center justify-center shrink-0"
            >
              <img :src="uni.badge || '/taifa/udsm_badge.png'" :alt="uni.code" class="w-full h-full object-contain" />
            </div>
            <span
              class="px-2.5 py-1 rounded-full text-[11px] font-bold"
              :class="
                uni.is_active
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400'
              "
            >
              {{
                uni.is_active
                  ? t('taifa.admin.universities.statusActive')
                  : t('taifa.admin.universities.statusInactive')
              }}
            </span>
          </div>

          <div
            class="inline-block px-2.5 py-0.5 rounded-md bg-[#183153] text-white text-[10px] font-black uppercase tracking-wider mb-1.5"
          >
            {{ uni.code }}
          </div>
          <h3 class="text-base font-black text-gray-900 dark:text-white leading-snug break-words">
            {{ uni.name }}
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
            <span class="material-icons text-xs">place</span>
            <span>{{ uni.location || 'Tanzania' }}</span>
          </p>
        </div>

        <div class="mt-5 pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between gap-2">
          <button
            type="button"
            class="text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1 cursor-pointer"
            @click="openEditModal(uni)"
          >
            <span class="material-icons text-sm">edit</span>
            <span>{{ t('taifa.admin.editBtn') }}</span>
          </button>

          <button
            type="button"
            class="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
            @click="deleteUni(uni.id)"
          >
            <span class="material-icons text-sm">delete</span>
            <span>{{ t('taifa.admin.deleteLabel') }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        class="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div class="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
          <h2 class="text-lg font-black text-gray-900 dark:text-white">
            {{ isEditing ? t('taifa.admin.universities.editTitle') : t('taifa.admin.universities.addTitle') }}
          </h2>
          <button
            type="button"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-white"
            @click="showModal = false"
          >
            <span class="material-icons">close</span>
          </button>
        </div>

        <form class="space-y-4 text-xs" @submit.prevent="saveUniversity">
          <div>
            <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
              t('taifa.admin.universities.nameLabel')
            }}</label>
            <input
              v-model="modalForm.name"
              type="text"
              required
              :placeholder="t('taifa.admin.universities.namePlaceholder')"
              class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
                t('taifa.admin.universities.codeLabel')
              }}</label>
              <input
                v-model="modalForm.code"
                type="text"
                required
                :placeholder="t('taifa.admin.universities.codePlaceholder')"
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white uppercase font-mono"
              />
            </div>
            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
                t('taifa.admin.universities.locationLabel')
              }}</label>
              <input
                v-model="modalForm.location"
                type="text"
                :placeholder="t('taifa.admin.universities.locationPlaceholder')"
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
              t('taifa.admin.universities.badgeLabel')
            }}</label>
            <input
              v-model="modalForm.badge"
              type="text"
              placeholder="/taifa/udsm_badge.png"
              class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white font-mono"
            />
          </div>

          <div class="flex items-center gap-2">
            <input
              id="uni-active"
              v-model="modalForm.is_active"
              type="checkbox"
              class="rounded text-amber-500 focus:ring-amber-400"
            />
            <label for="uni-active" class="font-bold text-gray-700 dark:text-gray-300">{{
              t('taifa.admin.universities.activeLabel')
            }}</label>
          </div>

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
import { useUniversitiesStore, type University } from '../../../stores/universities'

const { t } = useI18n()
const uniStore = useUniversitiesStore()

onMounted(() => {
  uniStore.fetchUniversities()
})

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref('')
const isSaving = ref(false)

const modalForm = reactive({
  name: '',
  code: '',
  location: '',
  badge: '/taifa/udsm_badge.png',
  is_active: true,
})

const openAddModal = () => {
  isEditing.value = false
  editingId.value = ''
  modalForm.name = ''
  modalForm.code = ''
  modalForm.location = 'Dar es Salaam'
  modalForm.badge = '/taifa/udsm_badge.png'
  modalForm.is_active = true
  showModal.value = true
}

const openEditModal = (item: University) => {
  isEditing.value = true
  editingId.value = item.id
  modalForm.name = item.name
  modalForm.code = item.code
  modalForm.location = item.location
  modalForm.badge = item.badge
  modalForm.is_active = item.is_active
  showModal.value = true
}

const saveUniversity = async () => {
  isSaving.value = true
  try {
    if (isEditing.value) {
      await uniStore.updateUniversity(editingId.value, { ...modalForm })
    } else {
      await uniStore.createUniversity({ ...modalForm })
    }
    showModal.value = false
  } catch (e) {
    console.error('Failed to save university', e)
  } finally {
    isSaving.value = false
  }
}

const deleteUni = async (id: string) => {
  if (confirm(t('taifa.admin.universities.deleteConfirm'))) {
    await uniStore.deleteUniversity(id)
  }
}
</script>
