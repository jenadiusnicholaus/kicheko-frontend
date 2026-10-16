import { defineStore } from 'pinia'
import { http } from '../services/api/http'

export interface Contestant {
  id: string
  name: string
  university: string
  universityCode: string
  badgeImage: string
  photo: string
  votes: number
  bio?: string
}

export interface BattleRound {
  id: string
  title: string
  roundNumber: number
  voteFee: number
  isActive: boolean
  contestantA: Contestant
  contestantB: Contestant
  startDate?: string
  endDate?: string
}

function normalizeBackendBattle(raw: any): BattleRound {
  return {
    id: raw.id,
    title: raw.title,
    roundNumber: raw.round_number || raw.roundNumber,
    voteFee: raw.vote_fee || raw.voteFee,
    isActive: raw.is_active ?? raw.isActive,
    contestantA: {
      id: raw.contestant_a?.id,
      name: raw.contestant_a?.name,
      university: raw.contestant_a?.university,
      universityCode: raw.contestant_a?.universityCode || raw.contestant_a?.university_code,
      badgeImage: raw.contestant_a?.badgeImage || raw.contestant_a?.badge,
      photo: raw.contestant_a?.photo,
      votes: raw.contestant_a?.votes ?? 0,
      bio: raw.contestant_a?.bio,
    },
    contestantB: {
      id: raw.contestant_b?.id,
      name: raw.contestant_b?.name,
      university: raw.contestant_b?.university,
      universityCode: raw.contestant_b?.universityCode || raw.contestant_b?.university_code,
      badgeImage: raw.contestant_b?.badgeImage || raw.contestant_b?.badge,
      photo: raw.contestant_b?.photo,
      votes: raw.contestant_b?.votes ?? 0,
      bio: raw.contestant_b?.bio,
    },
  }
}

export const useNaniNiNaniStore = defineStore('naniNiNani', {
  state: () => ({
    activeBattle: null as BattleRound | null,
    isLoading: false,
    error: null as string | null,
    recentVotes: [] as {
      contestantId: string
      contestantName: string
      amount: number
      phone: string
      paymentMethod: string
      timestamp: string
    }[],
  }),

  getters: {
    totalVotes: (state) =>
      state.activeBattle ? state.activeBattle.contestantA.votes + state.activeBattle.contestantB.votes : 0,
    voteRevenue: (state) =>
      state.activeBattle
        ? (state.activeBattle.contestantA.votes + state.activeBattle.contestantB.votes) * state.activeBattle.voteFee
        : 0,
    leadingContestant: (state) => {
      if (!state.activeBattle) return null
      if (state.activeBattle.contestantA.votes > state.activeBattle.contestantB.votes) {
        return state.activeBattle.contestantA
      } else if (state.activeBattle.contestantB.votes > state.activeBattle.contestantA.votes) {
        return state.activeBattle.contestantB
      }
      return null
    },
    contestantAPercentage: (state) => {
      if (!state.activeBattle) return 0
      const total = state.activeBattle.contestantA.votes + state.activeBattle.contestantB.votes
      if (total === 0) return 50
      return Math.round((state.activeBattle.contestantA.votes / total) * 100)
    },
    contestantBPercentage: (state) => {
      if (!state.activeBattle) return 0
      const total = state.activeBattle.contestantA.votes + state.activeBattle.contestantB.votes
      if (total === 0) return 50
      return Math.round((state.activeBattle.contestantB.votes / total) * 100)
    },
  },

  actions: {
    async fetchActiveBattle() {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await http.get('/nani-ni-nani/active/')
        if (data && data.id) {
          this.activeBattle = normalizeBackendBattle(data)
        }
      } catch (e: any) {
        this.error = e?.message || 'Failed to load battle'
        console.warn('Failed to fetch active battle from backend', e)
      } finally {
        this.isLoading = false
      }
    },

    async castVote(payload: {
      contestantId: string
      paymentMethod: string
      phone: string
      votesCount?: number
    }): Promise<{ success: boolean; newVotes: number; contestantName: string }> {
      const count = payload.votesCount || 1

      const { data } = await http.post('/nani-ni-nani/vote/', {
        contestant_id: payload.contestantId,
        payment_method: payload.paymentMethod,
        phone_number: payload.phone,
        votes_count: count,
      })

      if (data && data.success) {
        if (this.activeBattle?.contestantA.id === payload.contestantId) {
          this.activeBattle.contestantA.votes = data.newVotes
        } else if (this.activeBattle?.contestantB.id === payload.contestantId) {
          this.activeBattle.contestantB.votes = data.newVotes
        }

        this.recentVotes.unshift({
          contestantId: payload.contestantId,
          contestantName: data.contestantName,
          amount: count * (this.activeBattle?.voteFee || 0),
          phone: payload.phone,
          paymentMethod: payload.paymentMethod,
          timestamp: new Date().toLocaleTimeString(),
        })
        if (this.recentVotes.length > 50) this.recentVotes.pop()

        return { success: true, newVotes: data.newVotes, contestantName: data.contestantName }
      }

      return { success: false, newVotes: 0, contestantName: '' }
    },

    async updateContestants(data: { contestantA: Partial<Contestant>; contestantB: Partial<Contestant> }) {
      if (!this.activeBattle) return

      this.activeBattle.contestantA = { ...this.activeBattle.contestantA, ...data.contestantA }
      this.activeBattle.contestantB = { ...this.activeBattle.contestantB, ...data.contestantB }

      await http.put('/nani-ni-nani/active/', {
        contestant_a_name: this.activeBattle.contestantA.name,
        contestant_a_university: this.activeBattle.contestantA.university,
        contestant_a_university_code: this.activeBattle.contestantA.universityCode,
        contestant_b_name: this.activeBattle.contestantB.name,
        contestant_b_university: this.activeBattle.contestantB.university,
        contestant_b_university_code: this.activeBattle.contestantB.universityCode,
      })
    },

    async resetToDefault() {
      await this.fetchActiveBattle()
    },
  },
})
