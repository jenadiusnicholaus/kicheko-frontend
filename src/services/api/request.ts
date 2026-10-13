import { AxiosError, AxiosRequestConfig } from 'axios'
import { http } from './http'
import { ApiError } from './errors'

/**
 * Unified API call — returns the response body directly and always throws
 * a normalized `ApiError`. Use this for every backend call.
 */
export const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const { data } = await http.request<T>(config)
    return data
  } catch (e) {
    throw e instanceof AxiosError ? new ApiError(e) : e
  }
}

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => request<T>({ ...config, method: 'GET', url }),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'POST', url, data }),
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'PUT', url, data }),
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'PATCH', url, data }),
  delete: <T>(url: string, config?: AxiosRequestConfig) => request<T>({ ...config, method: 'DELETE', url }),
}
