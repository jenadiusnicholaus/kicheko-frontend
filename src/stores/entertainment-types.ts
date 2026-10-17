import { defineStore } from 'pinia'
import { http } from '../services/api/http'
import { resolveMediaUrl } from '../services/api/config'

export interface EntertainmentType {
  id: string
  name: string
  description: string
  icon: string
  is_active: boolean
  created_at?: string
}

function normalizeType(raw: any): EntertainmentType {
  return {
    id: raw.id,
    name: raw.name || '',
    description: raw.description || '',
    icon: resolveMediaUrl(raw.icon),
    is_active: raw.is_active ?? true,
    created_at: raw.created_at,
  }
}

export const useEntertainmentTypesStore = defineStore('entertainmentTypes', {
  state: () => ({
    types: [] as EntertainmentType[],
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    activeTypes: (state) => state.types.filter((t) => t.is_active),
  },

  actions: {
    async fetchTypes() {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await http.get('/entertainment-types/')
        if (Array.isArray(data)) {
          this.types = data.map(normalizeType)
        }
      } catch (e: any) {
        this.error = e?.message || 'Failed to load categories'
        console.warn('Failed to fetch entertainment types', e)
      } finally {
        this.isLoading = false
      }
    },

    async createType(payload: { name: string; description?: string }, iconFile?: File) {
      const fd = new FormData()
      fd.append('name', payload.name)
      if (payload.description) fd.append('description', payload.description)
      if (iconFile) fd.append('icon', iconFile)
      const { data } = await http.post('/entertainment-types/', fd)
      const created = normalizeType(data)
      this.types.unshift(created)
      return created
    },

    async updateType(id: string, updates: Partial<EntertainmentType>, iconFile?: File) {
      const fd = new FormData()
      if (updates.name !== undefined) fd.append('name', updates.name)
      if (updates.description !== undefined) fd.append('description', updates.description)
      if (updates.is_active !== undefined) fd.append('is_active', String(updates.is_active))
      if (iconFile) fd.append('icon', iconFile)
      const { data } = await http.put(`/entertainment-types/${id}/`, fd)
      const idx = this.types.findIndex((t) => t.id === id)
      if (idx !== -1) this.types[idx] = normalizeType(data)
      return data
    },

    async deleteType(id: string) {
      await http.delete(`/entertainment-types/${id}/`)
      const idx = this.types.findIndex((t) => t.id === id)
      if (idx !== -1) this.types.splice(idx, 1)
    },
  },
})
