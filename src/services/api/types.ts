/** Shapes returned by the Kicheko API (see docs/frontend_api.md). */

export interface UserProfile {
  avatar: string | null
  cover: string | null
  bio: string
  location: string
  website: string
  preferred_language: string
  country_code: string
  notification_preferences: Record<string, unknown>
}

/** Flat user shape used across the app (register/login nest it under `profile`, /me is already flat). */
export interface CurrentUser extends UserProfile {
  id: string
  username: string
  display_name: string
  email: string | null
  phone_number: string | null
  status: string
  is_staff: boolean
}

interface AuthUserResponse extends Omit<CurrentUser, keyof UserProfile> {
  profile: UserProfile
}

export interface AuthSession {
  access: string
  refresh: string
  user: AuthUserResponse
}

export interface RegisterPayload {
  display_name: string
  email?: string
  phone_number?: string
  password: string
  password_confirm: string
  accept_terms: boolean
}

export interface LoginPayload {
  /** Email or phone number the account registered with. */
  username: string
  password: string
}

export interface PasswordResetConfirmPayload {
  email: string
  reset_token: string
  new_password: string
  new_password_confirm: string
}

export type UpdateProfilePayload = Partial<
  Pick<
    CurrentUser,
    | 'display_name'
    | 'avatar'
    | 'cover'
    | 'bio'
    | 'location'
    | 'website'
    | 'preferred_language'
    | 'country_code'
    | 'notification_preferences'
  >
>

/** Normalizes the nested `user.profile` auth shape and the flat `/me` shape into `CurrentUser`. */
export const normalizeUser = (raw: AuthUserResponse | CurrentUser): CurrentUser => {
  const { profile, ...rest } = raw as AuthUserResponse
  return { ...rest, is_staff: rest.is_staff ?? false, ...(profile ?? (raw as UserProfile)) }
}
