import { apiConfig } from './config'

export { apiConfig } from './config'
export { http, setOnSessionExpired } from './http'
export { api, request } from './request'
export { tokenStorage } from './token-storage'
export { ApiError, isApiError } from './errors'
export { authApi } from './auth.api'
export * from './video.api'
export * from './types'

/**
 * @deprecated URL builder kept only so the template demo pages
 * (src/data/pages/*) keep compiling until they are replaced by real endpoints.
 */
export const urls = {
  allUsers: () => `${apiConfig.baseUrl}/users`,
  user: (id: string) => `${apiConfig.baseUrl}/users/${id}`,
  users: ({ page, pageSize }: { page: number; pageSize: number }) =>
    `${apiConfig.baseUrl}/users/?page=${page}&pageSize=${pageSize}`,
  allProjects: () => `${apiConfig.baseUrl}/projects`,
  project: (id: string) => `${apiConfig.baseUrl}/projects/${id}`,
  projects: ({ page, pageSize }: { page: number; pageSize: number }) =>
    `${apiConfig.baseUrl}/projects/?page=${page}&pageSize=${pageSize}`,
  avatars: () => `${apiConfig.baseUrl}/avatars`,
}
