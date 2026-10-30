import { defineStore } from 'pinia'
import {
  authApi,
  normalizeUser,
  tokenStorage,
  type AuthSession,
  type CurrentUser,
  type LoginPayload,
  type RegisterPayload,
  type UpdateProfilePayload,
} from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: tokenStorage.getUser<CurrentUser>(),
    accessToken: tokenStorage.getAccess() as string | null,
    refreshToken: tokenStorage.getRefresh() as string | null,
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.accessToken),
    isAdmin: (state) => Boolean(state.user?.is_staff),
    isComedian: (state) => Boolean(state.user?.is_comedian),
  },

  actions: {
    async login(payload: LoginPayload) {
      this.setSession(await authApi.login(payload))
    },

    async register(payload: RegisterPayload) {
      this.setSession(await authApi.register(payload))
    },

    async googleLogin(credential: string) {
      this.setSession(await authApi.googleLogin(credential))
    },

    async fetchMe() {
      try {
        this.setUser(normalizeUser(await authApi.me()))
        return this.user
      } catch (e) {
        this.logout()
        throw e
      }
    },

    async updateProfile(payload: UpdateProfilePayload | FormData) {
      this.setUser(normalizeUser(await authApi.updateMe(payload)))
    },

    setSession(session: AuthSession) {
      const user = normalizeUser(session.user)
      tokenStorage.setSession(session.access, session.refresh, user)
      this.accessToken = session.access
      this.refreshToken = session.refresh
      this.user = user
    },

    setUser(user: CurrentUser) {
      this.user = user
      tokenStorage.setUser(user)
    },

    logout() {
      tokenStorage.clear()
      this.user = null
      this.accessToken = null
      this.refreshToken = null
    },
  },
})
