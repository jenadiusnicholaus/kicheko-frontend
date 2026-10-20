import { defineStore } from 'pinia'
import { http } from '../services/api/http'
import { resolveMediaUrl } from '../services/api/config'

export interface Contestant {
  id: string
  name: string
  university: string
  universityCode: string
  badgeImage: string
  photo: string
  videoUrl: string
  votes: number
  bio?: string
}

export interface BattleRound {
  id: string
  title: string
  roundNumber: number
  voteFee: number
  themeColor: string
  status: 'draft' | 'active' | 'ended'
  isActive: boolean
  category: string | null
  categoryName: string
  contestantA: Contestant
  contestantB: Contestant
  totalVotes?: number
  voteRevenue?: number
}

function normalizeContestant(raw: any): Contestant {
  return {
    id: raw?.id || '',
    name: raw?.name || '',
    university: raw?.university || '',
    universityCode: raw?.universityCode || raw?.university_code || '',
    badgeImage: resolveMediaUrl(raw?.badgeImage || raw?.badge) || '',
    photo: resolveMediaUrl(raw?.photo) || '',
    videoUrl: raw?.videoUrl || raw?.video_url || '',
    votes: raw?.votes ?? 0,
    bio: raw?.bio || '',
  }
}

function normalizeBackendBattle(raw: any): BattleRound {
  return {
    id: raw.id,
    title: raw.title,
    roundNumber: raw.round_number || raw.roundNumber,
    voteFee: raw.vote_fee || raw.voteFee,
    themeColor: raw.theme_color || raw.themeColor || '#FEBF01',
    status: raw.status || (raw.is_active ? 'active' : 'ended'),
    isActive: raw.is_active ?? raw.isActive ?? false,
    category: raw.category || null,
    categoryName: raw.category_name || raw.categoryName || '',
    contestantA: normalizeContestant(raw.contestant_a),
    contestantB: normalizeContestant(raw.contestant_b),
    totalVotes: raw.total_votes,
    voteRevenue: raw.vote_revenue,
  }
}

/** Build the flat multipart/JSON payload the write serializer expects. */
function battleWritePayload(b: Partial<BattleRound>): Record<string, string> {
  const p: Record<string, string> = {}
  if (b.title !== undefined) p.title = b.title
  if (b.roundNumber !== undefined) p.round_number = String(b.roundNumber)
  if (b.voteFee !== undefined) p.vote_fee = String(b.voteFee)
  if (b.themeColor !== undefined) p.theme_color = b.themeColor
  if (b.status !== undefined) p.status = b.status
  if (b.category) p.category = b.category
  if (b.contestantA) {
    p.contestant_a_id = b.contestantA.id
    p.contestant_a_name = b.contestantA.name
    p.contestant_a_university = b.contestantA.university
    p.contestant_a_university_code = b.contestantA.universityCode
    p.contestant_a_video_url = b.contestantA.videoUrl || ''
    p.contestant_a_votes = String(b.contestantA.votes)
  }
  if (b.contestantB) {
    p.contestant_b_id = b.contestantB.id
    p.contestant_b_name = b.contestantB.name
    p.contestant_b_university = b.contestantB.university
    p.contestant_b_university_code = b.contestantB.universityCode
    p.contestant_b_video_url = b.contestantB.videoUrl || ''
    p.contestant_b_votes = String(b.contestantB.votes)
  }
  return p
}

export interface BattleImageFiles {
  contestantABadge?: File
  contestantAPhoto?: File
  contestantBBadge?: File
  contestantBPhoto?: File
}

export const useNaniNiNaniStore = defineStore('naniNiNani', {
  state: () => ({
    activeBattle: null as BattleRound | null,
    battles: [] as BattleRound[],
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

    async fetchBattles() {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await http.get('/nani-ni-nani/battles/')
        if (Array.isArray(data)) {
          this.battles = data.map(normalizeBackendBattle)
        }
      } catch (e: any) {
        this.error = e?.message || 'Failed to load battles'
        console.warn('Failed to fetch battles from backend', e)
      } finally {
        this.isLoading = false
      }
    },

    async createBattle(battle: Partial<BattleRound>, files: BattleImageFiles = {}) {
      const fd = new FormData()
      for (const [k, v] of Object.entries(battleWritePayload(battle))) fd.append(k, v)
      if (files.contestantABadge) fd.append('contestant_a_badge', files.contestantABadge)
      if (files.contestantAPhoto) fd.append('contestant_a_photo', files.contestantAPhoto)
      if (files.contestantBBadge) fd.append('contestant_b_badge', files.contestantBBadge)
      if (files.contestantBPhoto) fd.append('contestant_b_photo', files.contestantBPhoto)
      const { data } = await http.post('/nani-ni-nani/battles/', fd)
      const created = normalizeBackendBattle(data)
      this.battles.unshift(created)
      return created
    },

    async updateBattle(id: string, updates: Partial<BattleRound>, files: BattleImageFiles = {}) {
      const fd = new FormData()
      for (const [k, v] of Object.entries(battleWritePayload(updates))) fd.append(k, v)
      if (files.contestantABadge) fd.append('contestant_a_badge', files.contestantABadge)
      if (files.contestantAPhoto) fd.append('contestant_a_photo', files.contestantAPhoto)
      if (files.contestantBBadge) fd.append('contestant_b_badge', files.contestantBBadge)
      if (files.contestantBPhoto) fd.append('contestant_b_photo', files.contestantBPhoto)
      const { data } = await http.put(`/nani-ni-nani/battles/${id}/`, fd)
      const updated = normalizeBackendBattle(data)
      const idx = this.battles.findIndex((b) => b.id === id)
      if (idx !== -1) this.battles[idx] = updated
      if (this.activeBattle?.id === id) this.activeBattle = updated
      return updated
    },

    async deleteBattle(id: string) {
      await http.delete(`/nani-ni-nani/battles/${id}/`)
      const idx = this.battles.findIndex((b) => b.id === id)
      if (idx !== -1) this.battles.splice(idx, 1)
    },

    async castVote(payload: {
      contestantId: string
      paymentMethod: string
      phone: string
      votesCount?: number
      battleId?: string
    }): Promise<{ success: boolean; newVotes: number; contestantName: string }> {
      const count = payload.votesCount || 1

      const { data } = await http.post('/nani-ni-nani/vote/', {
        contestant_id: payload.contestantId,
        payment_method: payload.paymentMethod,
        phone_number: payload.phone,
        votes_count: count,
        ...(payload.battleId ? { battle_id: payload.battleId } : {}),
      })

      if (data && data.success) {
        const applyVotes = (b: BattleRound | null | undefined) => {
          if (!b) return
          if (b.contestantA.id === payload.contestantId) b.contestantA.votes = data.newVotes
          else if (b.contestantB.id === payload.contestantId) b.contestantB.votes = data.newVotes
        }
        applyVotes(this.activeBattle)
        applyVotes(this.battles.find((b) => b.id === (payload.battleId || this.activeBattle?.id)))

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

      await this.updateBattle(this.activeBattle.id, {
        contestantA: this.activeBattle.contestantA,
        contestantB: this.activeBattle.contestantB,
      })
    },

    async resetToDefault() {
      await this.fetchActiveBattle()
    },
  },
})
