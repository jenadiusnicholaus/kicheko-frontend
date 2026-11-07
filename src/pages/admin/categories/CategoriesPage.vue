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
          <span class="material-icons text-2xl">category</span>
        </div>
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <h1 class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {{ t('taifa.admin.categories.title') }}
            </h1>
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-400 text-xs font-bold border border-violet-200 dark:border-violet-800"
            >
              {{ t('taifa.admin.categories.count', { count: typesStore.types.length }) }}
            </span>
          </div>
          <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {{ t('taifa.admin.categories.subtitle') }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2.5">
        <button
          type="button"
          class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          @click="typesStore.fetchTypes()"
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
          <span>{{ t('taifa.admin.categories.addBtn') }}</span>
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="typesStore.isLoading" class="flex items-center justify-center py-16">
      <span class="material-icons text-4xl text-[#FEBF01] animate-spin">sync</span>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="typesStore.types.length === 0"
      class="py-16 text-center text-gray-400 bg-white dark:bg-[#18181b] rounded-3xl border border-gray-200 dark:border-gray-800"
    >
      <span class="material-icons text-4xl mb-2 text-gray-300">category</span>
      <p class="font-bold text-sm">{{ t('taifa.admin.categories.empty') }}</p>
    </div>

    <!-- Categories Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div
        v-for="c in typesStore.types"
        :key="c.id"
        class="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
      >
        <div>
          <div class="flex items-start justify-between gap-3 mb-4">
            <div
              class="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 flex items-center justify-center shrink-0 overflow-hidden"
            >
              <img v-if="c.icon" :src="c.icon" :alt="c.name" class="w-full h-full object-cover" />
              <span v-else class="material-icons text-2xl text-gray-400">theater_comedy</span>
            </div>
            <span
              class="px-2.5 py-1 rounded-full text-[11px] font-bold"
              :class="
                c.is_active
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400'
              "
            >
              {{ c.is_active ? t('taifa.admin.categories.statusActive') : t('taifa.admin.categories.statusInactive') }}
            </span>
          </div>

          <h3 class="text-base font-black text-gray-900 dark:text-white leading-snug break-words">
            {{ c.name }}
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {{ c.description || '—' }}
          </p>
        </div>

        <div class="mt-5 pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between gap-2">
          <button
            type="button"
            class="text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1 cursor-pointer"
            @click="openEditModal(c)"
          >
            <span class="material-icons text-sm">edit</span>
            <span>{{ t('taifa.admin.editBtn') }}</span>
          </button>

          <button
            type="button"
            class="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
            @click="deleteType(c.id)"
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
            {{ isEditing ? t('taifa.admin.categories.editTitle') : t('taifa.admin.categories.addTitle') }}
          </h2>
          <button
            type="button"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-white"
            @click="showModal = false"
          >
            <span class="material-icons">close</span>
          </button>
        </div>

        <form class="space-y-4 text-xs" @submit.prevent="saveType">
          <div>
            <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
              t('taifa.admin.categories.nameLabel')
            }}</label>
            <input
              v-model="modalForm.name"
              type="text"
              required
              :placeholder="t('taifa.admin.categories.namePlaceholder')"
              class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
              t('taifa.admin.categories.descLabel')
            }}</label>
            <textarea
              v-model="modalForm.description"
              rows="3"
              :placeholder="t('taifa.admin.categories.descPlaceholder')"
              class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white"
            ></textarea>
          </div>

          <div>
            <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
              t('taifa.admin.categories.iconLabel')
            }}</label>
            <input
              type="file"
              accept="image/*"
              class="w-full text-xs file:mr-2 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-[#FEBF01] file:text-gray-950 file:font-black file:text-[11px] file:cursor-pointer"
              @change="onIconChange"
            />
          </div>

          <div class="flex items-center gap-2">
            <input
              id="type-active"
              v-model="modalForm.is_active"
              type="checkbox"
              class="rounded text-amber-500 focus:ring-amber-400"
            />
            <label for="type-active" class="font-bold text-gray-700 dark:text-gray-300">{{
              t('taifa.admin.categories.activeLabel')
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
import { useEntertainmentTypesStore, type EntertainmentType } from '../../../stores/entertainment-types'
import { compressImage } from '../../../utils/image'

const { t } = useI18n()
const typesStore = useEntertainmentTypesStore()

onMounted(() => {
  typesStore.fetchTypes()
})

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref('')
const isSaving = ref(false)
const saveError = ref('')
const iconFile = ref<File | undefined>(undefined)

const modalForm = reactive({
  name: '',
  description: '',
  is_active: true,
})

const openAddModal = () => {
  isEditing.value = false
  editingId.value = ''
  modalForm.name = ''
  modalForm.description = ''
  modalForm.is_active = true
  iconFile.value = undefined
  saveError.value = ''
  showModal.value = true
}

const openEditModal = (item: EntertainmentType) => {
  isEditing.value = true
  editingId.value = item.id
  modalForm.name = item.name
  modalForm.description = item.description
  modalForm.is_active = item.is_active
  iconFile.value = undefined
  saveError.value = ''
  showModal.value = true
}

const onIconChange = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  iconFile.value = file ? await compressImage(file) : undefined
}

const saveType = async () => {
  isSaving.value = true
  saveError.value = ''
  try {
    if (isEditing.value) {
      await typesStore.updateType(editingId.value, { ...modalForm }, iconFile.value)
    } else {
      await typesStore.createType({ name: modalForm.name, description: modalForm.description }, iconFile.value)
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

const deleteType = async (id: string) => {
  if (confirm(t('taifa.admin.categories.deleteConfirm'))) {
    await typesStore.deleteType(id)
  }
}
</script>
