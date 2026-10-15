/**
 * API configuration. Every base/sub URL lives in `.env` — never hardcode
 * endpoints in components, stores or composables.
 */
const env = import.meta.env

export const apiConfig = {
  // Dev: relative path — same-origin, forwarded by the Vite proxy.
  // Prod: absolute URL to the API host, e.g. https://api.taifahouse.tz/api/v1
  baseUrl: env.PROD ? `${env.VITE_API_PROXY_TARGET}${env.VITE_API_BASE_URL}` : env.VITE_API_BASE_URL,
  endpoints: {
    auth: {
      register: env.VITE_API_AUTH_REGISTER,
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
