import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useForm, useToast } from 'vuestic-ui'
import { useAuthStore } from '../../../stores/auth-store'
import { useAuth } from '../../../composables/useAuth'
import { isApiError } from '../../../services/api'

export const useSignup = () => {
  const form = reactive({
    display_name: '',
    email: '',
    password: '',
    password_confirm: '',
    accept_terms: false,
  })
  const fieldErrors = ref<Record<string, string[]>>({})
  const errorMessage = ref('')
  const isSubmitting = ref(false)

  const { validate } = useForm('signupForm')
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
      await store.register({ ...form })
      toast({ message: t('auth.signupPage.welcomeToast'), color: 'success' })
      push(postAuthTarget.value)
    } catch (e) {
      fieldErrors.value = isApiError(e) ? e.fieldErrors : {}
      const msg = isApiError(e) ? e.detail : t('auth.signupPage.failed')
      errorMessage.value = msg
      toast({ message: msg, color: 'danger' })
    } finally {
      isSubmitting.value = false
    }
  }

  const passwordRules: ((v: string) => boolean | string)[] = [
    (v) => !!v || t('auth.signupPage.passwordRequired'),
    (v) => (v && v.length >= 8) || t('auth.signupPage.passwordMinLength'),
    (v) => (v && /[A-Za-z]/.test(v)) || t('auth.signupPage.passwordLetter'),
    (v) => (v && /\d/.test(v)) || t('auth.signupPage.passwordNumber'),
    (v) => (v && /[!@#$%^&*(),.?":{}|<>]/.test(v)) || t('auth.signupPage.passwordSpecial'),
  ]

  return { form, fieldErrors, errorMessage, isSubmitting, submit, passwordRules }
}
