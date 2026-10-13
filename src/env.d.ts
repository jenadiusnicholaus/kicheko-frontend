/// <reference types="vite/client" />
/// <reference types=".vuestic" />

interface ImportMetaEnv {
  readonly VITE_APP_GTM_KEY: string
  readonly VITE_APP_INCLUDE_DEMOS: string
  readonly VITE_APP_ROUTER_MODE_HISTORY: string
  readonly VITE_APP_BUILD_VERSION: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_PROXY_PREFIX: string
  readonly VITE_API_PROXY_TARGET: string
  readonly VITE_API_AUTH_REGISTER: string
  readonly VITE_API_AUTH_TOKEN: string
  readonly VITE_API_AUTH_TOKEN_REFRESH: string
  readonly VITE_API_AUTH_TOKEN_VERIFY: string
  readonly VITE_API_AUTH_PASSWORD_RESET: string
  readonly VITE_API_AUTH_PASSWORD_RESET_VERIFY: string
  readonly VITE_API_AUTH_PASSWORD_RESET_CONFIRM: string
  readonly VITE_API_AUTH_ME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
