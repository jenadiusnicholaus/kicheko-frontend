import { defineStore } from 'pinia'
import { http } from '../services/api/http'
import { resolveMediaUrl } from '../services/api/config'

export interface WallComment {
  id: string | number
  author: string
  avatar: string
  text: string
  createdAt: string
  likes: number
}

/** Tolerant of common field spellings — matches the backend's
 * /wall-of-fame/{id}/comments/ resource. */
const normalizeComment = (raw: any): WallComment => ({
  id: raw.id,
  author: raw.author_name || raw.author || raw.name || raw.user?.display_name || raw.user?.username || 'Guest',
  avatar: resolveMediaUrl(raw.avatar || raw.user?.avatar),
  text: raw.text || raw.body || raw.comment || '',
  createdAt: raw.created_at || raw.created || '',
  likes: raw.likes ?? raw.likes_count ?? 0,
})

export const useWallCommentsStore = defineStore('wallComments', {
  state: () => ({
    byArticle: {} as Record<string, WallComment[]>,
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchComments(articleId: string) {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await http.get(`/wall-of-fame/${articleId}/comments/`)
        const raw = Array.isArray(data) ? data : data?.results || []
        this.byArticle = { ...this.byArticle, [articleId]: raw.map(normalizeComment) }
      } catch (e: any) {
        this.error = e?.message || 'Failed to load comments'
      } finally {
        this.isLoading = false
      }
    },

    /** Anonymous-friendly: sends the chosen name with the comment body so
     * visitors don't need an account to comment. */
    async postComment(articleId: string, author: string, text: string) {
      const { data } = await http.post(`/wall-of-fame/${articleId}/comments/`, {
        author_name: author,
        text,
      })
      const comment = normalizeComment(data)
      this.byArticle = { ...this.byArticle, [articleId]: [...(this.byArticle[articleId] || []), comment] }
      return comment
    },

    async likeComment(articleId: string, commentId: string | number) {
      try {
        await http.post(`/wall-of-fame/${articleId}/comments/${commentId}/like/`)
      } catch {
        /* like endpoint optional — the local toggle below still applies */
      }
      const list = this.byArticle[articleId]
      const c = list?.find((x) => x.id === commentId)
      if (c) c.likes += 1
    },
  },
})
