import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth-store'

/** Shared auth state/actions for components — keep HTTP and routing out of .vue files. */
export const useAuth = () => {
  const store = useAuthStore()
  const router = useRouter()
  const route = useRoute()
  const { user, isAuthenticated } = storeToRefs(store)

  /** Where to land after login/register (honours ?redirect=). */
  const postAuthTarget = computed(() => {
    const redirect = route.query.redirect
    return typeof redirect === 'string' && redirect.startsWith('/') ? redirect : { name: 'home' }
  })

  const logout = async () => {
    store.logout()
    await router.push({ name: 'login' })
  }

  return { user, isAuthenticated, postAuthTarget, logout }
}
