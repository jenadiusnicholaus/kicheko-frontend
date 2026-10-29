<template>
  <div class="flex-1 flex flex-col min-h-full bg-gray-50 dark:bg-zinc-950">
    <!-- Centered logo + search -->
    <div class="flex flex-col items-center gap-4 px-4 pt-6 pb-2">
      <RouterLink to="/wall-of-fame" class="inline-flex items-center justify-center" @click="selectedArticle = null">
        <img
          src="/image/WALL OF FAME LOGO.png"
          :alt="t('taifa.wall.title')"
          class="h-36 sm:h-48 w-auto object-contain drop-shadow-sm"
        />
      </RouterLink>
      <div v-if="!selectedArticle" class="relative w-full max-w-md">
        <span class="material-icons absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base">search</span>
        <input
          v-model="search"
          type="search"
          :placeholder="t('taifa.wall.searchPlaceholder')"
          class="w-full pl-10 pr-4 py-2.5 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 shadow-sm focus:outline-none focus:border-[#FEBF01] focus:ring-2 focus:ring-[#FEBF01]/30 transition-colors"
        />
      </div>

      <!-- Mobile category chips — the left sidebar is hidden on small screens -->
      <div v-if="!selectedArticle" class="md:hidden w-full max-w-3xl overflow-x-auto -mx-1 px-1 pb-1">
        <div class="flex items-center gap-2 w-max">
          <button
            type="button"
            class="px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors"
            :class="
              activeCategory === null
                ? 'bg-[#FEBF01] text-gray-950'
                : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-zinc-700'
            "
            @click="activeCategory = null"
          >
            {{ t('taifa.wall.home') }}
          </button>
          <button
            v-for="cat in WALL_CATEGORIES"
            :key="cat"
            type="button"
            class="px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors"
            :class="
              activeCategory === cat
                ? 'bg-[#FEBF01] text-gray-950'
                : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-zinc-700'
            "
            @click="activeCategory = cat"
          >
            {{ categoryLabel(cat) }}
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto w-full px-4 py-6 flex gap-6 items-start">
      <!-- ───── Article detail ───── -->
      <article v-if="selectedArticle" class="flex-1 max-w-3xl mx-auto">
        <button
          type="button"
          class="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          @click="selectedArticle = null"
        >
          <span class="material-icons text-base">arrow_back</span>
          {{ t('taifa.wall.backToFeed') }}
        </button>

        <!-- Hero -->
        <div class="relative rounded-2xl overflow-hidden shadow-lg">
          <img :src="selectedArticle.image" :alt="selectedArticle.title" class="w-full aspect-[2/1] object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <div class="absolute top-4 left-4">
            <span
              class="px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-wide text-white"
              :style="{ backgroundColor: categoryColor(selectedArticle.category) }"
            >
              {{ categoryLabel(selectedArticle.category) }}
            </span>
          </div>
          <div class="absolute bottom-0 inset-x-0 p-5">
            <h1 class="text-xl sm:text-2xl font-black text-white leading-snug">{{ selectedArticle.title }}</h1>
            <div class="flex items-center gap-2 mt-2 text-[11px] font-semibold text-white/80">
              <span class="text-[#FEBF01]">👑 {{ selectedArticle.author }}</span>
              <span>•</span>
              <span>{{ formatDate(selectedArticle.publishedAt) }}</span>
              <span>•</span>
              <span>{{ t('taifa.wall.minRead', { min: selectedArticle.readMinutes }) }}</span>
            </div>
          </div>
        </div>

        <!-- Body -->
        <div class="bg-white dark:bg-zinc-900 rounded-b-2xl -mt-4 pt-8 px-5 sm:px-7 pb-6 shadow-sm relative">
          <p
            v-for="(para, i) in bodyParagraphs"
            :key="i"
            class="text-sm sm:text-[15px] leading-relaxed text-gray-700 dark:text-gray-300 mb-4"
          >
            {{ para }}
          </p>

          <!-- Actions -->
          <div
            class="flex items-center gap-5 pt-4 mt-2 border-t border-gray-100 dark:border-zinc-800 text-sm font-semibold text-gray-600 dark:text-gray-300"
          >
            <button
              type="button"
              class="flex items-center gap-1.5 transition-colors"
              :class="likedIds.has(selectedArticle.id) ? 'text-red-500' : 'hover:text-red-500'"
              @click="toggleLike(selectedArticle)"
            >
              <span class="material-icons text-lg">{{
                likedIds.has(selectedArticle.id) ? 'favorite' : 'favorite_border'
              }}</span>
              {{ selectedArticle.likes }}
            </button>
            <span class="flex items-center gap-1.5">
              <span class="material-icons text-lg">chat_bubble_outline</span>
              {{ selectedArticle.commentsCount }}
            </span>
            <button
              type="button"
              class="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-white"
              @click="shareArticle(selectedArticle)"
            >
              <span class="material-icons text-lg">share</span>
              {{ t('taifa.wall.share') }}
            </button>
            <span class="flex-1"></span>
            <button type="button" class="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-white">
              <span class="material-icons text-lg">bookmark_border</span>
              {{ t('taifa.wall.save') }}
            </button>
          </div>
        </div>

        <!-- Comments -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm mt-5 p-5 sm:p-7">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-base font-black text-gray-900 dark:text-white">
              {{ t('taifa.wall.comments', { count: comments.length }) }}
            </h2>
            <button
              type="button"
              class="text-[11px] font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              @click="commentsStore.fetchComments(selectedArticle.id)"
            >
              {{ t('taifa.wall.commentsRefresh') }}
            </button>
          </div>

          <!-- Login gate — only signed-in users can comment -->
          <div
            v-if="!isLoggedIn"
            class="mb-5 rounded-xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700 px-4 py-3.5 flex items-center gap-3"
          >
            <span class="material-icons text-gray-400">lock_outline</span>
            <p class="text-xs text-gray-600 dark:text-gray-300 font-semibold flex-1">
              {{ t('taifa.wall.loginToCommentDesc') }}
            </p>
            <RouterLink
              :to="{ name: 'login', query: { redirect: route.fullPath } }"
              class="px-4 py-1.5 rounded-full bg-[#FEBF01] hover:bg-[#E5AC00] text-gray-950 text-xs font-black transition-colors shrink-0"
            >
              {{ t('taifa.wall.loginToComment') }}
            </RouterLink>
          </div>

          <!-- New comment -->
          <form v-else class="space-y-2.5 mb-5" @submit.prevent="submitComment">
            <div class="flex items-center gap-3">
              <div
                class="w-9 h-9 rounded-full bg-[#183153] text-white flex items-center justify-center text-sm font-black shrink-0"
              >
                {{ (commentName || 'G').charAt(0).toUpperCase() }}
              </div>
              <input
                v-model="commentName"
                type="text"
                maxlength="40"
                :placeholder="t('taifa.wall.commentName')"
                class="flex-1 px-4 py-2.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FEBF01]/50"
              />
            </div>
            <div class="flex items-center gap-3">
              <input
                v-model="commentText"
                type="text"
                required
                maxlength="500"
                :placeholder="t('taifa.wall.commentInput')"
                class="flex-1 px-4 py-2.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FEBF01]/50"
              />
              <button
                type="submit"
                :disabled="!commentText.trim() || isPostingComment"
                class="w-9 h-9 rounded-full bg-[#FEBF01] hover:bg-[#E5AC00] text-gray-950 flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <span class="material-icons text-lg" :class="{ 'animate-spin': isPostingComment }">
                  {{ isPostingComment ? 'sync' : 'send' }}
                </span>
              </button>
            </div>
            <p v-if="commentError" class="text-xs font-semibold text-red-500">{{ commentError }}</p>
          </form>

          <!-- Comment list -->
          <div v-if="commentsStore.isLoading" class="flex justify-center py-6">
            <span class="material-icons text-2xl text-[#FEBF01] animate-spin">sync</span>
          </div>
          <p v-else-if="commentsStore.error" class="text-xs text-gray-400 py-4">{{ commentsStore.error }}</p>
          <p v-else-if="comments.length === 0" class="text-xs text-gray-400 py-4 italic">
            {{ t('taifa.wall.commentsEmpty') }}
          </p>
          <ol v-else class="space-y-4">
            <li v-for="c in comments" :key="c.id" class="flex items-start gap-3">
              <img v-if="c.avatar" :src="c.avatar" :alt="c.author" class="w-9 h-9 rounded-full object-cover shrink-0" />
              <div
                v-else
                class="w-9 h-9 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center text-sm font-black text-gray-500 shrink-0"
              >
                {{ c.author.charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-baseline gap-2">
                  <span class="text-xs font-black text-gray-900 dark:text-white">{{ c.author }}</span>
                  <span class="text-[10px] text-gray-400">{{ relativeTime(c.createdAt) }}</span>
                </div>
                <p class="text-sm text-gray-700 dark:text-gray-300 mt-0.5 leading-relaxed break-words">{{ c.text }}</p>
                <button
                  type="button"
                  class="mt-1 flex items-center gap-1 text-[11px] font-bold transition-colors"
                  :class="likedCommentIds.has(c.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'"
                  @click="likeComment(c)"
                >
                  <span class="material-icons text-sm">{{
                    likedCommentIds.has(c.id) ? 'favorite' : 'favorite_border'
                  }}</span>
                  {{ c.likes }}
                </button>
              </div>
            </li>
          </ol>
        </div>
      </article>

      <!-- ───── Feed ───── -->
      <template v-else>
        <!-- Left sidebar -->
        <aside class="hidden md:block w-56 shrink-0 sticky top-20 space-y-5">
          <nav class="space-y-1">
            <button
              type="button"
              class="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors"
              :class="
                activeCategory === null
                  ? 'bg-[#FEBF01] text-gray-950'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
              "
              @click="activeCategory = null"
            >
              <span class="material-icons text-lg">home</span>
              {{ t('taifa.wall.home') }}
            </button>
            <button
              v-for="cat in WALL_CATEGORIES"
              :key="cat"
              type="button"
              class="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              :class="
                activeCategory === cat
                  ? 'bg-[#FEBF01] text-gray-950'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
              "
              @click="activeCategory = cat"
            >
              <span class="material-icons text-lg">{{ categoryIcon(cat) }}</span>
              {{ categoryLabel(cat) }}
            </button>
          </nav>

          <!-- Advertise box -->
          <div
            class="rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-5 text-center shadow-md"
          >
            <p class="text-[10px] font-bold uppercase tracking-widest opacity-80">
              {{ t('taifa.wall.advertise.kicker') }}
            </p>
            <h3 class="text-lg font-black mt-1">{{ t('taifa.wall.advertise.title') }}</h3>
            <p class="text-xs opacity-90 mt-1">{{ t('taifa.wall.advertise.sub') }}</p>
            <button
              type="button"
              class="mt-3 px-4 py-2 rounded-full bg-white text-emerald-700 text-xs font-black hover:scale-105 transition-transform"
            >
              {{ t('taifa.wall.advertise.cta') }}
            </button>
          </div>
        </aside>

        <!-- Article feed -->
        <main class="flex-1 min-w-0 space-y-4">
          <div v-if="fameStore.isLoading" class="flex justify-center py-20">
            <span class="material-icons text-4xl text-[#FEBF01] animate-spin">sync</span>
          </div>

          <div v-else-if="fameStore.error" class="text-center py-16">
            <span class="material-icons text-5xl text-red-400 mb-3">error_outline</span>
            <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">{{ fameStore.error }}</p>
          </div>

          <div v-else-if="filteredArticles.length === 0" class="text-center py-16">
            <span class="material-icons text-5xl text-gray-300 dark:text-zinc-700 mb-3">article</span>
            <p class="text-base font-black text-gray-900 dark:text-white">{{ t('taifa.wall.emptyFeed') }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ t('taifa.wall.emptyFeedDesc') }}</p>
          </div>

          <article
            v-for="article in filteredArticles"
            :key="article.id"
            class="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex gap-4 p-3 cursor-pointer"
            @click="openArticle(article)"
          >
            <img
              :src="article.image"
              :alt="article.title"
              class="w-28 sm:w-44 aspect-[4/3] rounded-xl object-cover shrink-0"
            />
            <div class="flex-1 min-w-0 py-1">
              <span
                class="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide text-white mb-1.5"
                :style="{ backgroundColor: categoryColor(article.category) }"
              >
                {{ categoryLabel(article.category) }}
              </span>
              <h2 class="font-black text-gray-900 dark:text-white text-sm sm:text-base leading-snug line-clamp-2">
                {{ article.title }}
              </h2>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                {{ article.excerpt }}
              </p>
              <div class="flex items-center gap-1.5 mt-2 text-[11px] text-gray-400 font-semibold">
                <span class="text-[#FEBF01] font-bold">👑 {{ article.author }}</span>
                <span>•</span>
                <span>{{ formatDate(article.publishedAt) }}</span>
                <span>•</span>
                <span>{{ t('taifa.wall.minRead', { min: article.readMinutes }) }}</span>
              </div>
              <div class="flex items-center gap-4 mt-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                <span class="flex items-center gap-1">
                  <span class="material-icons text-sm text-red-500">favorite</span>
                  {{ article.likes }}
                </span>
                <span class="flex items-center gap-1">
                  <span class="material-icons text-sm">chat_bubble_outline</span>
                  {{ article.commentsCount }}
                </span>
                <span class="flex items-center gap-1">
                  <span class="material-icons text-sm">share</span>
                  {{ t('taifa.wall.share') }}
                </span>
              </div>
            </div>
          </article>
        </main>

        <!-- Right sidebar: trending -->
        <aside class="hidden lg:block w-64 shrink-0 sticky top-20">
          <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                <span class="material-icons text-base text-[#FEBF01]">local_fire_department</span>
                {{ t('taifa.wall.trending') }}
              </h3>
            </div>
            <ol class="space-y-3">
              <li
                v-for="(article, i) in fameStore.trending"
                :key="article.id"
                class="flex items-start gap-3 cursor-pointer group"
                @click="openArticle(article)"
              >
                <span
                  class="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black text-white shrink-0"
                  :style="{ backgroundColor: trendColor(i) }"
                >
                  {{ i + 1 }}
                </span>
                <img :src="article.image" :alt="article.title" class="w-12 h-12 rounded-lg object-cover shrink-0" />
                <div class="min-w-0">
                  <p
                    class="text-xs font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-amber-600"
                  >
                    {{ article.title }}
                  </p>
                  <p class="text-[10px] text-gray-400 mt-0.5">
                    {{ article.likes }} {{ t('taifa.wall.likesShort') }} · {{ article.commentsCount }}
                    {{ t('taifa.wall.commentsShort') }}
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </aside>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useWallOfFameStore, WALL_CATEGORIES, type WallOfFameArticle } from '../../stores/wall-of-fame'
import { useWallCommentsStore, type WallComment } from '../../stores/wall-comments'
import { useAuthStore } from '../../stores/auth-store'

