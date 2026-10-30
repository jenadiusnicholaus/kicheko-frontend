import { defineStore } from 'pinia'
import { http } from '../services/api/http'
import { resolveMediaUrl } from '../services/api/config'

/** Category slugs rendered in the feed sidebar; labels live in i18n
 * (`taifa.wall.categories.<slug>`). */
export const WALL_CATEGORIES = [
  'campus-life',
  'fursa-mafanikio',
  'teknolojia',
  'burudani',
  'maisha-ya-chuo',
  'maisha-ya-kijamii',
] as const

export type WallCategory = (typeof WALL_CATEGORIES)[number] | string

export interface WallOfFameArticle {
  id: string
  title: string
  category: WallCategory
  excerpt: string
  body: string
  image: string
  author: string
  publishedAt: string
  readMinutes: number
  likes: number
  commentsCount: number
}

/** Accepts the new article shape and legacy inductee rows (name/bio/photo)
 * so the feed keeps working until the backend fields land. */
function normalizeBackendArticle(raw: any): WallOfFameArticle {
  return {
    id: String(raw.id),
    title: raw.title || raw.name || '',
    category: raw.category || 'campus-life',
    excerpt: raw.excerpt || raw.bio || '',
    body: raw.body || raw.content || raw.bio || '',
    image: resolveMediaUrl(raw.image || raw.photo) || '/image/Kicheko.png',
    author: raw.author || 'Wall of Fame',
    publishedAt: raw.published_at || raw.created_at || '',
    readMinutes: raw.read_minutes ?? raw.read_time ?? 5,
    likes: raw.likes ?? raw.likes_count ?? 0,
    commentsCount: raw.comments_count ?? raw.commentsCount ?? 0,
  }
}

/** @deprecated alias kept for the inductee-shaped callers */
export type WallOfFameInductee = WallOfFameArticle

export const useWallOfFameStore = defineStore('wallOfFame', {
  state: () => ({
    articles: [] as WallOfFameArticle[],
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    /** @deprecated dashboard compat — article count. */
    totalInductees: (state) => state.articles.length,
    trending: (state) => [...state.articles].sort((a, b) => b.likes - a.likes).slice(0, 5),
  },

  actions: {
    async fetchArticles() {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await http.get('/wall-of-fame/')
        const raw = Array.isArray(data) ? data : data?.results || []
        this.articles = raw.map(normalizeBackendArticle)
      } catch (e: any) {
        this.error = e?.message || 'Failed to load articles'
        console.warn('Failed to fetch wall of fame from backend', e)
      } finally {
        this.isLoading = false
      }
    },

    /** @deprecated compat alias */
    async fetchInducteesFromBackend() {
      return this.fetchArticles()
    },

    /** Anonymous-friendly like — updates the count from the server response. */
    async likeArticle(article: WallOfFameArticle) {
      try {
        const { data } = await http.post(`/wall-of-fame/${article.id}/like/`)
        if (typeof data?.likes === 'number') article.likes = data.likes
      } catch {
        /* like endpoint optional — the local count still applies */
      }
    },

    async createArticle(item: Omit<WallOfFameArticle, 'id'>, imageFile?: File) {
      const fd = new FormData()
      fd.append('title', item.title)
      fd.append('category', item.category)
      fd.append('excerpt', item.excerpt)
      fd.append('body', item.body)
      fd.append('read_minutes', String(item.readMinutes))
      if (imageFile) fd.append('image', imageFile)
      const { data } = await http.post('/wall-of-fame/', fd)
      const created = normalizeBackendArticle(data)
      this.articles.unshift(created)
      return created
    },

    /** @deprecated compat alias */
    async addInductee(item: Omit<WallOfFameArticle, 'id'>, imageFile?: File) {
      return this.createArticle(item, imageFile)
    },

    async updateArticle(id: string, updates: Partial<WallOfFameArticle>, imageFile?: File) {
      const fd = new FormData()
      if (updates.title !== undefined) fd.append('title', updates.title)
      if (updates.category !== undefined) fd.append('category', updates.category)
      if (updates.excerpt !== undefined) fd.append('excerpt', updates.excerpt)
      if (updates.body !== undefined) fd.append('body', updates.body)
      if (updates.readMinutes !== undefined) fd.append('read_minutes', String(updates.readMinutes))
      if (imageFile) fd.append('image', imageFile)
      const { data } = await http.put(`/wall-of-fame/${id}/`, fd)
      const updated = normalizeBackendArticle(data)
      const idx = this.articles.findIndex((x) => x.id === id)
      if (idx !== -1) this.articles[idx] = updated
    },

    /** @deprecated compat alias */
    async updateInductee(id: string, updates: Partial<WallOfFameArticle>, imageFile?: File) {
      return this.updateArticle(id, updates, imageFile)
    },

    async deleteArticle(id: string) {
      await http.delete(`/wall-of-fame/${id}/`)
      const idx = this.articles.findIndex((x) => x.id === id)
      if (idx !== -1) this.articles.splice(idx, 1)
    },

    /** @deprecated compat alias */
    async deleteInductee(id: string) {
      return this.deleteArticle(id)
    },
  },
})
