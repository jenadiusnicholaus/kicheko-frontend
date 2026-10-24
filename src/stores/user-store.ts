import { defineStore } from 'pinia'
import { useAuthStore } from './auth-store'
import { resolveMediaUrl } from '../services/api/config'

/**
 * Read-only view of the logged-in user's profile, sourced from the auth
 * store (GET /me data). Kept as a separate store because the preferences
 * components consume it under the `useUserStore` name.
 */
export const useUserStore = defineStore('user', {
  state: () => ({
    is2FAEnabled: false,
  }),

  getters: {
    userName: () => {
      const user = useAuthStore().user
      return user?.display_name || user?.username || ''
    },
    email: () => useAuthStore().user?.email || '',
    memberSince: () => {
      const raw = (useAuthStore().user as { date_joined?: string } | null)?.date_joined
      return raw ? new Date(raw).toLocaleDateString() : ''
    },
    pfp: () => resolveMediaUrl(useAuthStore().user?.avatar),
  },

  actions: {
    toggle2FA() {
      this.is2FAEnabled = !this.is2FAEnabled
    },

    async changeUserName(userName: string) {
      await useAuthStore().updateProfile({ display_name: userName })
    },
  },
})
