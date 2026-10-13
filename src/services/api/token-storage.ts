/**
 * Token persistence. Kept separate from the Pinia store so the axios
 * interceptors can read/rotate tokens without importing stores
 * (avoids circular imports).
 */
const ACCESS_KEY = 'kicheko.access_token'
const REFRESH_KEY = 'kicheko.refresh_token'
const USER_KEY = 'kicheko.user'

export const tokenStorage = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  getUser: <T = unknown>(): T | null => {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  },
  setSession: (access: string, refresh: string, user?: unknown) => {
    localStorage.setItem(ACCESS_KEY, access)
    localStorage.setItem(REFRESH_KEY, refresh)
    if (user !== undefined) localStorage.setItem(USER_KEY, JSON.stringify(user))
  },
  setUser: (user: unknown) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  clear: () => {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
    localStorage.removeItem(USER_KEY)
  },
}
