import { defineStore } from 'pinia'
import { http } from '../services/api/http'

export interface VotingBatch {
  id: number
  title: string
  level: number
  votingOpen: boolean
  createdAt: string
  applicantCount: number
}

function normalizeBatch(raw: any): VotingBatch {
  return {
    id: raw.id,
    title: raw.title,
    level: raw.level,
    votingOpen: raw.voting_open,
    createdAt: raw.created_at,
    applicantCount: raw.applicant_count ?? 0,
  }
}

export const useVotingBatchesStore = defineStore('votingBatches', {
  state: () => ({
    batches: [] as VotingBatch[],
    isLoading: false,
  }),

  actions: {
    async fetchBatches(): Promise<void> {
      this.isLoading = true
      try {
        const { data } = await http.get('/voting-batches/')
        if (Array.isArray(data)) {
          this.batches = data.map(normalizeBatch)
        }
      } finally {
        this.isLoading = false
      }
    },

    async createBatch(payload: { title: string; level: number }): Promise<VotingBatch> {
      const { data } = await http.post('/voting-batches/', payload)
      return normalizeBatch(data)
    },

    async updateBatch(
      id: number,
      payload: { title?: string; level?: number; votingOpen?: boolean },
    ): Promise<VotingBatch> {
      const { data } = await http.patch(`/voting-batches/${id}/`, {
        ...(payload.title !== undefined ? { title: payload.title } : {}),
        ...(payload.level !== undefined ? { level: payload.level } : {}),
        ...(payload.votingOpen !== undefined ? { voting_open: payload.votingOpen } : {}),
      })
      return normalizeBatch(data)
    },

    async deleteBatch(id: number): Promise<void> {
      await http.delete(`/voting-batches/${id}/`)
    },

    async addApplicants(id: number, ids: string[]): Promise<{ skipped: string[] }> {
      const { data } = await http.post(`/voting-batches/${id}/add-applicants/`, { ids })
      return { skipped: data?.skipped || [] }
    },

    async removeApplicants(id: number, ids: string[]): Promise<void> {
      await http.post(`/voting-batches/${id}/remove-applicants/`, { ids })
    },
  },
})
