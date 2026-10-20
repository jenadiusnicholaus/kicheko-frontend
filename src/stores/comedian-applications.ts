import { defineStore } from 'pinia'
import { http } from '../services/api/http'

export interface ComedianApplication {
  id: string
  userId?: string
  firstName: string
  lastName: string
  username: string
  displayName?: string
  university: string
  phone: string
  bio?: string
  status: 'pending' | 'pending_payment' | 'paid_pending_review' | 'approved' | 'rejected'
  feeAmount: number
  paymentStatus: 'pending' | 'processing' | 'paid' | 'n/a'
  paymentMethod: string
  paymentRef: string
  appliedAt: string
  approvedAt?: string
  rejectedReason?: string
  auditionDate?: string
  auditionVenue?: string
  auditionStatus?: string
  auditionLevel: number
  voteCount: number
  tempPassword?: string
}

export interface VoteListApplicant {
  id: string
  name: string
  username: string
  university: string
  universityCode: string
  universityBadge: string
  auditionLevel: number
  votes: number
}

function normalizeBackendApplication(raw: any): ComedianApplication {
  return {
    id: String(raw.id),
    userId: raw.user_id ? String(raw.user_id) : undefined,
    firstName: raw.first_name || '',
    lastName: raw.last_name || '',
    username: raw.username || '',
    displayName: raw.display_name || '',
    university: raw.university || '',
    phone: raw.phone || raw.phone_number || '',
    status: raw.status || 'pending',
    feeAmount: raw.fee_amount ?? 0,
    paymentStatus: raw.payment_status || 'n/a',
    paymentMethod: raw.payment_method || '',
    paymentRef: raw.payment_reference || '',
    appliedAt: raw.applied_at ? raw.applied_at.replace('T', ' ').slice(0, 16) : '',
    approvedAt: raw.approved_at ? raw.approved_at.replace('T', ' ').slice(0, 16) : undefined,
    rejectedReason: raw.rejected_reason || '',
    auditionDate: raw.audition_date ? raw.audition_date.replace('T', ' ').slice(0, 16) : undefined,
    auditionVenue: raw.audition_venue || '',
    auditionStatus: raw.audition_status || 'pending',
    auditionLevel: raw.audition_level ?? 1,
    voteCount: raw.vote_count ?? 0,
    tempPassword: raw.temp_password || '',
  }
}

const VOTER_KEY_STORAGE = 'kicheko_voter_key'
const VOTED_STORAGE = 'kicheko_voted_ids'

function getVoterKey(): string {
  let key = localStorage.getItem(VOTER_KEY_STORAGE)
  if (!key) {
    key = crypto.randomUUID()
    localStorage.setItem(VOTER_KEY_STORAGE, key)
  }
  return key
}

export function getVotedIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(VOTED_STORAGE) || '[]')
  } catch {
    return []
  }
}

function markVoted(id: string) {
  const ids = getVotedIds()
  if (!ids.includes(id)) {
    ids.push(id)
    localStorage.setItem(VOTED_STORAGE, JSON.stringify(ids))
  }
}