const { t } = useI18n()
const route = useRoute()
const fameStore = useWallOfFameStore()
const commentsStore = useWallCommentsStore()
const authStore = useAuthStore()

const isLoggedIn = computed(() => Boolean(authStore.user))

const search = ref('')
const activeCategory = ref<string | null>(null)
const selectedArticle = ref<WallOfFameArticle | null>(null)
const likedIds = ref<Set<string>>(new Set())
const likedCommentIds = ref<Set<string | number>>(new Set())
const commentName = ref('')
const commentText = ref('')
const commentError = ref('')
const isPostingComment = ref(false)

onMounted(() => {
  fameStore.fetchArticles()
  commentName.value = authStore.user?.display_name || authStore.user?.username || ''
})

const comments = computed<WallComment[]>(() =>
  selectedArticle.value ? commentsStore.byArticle[selectedArticle.value.id] || [] : [],
)

const filteredArticles = computed(() => {
  const q = search.value.trim().toLowerCase()
  return fameStore.articles.filter(
    (a) =>
      (activeCategory.value === null || a.category === activeCategory.value) &&
      (!q || a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)),
  )
})

const bodyParagraphs = computed(() =>
  (selectedArticle.value?.body || selectedArticle.value?.excerpt || '').split(/\n+/).filter(Boolean),
)

