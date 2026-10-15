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
  voteFee: number // 1000 TSh
  isActive: boolean
  contestantA: Contestant
  contestantB: Contestant
  startDate?: string
  endDate?: string
}

const STORAGE_KEY = 'kicheko_nani_ni_nani_v1'

function createEmptyBattle(): BattleRound {
  return {
    id: 'battle-01',
    title: 'University Stand-up Showdown 2026',
    roundNumber: 1,
    voteFee: 1000,
    isActive: true,
    contestantA: {
      id: 'c-frank',
      name: 'Frank Mollel',
      university: 'Institute of Finance Management',
      universityCode: 'IFM',
      badgeImage: '/taifa/ifm_badge.png',
      photo: '/taifa/frank_mollel_square.png',
      votes: 3840,
    },
    contestantB: {
      id: 'c-neema',
      name: 'Neema Juma',
      university: 'University of Dar es Salaam',
      universityCode: 'UDSM',
      badgeImage: '/taifa/udsm_badge.png',
      photo: '/taifa/neema_juma_square.png',
      votes: 4120,
    },
  }
}

function normalizeBackendBattle(raw: any): BattleRound {
  return {
    id: raw.id || 'battle-01',
    title: raw.title || 'University Stand-up Showdown 2026',
    roundNumber: raw.round_number || raw.roundNumber || 1,
    voteFee: raw.vote_fee || raw.voteFee || 1000,
    isActive: raw.is_active ?? raw.isActive ?? true,
    contestantA: {
      id: raw.contestant_a?.id || 'c-frank',
      name: raw.contestant_a?.name || '',
      university: raw.contestant_a?.university || '',
      universityCode: raw.contestant_a?.universityCode || raw.contestant_a?.university_code || '',
      badgeImage: raw.contestant_a?.badgeImage || raw.contestant_a?.badge || '',
      photo: raw.contestant_a?.photo || '',
      votes: raw.contestant_a?.votes ?? 0,
      bio: raw.contestant_a?.bio || '',
    },
    contestantB: {
      id: raw.contestant_b?.id || 'c-neema',
      name: raw.contestant_b?.name || '',
      university: raw.contestant_b?.university || '',
      universityCode: raw.contestant_b?.universityCode || raw.contestant_b?.university_code || '',
      badgeImage: raw.contestant_b?.badgeImage || raw.contestant_b?.badge || '',
      photo: raw.contestant_b?.photo || '',
      votes: raw.contestant_b?.votes ?? 0,
      bio: raw.contestant_b?.bio || '',
    },
  }
}

