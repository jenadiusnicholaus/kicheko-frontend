<template>
  <div class="space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm"
    >
      <div class="flex items-center gap-3.5 min-w-0">
        <div
          class="w-12 h-12 rounded-2xl bg-amber-400 text-gray-950 flex items-center justify-center font-black shadow-md shrink-0"
        >
          <span class="material-icons text-2xl">article</span>
        </div>
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <h1 class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight break-words">
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

      <div class="flex flex-wrap items-center gap-2.5">
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

    <!-- Articles Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="item in fameStore.articles"
        :key="item.id"
        class="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all"
      >
        <div class="relative w-full aspect-[16/10] bg-slate-900 overflow-hidden">
          <img
            :src="item.image"
            :alt="item.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

          <div
            class="absolute top-3 left-3 px-3 py-1 rounded-md text-white font-black text-[10px] uppercase tracking-wide shadow-md"
            :style="{ backgroundColor: categoryColor(item.category) }"
          >
            {{ categoryLabel(item.category) }}
          </div>

          <div class="absolute bottom-3 left-3 text-white text-xs font-bold flex items-center gap-3">
            <span class="flex items-center gap-1">
              <span class="material-icons text-red-400 text-sm">favorite</span>
              {{ item.likes.toLocaleString() }}
            </span>
            <span class="flex items-center gap-1">
              <span class="material-icons text-sm">chat_bubble_outline</span>
              {{ item.commentsCount.toLocaleString() }}
            </span>
          </div>
        </div>

        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="text-base font-black text-gray-900 dark:text-white line-clamp-2">
              {{ item.title }}
            </h3>
            <p class="text-[11px] text-gray-400 mb-2">
              {{ formatDate(item.publishedAt) }} · {{ t('taifa.wall.minRead', { min: item.readMinutes }) }}
            </p>
            <p class="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
              {{ item.excerpt }}
            </p>
          </div>

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

    <!-- Modal for Adding / Editing an Article -->
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

        <form class="space-y-4 text-xs" @submit.prevent="saveArticle">
          <div>
            <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
              t('taifa.admin.manageFame.titleLabel')
            }}</label>
            <input
              v-model="modalForm.title"
              type="text"
              required
              class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
                t('taifa.admin.manageFame.categoryLabel')
              }}</label>
              <select
                v-model="modalForm.category"
                required
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white"
              >
                <option v-for="cat in WALL_CATEGORIES" :key="cat" :value="cat">
                  {{ categoryLabel(cat) }}
                </option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
                t('taifa.admin.manageFame.readTimeLabel')
              }}</label>
              <input
                v-model.number="modalForm.readMinutes"
                type="number"
                min="1"
                required
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
              t('taifa.admin.manageFame.excerptLabel')
            }}</label>
            <textarea
              v-model="modalForm.excerpt"
              rows="2"
              required
              class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white"
            ></textarea>
          </div>

          <div>
            <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
              t('taifa.admin.manageFame.bodyLabel')
            }}</label>
            <textarea
              v-model="modalForm.body"
              rows="6"
              required
              class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white"
            ></textarea>
          </div>

          <div>
            <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">{{
              t('taifa.admin.manageFame.imageLabel')
            }}</label>
            <input
              type="file"
              accept="image/*"
              :required="!isEditing"
              class="w-full text-xs text-gray-600 dark:text-gray-300 file:mr-3 file:px-3.5 file:py-2 file:rounded-xl file:border-0 file:bg-[#FEBF01] file:text-gray-950 file:font-black file:text-xs file:cursor-pointer"
              @change="onImageChange"
            />
            <img
              v-if="imagePreview"
              :src="imagePreview"
              :alt="modalForm.title"
              class="mt-2 h-20 w-auto rounded-xl object-cover border border-gray-200 dark:border-zinc-700"
            />
          </div>

          <p v-if="saveError" class="text-xs font-semibold text-red-600 dark:text-red-400">{{ saveError }}</p>

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
import { useWallOfFameStore, WALL_CATEGORIES, type WallOfFameArticle } from '../../../stores/wall-of-fame'
import { compressImage } from '../../../utils/image'

const { t } = useI18n()
const fameStore = useWallOfFameStore()

onMounted(() => {
  fameStore.fetchArticles()
})

const CATEGORY_COLORS: Record<string, string> = {
  'campus-life': '#0d9488',
  'fursa-mafanikio': '#16a34a',
  teknolojia: '#2563eb',
  burudani: '#ea580c',
  'maisha-ya-chuo': '#d97706',
  'maisha-ya-kijamii': '#7c3aed',
}
const categoryColor = (cat: string) => CATEGORY_COLORS[cat] || '#475569'
const categoryLabel = (cat: string) => t(`taifa.wall.categories.${cat.replace(/-/g, '')}`)

const formatDate = (iso: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString()
}

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref('')

const modalForm = reactive({
  title: '',
  category: 'campus-life',
  excerpt: '',
  body: '',
  readMinutes: 5,
  image: '',
})

const imageFile = ref<File | null>(null)
const imagePreview = ref('')

const onImageChange = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0] || null
  if (!file) {
    imageFile.value = null
    return
  }
  imageFile.value = await compressImage(file)
  imagePreview.value = URL.createObjectURL(imageFile.value)
}

const openAddModal = () => {
  isEditing.value = false
  editingId.value = ''
  modalForm.title = ''
  modalForm.category = 'campus-life'
  modalForm.excerpt = ''
  modalForm.body = ''
  modalForm.readMinutes = 5
  modalForm.image = ''
  imageFile.value = null
  imagePreview.value = ''
  showModal.value = true
}

const openEditModal = (item: WallOfFameArticle) => {
  isEditing.value = true
  editingId.value = item.id
  modalForm.title = item.title
  modalForm.category = item.category
  modalForm.excerpt = item.excerpt
  modalForm.body = item.body
  modalForm.readMinutes = item.readMinutes
  modalForm.image = item.image
  imageFile.value = null
  imagePreview.value = item.image
  showModal.value = true
}

const isSaving = ref(false)
const saveError = ref('')

const saveArticle = async () => {
  isSaving.value = true
  saveError.value = ''
  try {
    if (isEditing.value) {
      await fameStore.updateArticle(editingId.value, { ...modalForm }, imageFile.value || undefined)
    } else {
      await fameStore.createArticle(
        { ...modalForm, author: 'Wall of Fame', publishedAt: '', likes: 0, commentsCount: 0 },
        imageFile.value || undefined,
      )
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

const deleteItem = async (id: string) => {
  if (confirm(t('taifa.admin.manageFame.deleteConfirm'))) {
    await fameStore.deleteArticle(id)
  }
}
</script>