const CATEGORY_COLORS: Record<string, string> = {
  'campus-life': '#0d9488',
  'fursa-mafanikio': '#16a34a',
  teknolojia: '#2563eb',
  burudani: '#ea580c',
  'maisha-ya-chuo': '#d97706',
  'maisha-ya-kijamii': '#7c3aed',
}
const categoryColor = (cat: string) => CATEGORY_COLORS[cat] || '#475569'

const CATEGORY_ICONS: Record<string, string> = {
  'campus-life': 'school',
  'fursa-mafanikio': 'work',
  teknolojia: 'memory',
  burudani: 'theater_comedy',
  'maisha-ya-chuo': 'groups',
  'maisha-ya-kijamii': 'diversity_3',
}
const categoryIcon = (cat: string) => CATEGORY_ICONS[cat] || 'label'

const categoryLabel = (cat: string) => t(`taifa.wall.categories.${cat.replace(/-/g, '')}`)

const trendColor = (i: number) => ['#e11d48', '#0d9488', '#2563eb', '#ea580c', '#7c3aed'][i] || '#475569'

const formatDate = (iso: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

const openArticle = (article: WallOfFameArticle) => {
  selectedArticle.value = article
  commentsStore.fetchComments(article.id)
  window.scrollTo({ top: 0 })
}

const submitComment = async () => {
  const article = selectedArticle.value
  const text = commentText.value.trim()
  if (!article || !text || isPostingComment.value) return
  isPostingComment.value = true
  commentError.value = ''
  try {
    await commentsStore.postComment(article.id, commentName.value.trim() || 'Guest', text)
    article.commentsCount += 1
    commentText.value = ''
  } catch (e: any) {
    commentError.value = e?.response?.data?.detail || e?.message || t('taifa.wall.commentFailed')
  } finally {
    isPostingComment.value = false
  }
}

const likeComment = (c: WallComment) => {
  if (likedCommentIds.value.has(c.id)) return
  likedCommentIds.value.add(c.id)
  commentsStore.likeComment(selectedArticle.value!.id, c.id)
}

const relativeTime = (iso: string) => {
  if (!iso) return ''
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const mins = Math.max(0, Math.floor((Date.now() - then) / 60_000))
  if (mins < 1) return t('taifa.wall.justNow')
  if (mins < 60) return t('taifa.wall.minsAgo', { n: mins })
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return t('taifa.wall.hoursAgo', { n: hrs })
  return t('taifa.wall.daysAgo', { n: Math.floor(hrs / 24) })
}

const toggleLike = (article: WallOfFameArticle) => {
  if (likedIds.value.has(article.id)) {
    likedIds.value.delete(article.id)
    article.likes -= 1
  } else {
    likedIds.value.add(article.id)
    article.likes += 1
  }
}

const shareArticle = (article: WallOfFameArticle) => {
  const url = window.location.href
  if (navigator.share) {
    navigator.share({ title: article.title, text: article.excerpt, url }).catch(() => {})
  } else {
    navigator.clipboard?.writeText(`${article.title} — ${url}`).catch(() => {})
  }
}
</script>
