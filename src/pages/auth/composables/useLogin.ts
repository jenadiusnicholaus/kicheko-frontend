import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useForm, useToast } from 'vuestic-ui'
import { useAuthStore } from '../../../stores/auth-store'
import { useAuth } from '../../../composables/useAuth'
import { isApiError } from '../../../services/api'

export const useLogin = () => {
  const form = reactive({ username: '', password: '', keepLoggedIn: false })
  const fieldErrors = ref<Record<string, string[]>>({})
  const errorMessage = ref('')
  const isSubmitting = ref(false)

  // NOTE: `ref="loginForm"` must NOT match the `form` reactive — a same-named
  // template ref would overwrite the setup binding with the component instance.
  const { validate } = useForm('loginForm')
  const { init: toast } = useToast()
  const { push } = useRouter()
  const store = useAuthStore()
  const { postAuthTarget } = useAuth()
  const { t } = useI18n()

  const submit = async () => {
    if (!validate() || isSubmitting.value) return
    fieldErrors.value = {}
    errorMessage.value = ''
    isSubmitting.value = true
    try {
      await store.login({ username: form.username, password: form.password })
      toast({ message: t('auth.loginPage.welcomeToast'), color: 'success' })
      push(postAuthTarget.value)
    } catch (e) {
      fieldErrors.value = isApiError(e) ? e.fieldErrors : {}
      const msg = isApiError(e) ? e.detail : t('auth.loginPage.failed')
      errorMessage.value = msg
      toast({ message: msg, color: 'danger' })
    } finally {
      isSubmitting.value = false
    }
  }

  return { form, fieldErrors, errorMessage, isSubmitting, submit }
}
