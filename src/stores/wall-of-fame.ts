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

const DEFAULT_INDUCTEES: WallOfFameInductee[] = [
  {
    id: 'fame-frank-mollel',
    name: 'Frank Mollel',
    university: 'Institute of Finance Management',
    universityCode: 'IFM',
    competitionYear: 2024,
    totalVotes: 15200,
    bio: 'Mshindi wa kwanza wa Kicheko Pro Taifa House Stand-Up Showdown 2024 akitokea IFM. Alivunja rekodi ya kura nyingi zaidi katika historia ya mashindano ya vichekesho vya vyuo vikuu.',
    photo: '/taifa/frank_fame_spotlight.png',
    featuredQuote: 'Vichekesho sio fani tu, ni daraja la kuunganisha vijana wa vyuo vikuu na kukuza vipaji.',
    awards: ['Mshindi wa Kwanza 2024', 'King of Campus Comedy'],
  },
]

const STORAGE_KEY = 'kicheko_wall_of_fame_v1'

function normalizeBackendInductee(raw: any): WallOfFameInductee {
  return {
    id: raw.id,
    name: raw.name || '',
    university: raw.university || '',
    universityCode: raw.university_code || raw.universityCode || '',
    competitionYear: raw.competition_year || raw.competitionYear || 2024,
    totalVotes: raw.total_votes ?? raw.totalVotes ?? 0,
    bio: raw.bio || '',
    photo: raw.photo || '/image/Kicheko.png',
    featuredQuote: raw.featured_quote || raw.featuredQuote || '',
    awards: raw.awards || [],
  }
}

export const useWallOfFameStore = defineStore('wallOfFame', {
  state: () => {
    let stored: WallOfFameInductee[] = []
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        const parsed = JSON.parse(data)
        if (Array.isArray(parsed) && parsed.length > 0) {
          stored = parsed
        }
      }
    } catch (e) {
      console.error('Failed to load wall of fame from storage', e)
    }

    return {
      inductees: (stored && stored.length > 0 ? stored : DEFAULT_INDUCTEES) as WallOfFameInductee[],
      selectedIndex: 0,
      isLoading: false,
    }
  },

  getters: {
    totalInductees: (state) => state.inductees.length,
    currentInductee: (state): WallOfFameInductee | null => {
      if (!state.inductees || state.inductees.length === 0) return null
      return state.inductees[state.selectedIndex] || state.inductees[0] || null
    },
  },

  actions: {
    saveToStorage() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.inductees))
      } catch (e) {
        console.error('Failed to save wall of fame', e)
      }
    },

    async fetchInducteesFromBackend() {
      this.isLoading = true
      try {
        const { data } = await http.get('/wall-of-fame/')
        if (Array.isArray(data)) {
          this.inductees = data.map(normalizeBackendInductee)
          this.saveToStorage()
        }
      } catch (e) {
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
      try {
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
        this.saveToStorage()
        return newEntry
      } catch (e) {
        console.warn('Backend API error on addInductee, adding locally', e)
        const newEntry: WallOfFameInductee = {
          ...item,
          id: `fame-${Date.now().toString().slice(-6)}`,
        }
        this.inductees.unshift(newEntry)
        this.saveToStorage()
        return newEntry
      }
    },

    async updateInductee(id: string, updates: Partial<WallOfFameInductee>) {
      try {
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
          this.saveToStorage()
        }
      } catch (e) {
        console.warn('Backend API error on updateInductee, updating locally', e)
        const idx = this.inductees.findIndex((x) => x.id === id)
        if (idx !== -1) {
          this.inductees[idx] = { ...this.inductees[idx], ...updates }
          this.saveToStorage()
        }
      }
    },

    async deleteInductee(id: string) {
      try {
        await http.delete(`/wall-of-fame/${id}/`)
      } catch (e) {
        console.warn('Backend API error on deleteInductee', e)
      }
      const idx = this.inductees.findIndex((x) => x.id === id)
      if (idx !== -1) {
        this.inductees.splice(idx, 1)
        if (this.selectedIndex >= this.inductees.length) {
          this.selectedIndex = Math.max(0, this.inductees.length - 1)
        }
        this.saveToStorage()
      }
    },

    async resetToDefault() {
      await this.fetchInducteesFromBackend()
    },
  },
})
