import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vuestic-ui'

import { useAuthStore } from '../stores/auth-store'
import { useAuth } from './useAuth'
import { isApiError } from '../services/api'

declare global {
  interface Window {
    google?: any
  }
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

let gisPromise: Promise<void> | null = null

const loadGis = () => {
  if (window.google?.accounts?.id) return Promise.resolve()
  gisPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Google script failed to load'))
    document.head.appendChild(script)
  })
  return gisPromise
}

/** Google Identity Services sign-in. Renders the official Google button and
 * exchanges the returned credential for an app session via /auth/google/. */
export const useGoogleAuth = () => {
  const googleEnabled = computed(() => Boolean(CLIENT_ID))
  const isGoogleLoading = ref(false)
  const store = useAuthStore()
  const { postAuthTarget } = useAuth()
  const { push } = useRouter()
  const { init: toast } = useToast()
  const { t } = useI18n()

  const onCredential = async (credential?: string) => {
    if (!credential || isGoogleLoading.value) return
    isGoogleLoading.value = true
    try {
      await store.googleLogin(credential)
      toast({ message: t('auth.google.welcomeToast'), color: 'success' })
      push(postAuthTarget.value)
    } catch (e) {
      const msg = isApiError(e) ? e.detail : t('auth.google.failed')
      toast({ message: msg, color: 'danger' })
    } finally {
      isGoogleLoading.value = false
    }
  }

  const renderGoogleButton = async (el: HTMLElement | null) => {
    if (!googleEnabled.value || !el) return
    try {
      await loadGis()
    } catch {
      toast({ message: t('auth.google.failed'), color: 'danger' })
      return
    }
    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: ({ credential }: { credential?: string }) => onCredential(credential),
    })
    const dark = document.documentElement.classList.contains('dark')
    window.google.accounts.id.renderButton(el, {
      theme: dark ? 'filled_black' : 'outline',
      size: 'large',
      width: Math.min(el.clientWidth || 320, 360),
      text: 'continue_with',
      shape: 'pill',
    })
  }

  return { googleEnabled, isGoogleLoading, renderGoogleButton }
}
