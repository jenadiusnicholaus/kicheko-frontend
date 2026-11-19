import { defineStore } from 'pinia'
import { http } from '../services/api/http'

export interface VotePackage {
  id: string
  name: string
  votes: number
  price: number
  applies_to: 'all' | 'comedian' | 'nani'
  is_active: boolean
  sort_order: number
  created_at?: string
}

export type VotePurpose = 'comedian' | 'nani'

function normalizePackage(raw: any): VotePackage {
  return {
    id: raw.id,
    name: raw.name || '',
    votes: Number(raw.votes) || 0,
    price: Number(raw.price) || 0,
    applies_to: raw.applies_to || 'all',
    is_active: raw.is_active ?? true,
    sort_order: Number(raw.sort_order) || 0,
    created_at: raw.created_at,
  }
}

export const useVotePackagesStore = defineStore('votePackages', {
  state: () => ({
    packages: [] as VotePackage[],
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    activePackages: (state) => state.packages.filter((p) => p.is_active),
    forPurpose: (state) => (purpose: VotePurpose) =>
      state.packages.filter((p) => p.is_active && (p.applies_to === purpose || p.applies_to === 'all')),
  },

  actions: {
    async fetchPackages(purpose?: VotePurpose) {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await http.get('/vote-packages/', {
          params: purpose ? { purpose } : undefined,
        })
        if (Array.isArray(data)) {
          this.packages = data.map(normalizePackage)
        }
      } catch (e: any) {
        this.error = e?.message || 'Failed to load vote packages'
        console.warn('Failed to fetch vote packages', e)
      } finally {
        this.isLoading = false
      }
    },

    async createPackage(payload: Omit<VotePackage, 'id' | 'created_at'>) {
      const { data } = await http.post('/vote-packages/', payload)
      const created = normalizePackage(data)
      this.packages.unshift(created)
      return created
    },

    async updatePackage(id: string, updates: Partial<VotePackage>) {
      const { data } = await http.put(`/vote-packages/${id}/`, updates)
      const idx = this.packages.findIndex((p) => p.id === id)
      if (idx !== -1) this.packages[idx] = normalizePackage(data)
      return data
    },

    async deletePackage(id: string) {
      await http.delete(`/vote-packages/${id}/`)
      const idx = this.packages.findIndex((p) => p.id === id)
      if (idx !== -1) this.packages.splice(idx, 1)
    },
  },
})
