import { api } from './request'
import { apiConfig } from './config'
import type {
  AuthSession,
  CurrentUser,
  LoginPayload,
  PasswordResetConfirmPayload,
  RegisterPayload,
  UpdateProfilePayload,
} from './types'

const { auth } = apiConfig.endpoints

export const authApi = {
  register: (payload: RegisterPayload) => api.post<AuthSession>(auth.register, payload),

  login: (payload: LoginPayload) => api.post<AuthSession>(auth.token, payload),

  requestPasswordReset: (email: string) => api.post<{ detail: string }>(auth.passwordReset, { email }),

  verifyPasswordResetOtp: (email: string, otp: string) =>
    api.post<{ reset_token: string }>(auth.passwordResetVerify, { email, otp }),

  confirmPasswordReset: (payload: PasswordResetConfirmPayload) =>
    api.post<{ detail: string }>(auth.passwordResetConfirm, payload),

  me: () => api.get<CurrentUser>(auth.me),

  /** JSON for text fields; pass FormData when uploading avatar/cover. */
  updateMe: (payload: UpdateProfilePayload | FormData) =>
    api.patch<CurrentUser>(
      auth.me,
      payload,
      payload instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined,
    ),
}
