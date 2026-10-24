import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { apiConfig } from './config'
import { tokenStorage } from './token-storage'

export const http = axios.create({
  baseURL: apiConfig.baseUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

/** Client for public endpoints — never attaches the session token, so calls
 * are not associated with a logged-in account (e.g. the open application
 * form, which must create a fresh application for every submission). */
export const publicHttp = axios.create({
  baseURL: apiConfig.baseUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

/** Called when the session can no longer be refreshed — registered in main.ts. */
let onSessionExpired: () => void = () => {}
export const setOnSessionExpired = (handler: () => void) => {
  onSessionExpired = handler
}

http.interceptors.request.use((config) => {
  const access = tokenStorage.getAccess()
  if (access) config.headers.Authorization = `Bearer ${access}`
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})

/** Endpoints whose 401s mean "bad credentials", not "expired session". */
const isPublicAuthCall = (url = '') =>
  Object.values(apiConfig.endpoints.auth).some(
    (path) => url.includes(path) && !url.includes(apiConfig.endpoints.auth.me),
  )

let refreshPromise: Promise<string | null> | null = null

const refreshAccessToken = (): Promise<string | null> => {
  refreshPromise ??= (async () => {
    const refresh = tokenStorage.getRefresh()
    if (!refresh) {
      tokenStorage.clear()
      onSessionExpired()
      return null
    }
    try {
      const { data } = await axios.post(
        `${apiConfig.baseUrl}${apiConfig.endpoints.auth.tokenRefresh}`,
        { refresh },
        { timeout: 10000 },
      )
      tokenStorage.setSession(data.access, data.refresh)
      return data.access as string
    } catch {
      tokenStorage.clear()
      onSessionExpired()
      return null
    } finally {
      refreshPromise = null
    }
  })()
  return refreshPromise
}

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined
    const url = original?.url ?? ''

    if (error.response?.status === 401 && original && !original._retried && !isPublicAuthCall(url)) {
      original._retried = true
      const access = await refreshAccessToken()
      if (access) {
        original.headers.Authorization = `Bearer ${access}`
        return http(original)
      }
    }

    return Promise.reject(error)
  },
)
