import { defineStore } from 'pinia'
import { http } from '../services/api/http'

export interface University {
  id: string
  name: string
  code: string
  badge: string
  location: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export const useUniversitiesStore = defineStore('universities', {
  state: () => ({
    universities: [] as University[],
    isLoading: false,
  }),

  getters: {
    totalUniversities: (state) => state.universities.length,
    activeUniversities: (state) => state.universities.filter((u) => u.is_active),
    universityNames: (state) => state.universities.filter((u) => u.is_active).map((u) => `${u.code} - ${u.name}`),
  },

  actions: {
    async fetchUniversities() {
      this.isLoading = true
      try {
        const { data } = await http.get<University[]>('/universities/')
        if (Array.isArray(data)) {
          this.universities = data
        }
      } catch (e) {
        console.warn('Failed to load universities from API', e)
      } finally {
        this.isLoading = false
      }
    },

    async createUniversity(payload: { name: string; code: string; badge?: string; location?: string }) {
      const { data } = await http.post<University>('/universities/', {
        name: payload.name,
        code: payload.code.toUpperCase().trim(),
        badge: payload.badge || '/taifa/udsm_badge.png',
        location: payload.location || 'Tanzania',
        is_active: true,
      })
      this.universities.unshift(data)
      return data
    },

    async updateUniversity(id: string, payload: Partial<University>) {
      const { data } = await http.put<University>(`/universities/${id}/`, payload)
      const idx = this.universities.findIndex((u) => u.id === id)
      if (idx !== -1) {
        this.universities[idx] = data
      }
      return data
    },

    async deleteUniversity(id: string) {
      await http.delete(`/universities/${id}/`)
      const idx = this.universities.findIndex((u) => u.id === id)
      if (idx !== -1) {
        this.universities.splice(idx, 1)
      }
    },
  },
})
