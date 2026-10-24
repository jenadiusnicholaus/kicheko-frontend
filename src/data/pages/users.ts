import { User, UUID } from '../../pages/users/types'
import { http } from '../../services/api'
import { resolveMediaUrl } from '../../services/api/config'

export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof User | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type Filters = {
  isActive: boolean
  search: string
}

/**
 * The backend has no users-list endpoint — the admin Users page is sourced
 * from the applications endpoint (one row per applicant account). Point
 * VITE_API_ADMIN_USERS at a real users endpoint when the backend adds one.
 */
const USERS_ENDPOINT = import.meta.env.VITE_API_ADMIN_USERS || '/applications/'

type ApplicationRow = {
  id: string
  user_id?: string
  first_name?: string
  last_name?: string
  display_name?: string
  username?: string
  email?: string
  status?: string
  university?: string
  university_badge?: string
}

const appToUser = (app: ApplicationRow): User => ({
  id: (app.user_id || app.id) as UUID,
  fullname:
    app.display_name?.trim() || [app.first_name, app.last_name].filter(Boolean).join(' ').trim() || app.username || '',
  email: app.email || '',
  username: app.username || '',
  role: 'user',
  avatar: resolveMediaUrl(app.university_badge),
  projects: [],
  notes: app.university || '',
  active: app.status === 'approved',
})

export const getUsers = async (filters: Partial<Filters & Pagination & Sorting>) => {
  const { isActive, search } = filters
  const res = await http.get(USERS_ENDPOINT)
  const raw: ApplicationRow[] = Array.isArray(res.data) ? res.data : res.data?.results || res.data?.data || []

  // One row per user — an applicant may appear more than once.
  const seen = new Set<string>()
  const users: User[] = []
  for (const app of raw) {
    const key = app.user_id || app.username || app.email || app.id
    if (seen.has(key)) continue
    seen.add(key)
    users.push(appToUser(app))
  }

  const filtered = users.filter(
    (user) =>
      (isActive === undefined || user.active === isActive) &&
      (!search ||
        [user.fullname, user.email, user.username].some((f) => f.toLowerCase().includes(search.toLowerCase()))),
  )

  const { page = 1, perPage = 10 } = filters || {}
  return {
    data: filtered,
    pagination: {
      page,
      perPage,
      total: filtered.length,
    },
  }
}

/** User CRUD needs a backend users endpoint — applications are read-only here. */
const crudUnsupported = (): never => {
  throw new Error('User management requires a users endpoint on the backend')
}

export const addUser = async (user: User): Promise<User[]> => {
  void user
  return crudUnsupported()
}

export const updateUser = async (user: User): Promise<User[]> => {
  void user
  return crudUnsupported()
}

export const removeUser = async (user: User): Promise<never> => {
  void user
  return crudUnsupported()
}

export const uploadAvatar = async (body: FormData): Promise<never> => {
  void body
  return crudUnsupported()
}
