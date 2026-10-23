import { defineStore } from 'pinia'
import { http } from '../services/api/http'

export interface VotePurchase {
  id: string | number
  voted_for: string
  university?: string
  battle_id?: number
  battle?: string
  votes_count: number
  amount: number
  payment_status: string
  confirmed: boolean
  payment_id: string
  phone: string
  created_at: string
}

export interface VoteBoardEntry {
  application_id?: string
  battle_id?: number
  battle?: string
  name: string
  votes: number
  revenue: number
}

export interface VoteTotals {
  purchases: number
  confirmed: number
  votes: number
  revenue: number
}

export interface VoteSection {
  totals: VoteTotals
  leaderboard: VoteBoardEntry[]
  votes: VotePurchase[]
}

const emptySection = (): VoteSection => ({
  totals: { purchases: 0, confirmed: 0, votes: 0, revenue: 0 },
  leaderboard: [],
  votes: [],
})

export const useVoteStatsStore = defineStore('voteStats', {
  state: () => ({
    comedian: emptySection() as VoteSection,
    nani: emptySection() as VoteSection,
    isLoading: false,
    error: null as string | null,
    fetchedAt: null as number | null,
  }),

  actions: {
    async fetchVoteStats(): Promise<void> {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await http.get('/payments/vote-stats/')
        this.comedian = { ...emptySection(), ...(data?.comedian || {}) }
        this.nani = { ...emptySection(), ...(data?.nani || {}) }
        this.fetchedAt = Date.now()
      } catch (e: any) {
        this.error = e?.message || 'Failed to load vote stats'
      } finally {
        this.isLoading = false
      }
    },
  },
})
