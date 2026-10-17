import { defineStore } from 'pinia'
import { http } from '../services/api/http'
import { resolveMediaUrl } from '../services/api/config'

export interface WallOfFameInductee {
  id: string
  name: string
  university: string
  universityId?: string
  universityCode?: string
  universityBadge?: string
  competitionYear: number
  totalVotes: number
  bio: string
  photo: string
  featuredQuote?: string
  awards?: string[]
}

function normalizeBackendInductee(raw: any): WallOfFameInductee {
  return {
    id: raw.id,
    name: raw.name || '',
    university: raw.university || '',
    universityId: raw.university_id || undefined,
    universityCode: raw.university_code || raw.universityCode || '',
    universityBadge: raw.university_badge || undefined,
    competitionYear: raw.competition_year || raw.competitionYear || 0,
    totalVotes: raw.total_votes ?? raw.totalVotes ?? 0,
    bio: raw.bio || '',
    photo: resolveMediaUrl(raw.photo) || '/image/Kicheko.png',
    featuredQuote: raw.featured_quote || raw.featuredQuote || '',
    awards: raw.awards || [],
  }
}

export const useWallOfFameStore = defineStore('wallOfFame', {
  state: () => ({
    inductees: [] as WallOfFameInductee[],
    selectedIndex: 0,
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    totalInductees: (state) => state.inductees.length,
    currentInductee: (state): WallOfFameInductee | null => {
      if (!state.inductees || state.inductees.length === 0) return null
      return state.inductees[state.selectedIndex] || state.inductees[0] || null
    },
  },

  actions: {
    async fetchInducteesFromBackend() {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await http.get('/wall-of-fame/')
        if (Array.isArray(data)) {
          this.inductees = data.map(normalizeBackendInductee)
        }
      } catch (e: any) {
        this.error = e?.message || 'Failed to load inductees'
        console.warn('Failed to fetch wall of fame from backend', e)
      } finally {
        this.isLoading = false
      }
    },

    selectInductee(index: number) {
      if (index >= 0 && index < this.inductees.length) {
        this.selectedIndex = index
      }
    },

    nextInductee() {
      if (this.inductees.length === 0) return
      this.selectedIndex = (this.selectedIndex + 1) % this.inductees.length
    },

    prevInductee() {
      if (this.inductees.length === 0) return
      this.selectedIndex = (this.selectedIndex - 1 + this.inductees.length) % this.inductees.length
    },

    async addInductee(item: Omit<WallOfFameInductee, 'id'>, photoFile?: File) {
      const fd = new FormData()
      fd.append('name', item.name)
      fd.append('university', item.university)
      fd.append('competition_year', String(item.competitionYear))
      fd.append('total_votes', String(item.totalVotes))
      fd.append('bio', item.bio)
      fd.append('featured_quote', item.featuredQuote || '')
      if (photoFile) fd.append('photo', photoFile)
      const { data } = await http.post('/wall-of-fame/', fd)
      const newEntry = normalizeBackendInductee(data)
      this.inductees.unshift(newEntry)
      return newEntry
    },

    async updateInductee(id: string, updates: Partial<WallOfFameInductee>, photoFile?: File) {
      const fd = new FormData()
      if (updates.name !== undefined) fd.append('name', updates.name)
      if (updates.university !== undefined) fd.append('university', updates.university)
      if (updates.competitionYear !== undefined) fd.append('competition_year', String(updates.competitionYear))
      if (updates.totalVotes !== undefined) fd.append('total_votes', String(updates.totalVotes))
      if (updates.bio !== undefined) fd.append('bio', updates.bio)
      if (updates.featuredQuote !== undefined) fd.append('featured_quote', updates.featuredQuote)
      if (photoFile) fd.append('photo', photoFile)
      const { data } = await http.put(`/wall-of-fame/${id}/`, fd)
      const updated = normalizeBackendInductee(data)
      const idx = this.inductees.findIndex((x) => x.id === id)
      if (idx !== -1) {
        this.inductees[idx] = updated
      }
    },

    async deleteInductee(id: string) {
      await http.delete(`/wall-of-fame/${id}/`)
      const idx = this.inductees.findIndex((x) => x.id === id)
      if (idx !== -1) {
        this.inductees.splice(idx, 1)
        if (this.selectedIndex >= this.inductees.length) {
          this.selectedIndex = Math.max(0, this.inductees.length - 1)
        }
      }
    },

    async resetToDefault() {
      await this.fetchInducteesFromBackend()
    },
  },
})