export const useComedianApplicationsStore = defineStore('comedianApplications', {
  state: () => ({
    applications: [] as ComedianApplication[],
    applicationsOpen: true,
    voteList: [] as VoteListApplicant[],
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    totalApplications: (state) => state.applications.length,
    pendingPaymentCount: (state) => state.applications.filter((a) => a.paymentStatus === 'pending').length,
    pendingReviewCount: (state) =>
      state.applications.filter((a) => a.status === 'pending' || a.status === 'paid_pending_review').length,
    approvedCount: (state) => state.applications.filter((a) => a.status === 'approved').length,
    rejectedCount: (state) => state.applications.filter((a) => a.status === 'rejected').length,
    totalFeeRevenue: (state) =>
      state.applications.filter((a) => a.paymentStatus === 'paid').reduce((sum, a) => sum + a.feeAmount, 0),
  },

  actions: {
    async fetchApplicationsFromBackend() {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await http.get('/applications/')
        if (Array.isArray(data)) {
          this.applications = data.map(normalizeBackendApplication)
        }
      } catch (e: any) {
        this.error = e?.message || 'Failed to load applications'
        console.warn('Failed to fetch applications from backend', e)
      } finally {
        this.isLoading = false
      }
    },

    async createApplication(payload: {
      firstName: string
      lastName: string
      username: string
      university: string
      phone: string
      bio?: string
    }): Promise<ComedianApplication> {
      const { data } = await http.post('/applications/', {
        first_name: payload.firstName.trim(),
        last_name: payload.lastName.trim(),
        ...(payload.username.trim() ? { username: payload.username.trim().replace(/^@/, '') } : {}),
        university: payload.university,
        phone: payload.phone.trim(),
        bio: payload.bio || '',
      })
      const newApp = normalizeBackendApplication(data)
      this.applications.unshift(newApp)
      return newApp
    },

    /** Ask the backend to push a mobile-money prompt to the payer's phone. */
    async initiatePayment(id: string, mobileNumber: string): Promise<{ payment_id: string; status: string }> {
      const { data } = await http.post(`/applications/${id}/initiate-payment/`, {
        mobile_number: mobileNumber,
      })
      return data
    },

    /** Single payment-state read — includes the Pay-IT payment_reference. */
    async fetchPaymentStatus(id: string): Promise<{
      payment_confirmed: boolean
      payment_status: string
      payment_reference: string
      status: string
    } | null> {
      try {
        const { data } = await http.get(`/applications/${id}/payment-status/`)
        return data
      } catch {
        return null
      }
    },

    /** Poll until the Pay-IT webhook confirms the payment (or timeout). */
    async waitForPaymentConfirmation(
      id: string,
      { intervalMs = 2500, timeoutMs = 60_000 }: { intervalMs?: number; timeoutMs?: number } = {},
    ): Promise<boolean> {
      const deadline = Date.now() + timeoutMs
      while (Date.now() < deadline) {
        try {
          const { data } = await http.get(`/applications/${id}/payment-status/`)
          if (data?.payment_confirmed || data?.payment_status === 'paid') return true
        } catch {
          // Transient errors — keep polling until the deadline.
        }
        await new Promise((resolve) => setTimeout(resolve, intervalMs))
      }
      return false
    },

    /** Link a Pay-IT payment_id reported by hosted checkout to the application. */
    async recordPayment(id: string, paymentId: string): Promise<ComedianApplication> {
      const { data } = await http.post(`/applications/${id}/payment/`, { payment_id: paymentId })
      const updated = normalizeBackendApplication(data)
      const idx = this.applications.findIndex((a) => a.id === id)
      if (idx !== -1) {
        this.applications[idx] = updated
      }
      return updated
    },

    /** Public config — is the application window open? */
    async fetchConfig(): Promise<boolean> {
      try {
        const { data } = await http.get('/application-config/')
        this.applicationsOpen = !!data?.applications_open
      } catch {
        // Default to open if the config endpoint is unreachable.
      }
      return this.applicationsOpen
    },

    /** Admin: open/close the application window. */
    async setApplicationsOpen(open: boolean): Promise<void> {
      const { data } = await http.patch('/application-config/', { applications_open: open })
      this.applicationsOpen = !!data?.applications_open
    },

    /** Admin: move an application through audition levels 1-4. */
    async setAuditionLevel(id: string, level: number): Promise<void> {
      const { data } = await http.post(`/applications/${id}/set-level/`, { level })
      const updated = normalizeBackendApplication(data)
      const idx = this.applications.findIndex((a) => a.id === id)
      if (idx !== -1) {
        this.applications[idx] = updated
      }
    },

    /** Admin: set one audition level on many applications at once.
     * Returns { skipped } — ids not updated because they aren't approved. */
    async bulkSetAuditionLevel(ids: string[], level: number): Promise<{ skipped: string[] }> {
      const { data } = await http.post('/applications/bulk-set-level/', { ids, level })
      const updated: ComedianApplication[] = (data?.updated || []).map(normalizeBackendApplication)
      for (const upd of updated) {
        const idx = this.applications.findIndex((a) => a.id === upd.id)
        if (idx !== -1) {
          this.applications[idx] = upd
        }
      }
      return { skipped: data?.skipped || [] }
    },

    /** Public vote list — paid applicants at audition level >= 2. */
    async fetchVoteList(): Promise<void> {
      const { data } = await http.get('/applications/vote-list/')
      this.applicationsOpen = !!data?.applications_open
      this.voteList = (data?.applicants || []).map((a: any) => ({
        id: String(a.id),
        name: a.name || '',
        username: a.username || '',
        university: a.university || '',
        universityCode: a.university_code || '',
        universityBadge: a.university_badge || '',
        auditionLevel: a.audition_level ?? 2,
        votes: a.votes ?? 0,
      }))
    },

    /** Cast one vote for an applicant; returns the new tally. */
    async castVote(id: string): Promise<number | null> {
      const { data } = await http.post(`/applications/${id}/vote/`, {
        voter_key: getVoterKey(),
      })
      markVoted(id)
      const item = this.voteList.find((a) => a.id === id)
      if (item) item.votes = data?.votes ?? item.votes
      return data?.votes ?? null
    },

    async approveApplication(id: string): Promise<boolean> {
      const { data } = await http.post(`/applications/${id}/approve/`)
      const updated = normalizeBackendApplication(data)
      const idx = this.applications.findIndex((a) => a.id === id)
      if (idx !== -1) {
        this.applications[idx] = updated
      }
      return true
    },

    async rejectApplication(id: string, reason = 'Application requirements not met'): Promise<boolean> {
      await http.post(`/applications/${id}/reject/`, { reason })

      const app = this.applications.find((a) => a.id === id)
      if (app) {
        app.status = 'rejected'
        app.rejectedReason = reason
      }
      return true
    },

    async sendCredentials(id: string) {
      const { data } = await http.post(`/applications/${id}/send_credentials/`)
      if (data && data.application) {
        const updated = normalizeBackendApplication(data.application)
        const idx = this.applications.findIndex((a) => a.id === id)
        if (idx !== -1) {
          this.applications[idx] = updated
        }
      }
      return data
    },

    async deleteApplication(id: string): Promise<boolean> {
      await http.delete(`/applications/${id}/`)
      const idx = this.applications.findIndex((a) => a.id === id)
      if (idx === -1) return false
      this.applications.splice(idx, 1)
      return true
    },

    async resetToDefault() {
      await this.fetchApplicationsFromBackend()
    },
  },
})
