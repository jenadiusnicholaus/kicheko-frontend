import './scss/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n'
import { createVuestic } from 'vuestic-ui'
import { createGtm } from '@gtm-support/vue-gtm'

import stores from './stores'
import router from './router'
import vuesticGlobalConfig from './services/vuestic-ui/global-config'
import { setOnSessionExpired } from './services/api'
import { useAuthStore } from './stores/auth-store'

// --- Apply saved theme before mount (avoids flash) ---
;(() => {
  const isDark = localStorage.getItem('kicheko-theme') === 'dark'
  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})()

const app = createApp(App)

app.use(stores)
app.use(router)
app.use(i18n)
app.use(createVuestic({ config: vuesticGlobalConfig }))

// When the refresh token is dead too, the http layer drops the session —
// clear the store and send the user back to login.
setOnSessionExpired(() => {
  try {
    const auth = useAuthStore()
    auth.logout()
  } catch {
    // ignore
  }
  router.push({ name: 'login' })
})

if (import.meta.env.VITE_APP_GTM_ENABLED) {
  app.use(
    createGtm({
      id: import.meta.env.VITE_APP_GTM_KEY,
      debug: false,
      vueRouter: router,
    }),
  )
}

app.mount('#app')
