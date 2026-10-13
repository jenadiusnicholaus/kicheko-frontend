import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
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

  const submit = async () => {
    if (!validate() || isSubmitting.value) return
    fieldErrors.value = {}
    errorMessage.value = ''
    isSubmitting.value = true
    try {
      await store.register({ ...form })
      toast({ message: 'Karibu Kicheko! Your account is ready.', color: 'success' })
      push(postAuthTarget.value)
    } catch (e) {
      fieldErrors.value = isApiError(e) ? e.fieldErrors : {}
      const msg = isApiError(e) ? e.detail : 'Sign up failed. Please check your information.'
      errorMessage.value = msg
      toast({ message: msg, color: 'danger' })
    } finally {
      isSubmitting.value = false
    }
  }

  const passwordRules: ((v: string) => boolean | string)[] = [
    (v) => !!v || 'Password field is required',
    (v) => (v && v.length >= 8) || 'Password must be at least 8 characters long',
    (v) => (v && /[A-Za-z]/.test(v)) || 'Password must contain at least one letter',
    (v) => (v && /\d/.test(v)) || 'Password must contain at least one number',
    (v) => (v && /[!@#$%^&*(),.?":{}|<>]/.test(v)) || 'Password must contain at least one special character',
  ]

  return { form, fieldErrors, errorMessage, isSubmitting, submit, passwordRules }
}
