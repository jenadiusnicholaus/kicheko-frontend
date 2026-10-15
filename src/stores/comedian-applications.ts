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
  status: 'pending_payment' | 'paid_pending_review' | 'approved' | 'rejected'
  feeAmount: number // 10000 TSh
  paymentStatus: 'pending' | 'paid'
  paymentMethod: string
  paymentRef: string
  appliedAt: string
  approvedAt?: string
  rejectedReason?: string
  auditionDate?: string
  auditionVenue?: string
  auditionStatus?: string
  tempPassword?: string
}

const STORAGE_KEY = 'kicheko_comedian_applications_v1'

function normalizeBackendApplication(raw: any): ComedianApplication {
  return {
    id: String(raw.id),
    userId: raw.user_id ? String(raw.user_id) : undefined,
    firstName: raw.first_name || '',
    lastName: raw.last_name || '',
    username: raw.username || '',
    displayName: raw.display_name || '',
    university: raw.university || '',
    phone: raw.phone_number || '',
    status: raw.status || 'pending_payment',
    feeAmount: raw.fee_amount || 10000,
    paymentStatus: raw.payment_status || 'pending',
    paymentMethod: raw.payment_method || '',
    paymentRef: raw.payment_reference || '',
    appliedAt: raw.applied_at ? raw.applied_at.replace('T', ' ').slice(0, 16) : '',
    approvedAt: raw.approved_at ? raw.approved_at.replace('T', ' ').slice(0, 16) : undefined,
    rejectedReason: raw.rejected_reason || '',
    auditionDate: raw.audition_date ? raw.audition_date.replace('T', ' ').slice(0, 16) : undefined,
    auditionVenue: raw.audition_venue || '',
    auditionStatus: raw.audition_status || 'pending',
    tempPassword: raw.temp_password || '',
  }
}

export const useComedianApplicationsStore = defineStore('comedianApplications', {
  state: () => {
    let stored: ComedianApplication[] = []
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        stored = JSON.parse(data)
      }
    } catch (e) {
      console.error('Failed to load applications from localStorage', e)
    }

    return {
      applications: (stored || []) as ComedianApplication[],
      isLoading: false,
    }
  },

  getters: {
    totalApplications: (state) => state.applications.length,
    pendingPaymentCount: (state) => state.applications.filter((a) => a.paymentStatus === 'pending').length,
    pendingReviewCount: (state) => state.applications.filter((a) => a.status === 'paid_pending_review').length,
    approvedCount: (state) => state.applications.filter((a) => a.status === 'approved').length,
    rejectedCount: (state) => state.applications.filter((a) => a.status === 'rejected').length,
    totalFeeRevenue: (state) =>
      state.applications.filter((a) => a.paymentStatus === 'paid').reduce((sum, a) => sum + a.feeAmount, 0),
  },

  actions: {
    saveToStorage() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.applications))
      } catch (e) {
        console.error('Failed to save applications to localStorage', e)
      }
    },

    async fetchApplicationsFromBackend() {
      this.isLoading = true
      try {
        const { data } = await http.get('/applications/')
        if (Array.isArray(data)) {
          this.applications = data.map(normalizeBackendApplication)
          this.saveToStorage()
        }
      } catch (e) {
        // Fallback to local storage gracefully if backend is offline
        console.warn('Backend API offline or unreachable, using local store', e)
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
      // 1. Try real backend API
      try {
        const { data } = await http.post('/applications/', {
          first_name: payload.firstName.trim(),
          last_name: payload.lastName.trim(),
          username: payload.username.trim().replace(/^@/, ''),
          university: payload.university,
          phone_number: payload.phone.trim(),
          bio: payload.bio || '',
        })
        const newApp = normalizeBackendApplication(data)
        this.applications.unshift(newApp)
        this.saveToStorage()
        return newApp
      } catch (e) {
        console.warn('Backend API error, registering locally in store', e)
      }

      // 2. Local fallback
      const newApp: ComedianApplication = {
        id: `app-${Date.now().toString().slice(-6)}`,
        firstName: payload.firstName.trim(),
        lastName: payload.lastName.trim(),
        username: payload.username.trim().replace(/^@/, ''),
        university: payload.university,
        phone: payload.phone.trim(),
        bio: payload.bio || '',
        status: 'pending_payment',
        feeAmount: 10000,
        paymentStatus: 'pending',
        paymentMethod: '',
        paymentRef: '',
        appliedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      }

      this.applications.unshift(newApp)
      this.saveToStorage()
      return newApp
    },

    async payApplicationFee(id: string, paymentMethod: string, paymentRef?: string): Promise<boolean> {
      const refCode =
        paymentRef || `${paymentMethod.toUpperCase().slice(0, 2)}-${Math.floor(1000000 + Math.random() * 9000000)}`

      // 1. Try backend API
      try {
        await http.post(`/applications/${id}/pay/`, {
          payment_method: paymentMethod,
          payment_reference: refCode,
        })
      } catch (e) {
        console.warn('Backend API pay error, updating locally', e)
      }

      // 2. Update local state
      const app = this.applications.find((a) => a.id === id)
      if (app) {
        app.paymentStatus = 'paid'
        app.paymentMethod = paymentMethod
        app.paymentRef = refCode
        app.status = 'paid_pending_review'
        this.saveToStorage()
      }
      return true
    },

    async approveApplication(id: string): Promise<boolean> {
      // 1. Try backend API
      try {
        const { data } = await http.post(`/applications/${id}/approve/`)
        const updated = normalizeBackendApplication(data)
        const idx = this.applications.findIndex((a) => a.id === id)
        if (idx !== -1) {
          this.applications[idx] = updated
          this.saveToStorage()
          return true
        }
      } catch (e) {
        console.warn('Backend API approve error, approving locally', e)
      }

      // 2. Update local state
      const app = this.applications.find((a) => a.id === id)
      if (!app) return false

      app.status = 'approved'
      app.paymentStatus = 'paid'
      app.approvedAt = new Date().toISOString().replace('T', ' ').slice(0, 16)
      app.auditionStatus = 'scheduled'
      app.auditionVenue = `${app.university} Main Hall`
      this.saveToStorage()
      return true
    },

    async rejectApplication(id: string, reason = 'Application requirements not met'): Promise<boolean> {
      // 1. Try backend API
      try {
        await http.post(`/applications/${id}/reject/`, { reason })
      } catch (e) {
        console.warn('Backend API reject error, rejecting locally', e)
      }

      // 2. Update local state
      const app = this.applications.find((a) => a.id === id)
      if (!app) return false

      app.status = 'rejected'
      app.rejectedReason = reason
      this.saveToStorage()
      return true
    },

    async sendCredentials(id: string) {
      try {
        const { data } = await http.post(`/applications/${id}/send_credentials/`)
        if (data && data.application) {
          const updated = normalizeBackendApplication(data.application)
          const idx = this.applications.findIndex((a) => a.id === id)
          if (idx !== -1) {
            this.applications[idx] = updated
            this.saveToStorage()
          }
        }
        return data
      } catch (e) {
        console.error('Failed to send credentials via API', e)
        throw e
      }
    },

    deleteApplication(id: string): boolean {
      const idx = this.applications.findIndex((a) => a.id === id)
      if (idx === -1) return false

      this.applications.splice(idx, 1)
      this.saveToStorage()
      return true
    },

    async resetToDefault() {
      await this.fetchApplicationsFromBackend()
    },
  },
})
