import { AxiosError } from 'axios'

/**
 * Normalized API error. DRF returns either `{"detail": "..."}` or
 * field-keyed errors like `{"email": ["This field is required."]}`.
 */
export class ApiError extends Error {
  status?: number
  detail: string
  fieldErrors: Record<string, string[]>

  constructor(error: AxiosError) {
    const data = (error.response?.data ?? {}) as Record<string, unknown>
    const fieldErrors: Record<string, string[]> = {}
    let detail = ''

    for (const [key, value] of Object.entries(data)) {
      const messages = Array.isArray(value) ? value.map(String) : [String(value)]
      if (key === 'detail' || key === 'non_field_errors') {
        detail = messages.join(' ')
      } else {
        fieldErrors[key] = messages
      }
    }

    super(detail || error.message)
    this.status = error.response?.status
    this.detail = detail || 'Something went wrong. Please try again.'
    this.fieldErrors = fieldErrors
  }

  /** First error message for a field, handy for VaInput error-messages. */
  field(name: string): string[] {
    return this.fieldErrors[name] ?? []
  }
}

export const isApiError = (e: unknown): e is ApiError => e instanceof ApiError
