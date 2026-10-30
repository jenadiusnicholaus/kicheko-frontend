import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useForm, useToast } from 'vuestic-ui'
import { authApi, isApiError } from '../../../services/api'

export type ResetStep = 'email' | 'otp' | 'password' | 'done'

/** 3-step OTP password reset: email → code → new password. */
export const usePasswordReset = () => {
  const step = ref<ResetStep>('email')
  const form = reactive({ email: '', otp: '', new_password: '', new_password_confirm: '' })
  const resetToken = ref('')
  const fieldErrors = ref<Record<string, string[]>>({})
  const isSubmitting = ref(false)

  const { validate } = useForm('resetForm')
  const { init: toast } = useToast()
  const { t } = useI18n()

  const run = async (action: () => Promise<unknown>, next: ResetStep) => {
    if (!validate() || isSubmitting.value) return
    fieldErrors.value = {}
    isSubmitting.value = true
    try {
      await action()
      step.value = next
    } catch (e) {
      fieldErrors.value = isApiError(e) ? e.fieldErrors : {}
      toast({ message: isApiError(e) ? e.detail : t('auth.passwordReset.genericError'), color: 'danger' })
    } finally {
      isSubmitting.value = false
    }
  }

  const sendCode = () => run(() => authApi.requestPasswordReset(form.email), 'otp')

  const verifyCode = () =>
    run(async () => {
      const { reset_token } = await authApi.verifyPasswordResetOtp(form.email, form.otp)
      resetToken.value = reset_token
    }, 'password')

  const submitNewPassword = () =>
    run(
      () =>
        authApi.confirmPasswordReset({
          email: form.email,
          reset_token: resetToken.value,
          new_password: form.new_password,
          new_password_confirm: form.new_password_confirm,
        }),
      'done',
    )

  return { step, form, fieldErrors, isSubmitting, sendCode, verifyCode, submitNewPassword }
}
