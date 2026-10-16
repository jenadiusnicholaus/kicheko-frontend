import { defineStore } from 'pinia'
import { http } from '../services/api/http'

export interface WallOfFameInductee {
  id: string
  name: string
  university: string
  universityCode: string
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
    universityCode: raw.university_code || raw.universityCode || '',
    competitionYear: raw.competition_year || raw.competitionYear || 0,
    totalVotes: raw.total_votes ?? raw.totalVotes ?? 0,
    bio: raw.bio || '',
    photo: raw.photo || '/image/Kicheko.png',
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

    async addInductee(item: Omit<WallOfFameInductee, 'id'>) {
      const { data } = await http.post('/wall-of-fame/', {
        name: item.name,
        university: item.university,
        university_code: item.universityCode,
        competition_year: item.competitionYear,
        total_votes: item.totalVotes,
        bio: item.bio,
        photo: item.photo,
        featured_quote: item.featuredQuote,
      })
      const newEntry = normalizeBackendInductee(data)
      this.inductees.unshift(newEntry)
      return newEntry
    },

    async updateInductee(id: string, updates: Partial<WallOfFameInductee>) {
      const payload: Record<string, any> = { ...updates }
      if (updates.universityCode) payload.university_code = updates.universityCode
      if (updates.competitionYear) payload.competition_year = updates.competitionYear
      if (updates.totalVotes !== undefined) payload.total_votes = updates.totalVotes
      if (updates.featuredQuote !== undefined) payload.featured_quote = updates.featuredQuote
      const { data } = await http.put(`/wall-of-fame/${id}/`, payload)
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