export const useNaniNiNaniStore = defineStore('naniNiNani', {
  state: () => {
    let stored: BattleRound | null = null
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        stored = JSON.parse(data)
      }
    } catch (e) {
      console.error('Failed to parse nani-ni-nani battle from storage', e)
    }

    return {
      activeBattle: (stored || createEmptyBattle()) as BattleRound,
      isLoading: false,
      recentVotes: [] as {
        contestantId: string
        contestantName: string
        amount: number
        phone: string
        paymentMethod: string
        timestamp: string
      }[],
    }
  },

  getters: {
    totalVotes: (state) => state.activeBattle.contestantA.votes + state.activeBattle.contestantB.votes,
    voteRevenue: (state) =>
      (state.activeBattle.contestantA.votes + state.activeBattle.contestantB.votes) * state.activeBattle.voteFee,
    leadingContestant: (state) => {
      if (state.activeBattle.contestantA.votes > state.activeBattle.contestantB.votes) {
        return state.activeBattle.contestantA
      } else if (state.activeBattle.contestantB.votes > state.activeBattle.contestantA.votes) {
        return state.activeBattle.contestantB
      }
      return null
    },
    contestantAPercentage: (state) => {
      const total = state.activeBattle.contestantA.votes + state.activeBattle.contestantB.votes
      if (total === 0) return 50
      return Math.round((state.activeBattle.contestantA.votes / total) * 100)
    },
    contestantBPercentage: (state) => {
      const total = state.activeBattle.contestantA.votes + state.activeBattle.contestantB.votes
      if (total === 0) return 50
      return Math.round((state.activeBattle.contestantB.votes / total) * 100)
    },
  },

  actions: {
    saveToStorage() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.activeBattle))
      } catch (e) {
        console.error('Failed to save battle to storage', e)
      }
    },

    async fetchActiveBattle() {
      this.isLoading = true
      try {
        const { data } = await http.get('/nani-ni-nani/active/')
        if (data && data.id) {
          this.activeBattle = normalizeBackendBattle(data)
          this.saveToStorage()
        }
      } catch (e) {
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
    }): Promise<{
      success: boolean
      newVotes: number
      contestantName: string
    }> {
      const count = payload.votesCount || 1

      // 1. Send vote to backend API
      try {
        const { data } = await http.post('/nani-ni-nani/vote/', {
          contestant_id: payload.contestantId,
          payment_method: payload.paymentMethod,
          phone_number: payload.phone,
          votes_count: count,
        })
        if (data && data.success) {
          if (this.activeBattle.contestantA.id === payload.contestantId) {
            this.activeBattle.contestantA.votes = data.newVotes
          } else if (this.activeBattle.contestantB.id === payload.contestantId) {
            this.activeBattle.contestantB.votes = data.newVotes
          }
          this.saveToStorage()

          this.recentVotes.unshift({
            contestantId: payload.contestantId,
            contestantName: data.contestant,
            amount: count * this.activeBattle.voteFee,
            phone: payload.phone,
            paymentMethod: payload.paymentMethod,
            timestamp: new Date().toLocaleTimeString(),
          })
          if (this.recentVotes.length > 50) this.recentVotes.pop()

          return { success: true, newVotes: data.newVotes, contestantName: data.contestant }
        }
      } catch (e) {
        console.warn('Backend vote API error, updating locally', e)
      }

      // 2. Local fallback if offline
      let contestantName = ''
      let newVotes = 0

      if (this.activeBattle.contestantA.id === payload.contestantId) {
        this.activeBattle.contestantA.votes += count
        newVotes = this.activeBattle.contestantA.votes
        contestantName = this.activeBattle.contestantA.name
      } else if (this.activeBattle.contestantB.id === payload.contestantId) {
        this.activeBattle.contestantB.votes += count
        newVotes = this.activeBattle.contestantB.votes
        contestantName = this.activeBattle.contestantB.name
      } else {
        return { success: false, newVotes: 0, contestantName: '' }
      }

      this.recentVotes.unshift({
        contestantId: payload.contestantId,
        contestantName,
        amount: count * this.activeBattle.voteFee,
        phone: payload.phone,
        paymentMethod: payload.paymentMethod,
        timestamp: new Date().toLocaleTimeString(),
      })

      if (this.recentVotes.length > 50) {
        this.recentVotes.pop()
      }

      this.saveToStorage()
      return { success: true, newVotes, contestantName }
    },

    async updateContestants(data: { contestantA: Partial<Contestant>; contestantB: Partial<Contestant> }) {
      this.activeBattle.contestantA = { ...this.activeBattle.contestantA, ...data.contestantA }
      this.activeBattle.contestantB = { ...this.activeBattle.contestantB, ...data.contestantB }
      this.saveToStorage()

      try {
        await http.put('/nani-ni-nani/active/', {
          contestant_a_name: this.activeBattle.contestantA.name,
          contestant_a_university: this.activeBattle.contestantA.university,
          contestant_a_university_code: this.activeBattle.contestantA.universityCode,
          contestant_b_name: this.activeBattle.contestantB.name,
          contestant_b_university: this.activeBattle.contestantB.university,
          contestant_b_university_code: this.activeBattle.contestantB.universityCode,
        })
      } catch (e) {
        console.warn('Backend update battle error', e)
      }
    },

    resetVotes() {
      this.activeBattle.contestantA.votes = 0
      this.activeBattle.contestantB.votes = 0
      this.saveToStorage()
    },

    async resetToDefault() {
      await this.fetchActiveBattle()
    },
  },
})
