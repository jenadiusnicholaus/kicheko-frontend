/**
 * API configuration. Every base/sub URL lives in `.env` — never hardcode
 * endpoints in components, stores or composables.
 *
 * baseUrl is always VITE_API_PROXY_TARGET + VITE_API_BASE_URL, e.g.
 *   dev:  http://127.0.0.1:8023/api/v1
 *   prod: https://api.taifahouse.tz/api/v1
 */
const env = import.meta.env

export const apiConfig = {
  baseUrl: `${env.VITE_API_PROXY_TARGET}${env.VITE_API_BASE_URL}`,
  endpoints: {
    auth: {
      register: env.VITE_API_AUTH_REGISTER,
      google: env.VITE_API_AUTH_GOOGLE,
      token: env.VITE_API_AUTH_TOKEN,
      tokenRefresh: env.VITE_API_AUTH_TOKEN_REFRESH,
      tokenVerify: env.VITE_API_AUTH_TOKEN_VERIFY,
      passwordReset: env.VITE_API_AUTH_PASSWORD_RESET,
      passwordResetVerify: env.VITE_API_AUTH_PASSWORD_RESET_VERIFY,
      passwordResetConfirm: env.VITE_API_AUTH_PASSWORD_RESET_CONFIRM,
      me: env.VITE_API_AUTH_ME,
    },
  },
} as const

export type ApiEndpoints = typeof apiConfig.endpoints

/**
 * Resolve backend media paths ("/media/...") to absolute URLs on the API host.
 * Frontend asset paths ("/taifa/...", "/image/...") and absolute URLs pass through.
 * Seeded "/media/taifa/..." rows point at assets already shipped in the
 * frontend's public dir — remap them back so they render without a
 * backend media-volume copy.
 */
export function resolveMediaUrl(path?: string | null): string {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) {
    // Seeded /media/taifa/ and /taifa/ rows (now absolute from the API) point
    // at assets shipped in the frontend's public dir — remap back to /taifa/.
    const m = path.match(/^https?:\/\/[^/]+(\/(?:media\/)?taifa\/.*)$/i)
    return m ? m[1].replace(/^\/media/, '') : path
  }
  if (path.startsWith('/media/taifa/')) return path.slice('/media'.length)
  if (path.startsWith('/media/')) return `${env.VITE_API_PROXY_TARGET}${path}`
  return path
}
