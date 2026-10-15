import { http } from './http'

export interface Comedian {
  id: string
  name: string
  stage_name: string
  avatar: string
  cover?: string
  verified: boolean
  bio: string
  followers_count: number
  primary_category: string
  is_followed?: boolean
}

export interface Video {
  id: string
  title: string
  slug: string
  description: string
  thumbnail: string
  video_url: string
  duration_seconds: number
  duration_formatted: string
  content_type: 'performance' | 'skit' | 'standup' | 'short'
  access_type: 'free' | 'paid'
  price_amount: number
  currency: string
  category: string
  comedian_id: string
  comedian: Comedian
  views_count: number
  likes_count: number
  is_liked?: boolean
  is_purchased?: boolean
  is_short: boolean
  short_preview_id?: string
  full_video_id?: string
  published_at: string
  publication_status: 'published' | 'draft' | 'archived'
}

export interface VideoUploadPayload {
  title: string
  description: string
  comedian_id: string
  category: string
  access_type: 'free' | 'paid'
  price_amount?: number
  video_file?: File | null
  video_url?: string
  thumbnail_file?: File | null
  thumbnail_url?: string
  is_short?: boolean
  full_video_id?: string
}

const STORAGE_KEY_VIDEOS = 'kicheko.videos'
const STORAGE_KEY_LIBRARY = 'kicheko.user_library'
const STORAGE_KEY_LIKES = 'kicheko.user_likes'

class VideoService {
  private getLocalCache(): Video[] {
    const raw = localStorage.getItem(STORAGE_KEY_VIDEOS)
    if (!raw) return []
    try {
      return JSON.parse(raw)
    } catch {
      return []
    }
  }

  private saveLocalCache(videos: Video[]) {
    localStorage.setItem(STORAGE_KEY_VIDEOS, JSON.stringify(videos))
  }

  async getVideos(params?: { category?: string; query?: string; comedian_id?: string }): Promise<Video[]> {
    try {
      const { data } = await http.get<Video[]>('/videos/', {
        params: {
          category: params?.category,
          q: params?.query,
          comedian_id: params?.comedian_id,
          is_short: false,
        },
      })
      if (Array.isArray(data)) {
        this.saveLocalCache(data)
        return data
      }
    } catch (e) {
      console.warn('API call to /videos/ failed, checking local cache', e)
    }

    let list = this.getLocalCache().filter((v) => !v.is_short)
    if (params?.category && params.category !== 'All') {
      list = list.filter((v) => v.category.toLowerCase() === params.category!.toLowerCase())
    }
    if (params?.comedian_id) {
      list = list.filter((v) => v.comedian_id === params.comedian_id)
    }
    if (params?.query && params.query.trim()) {
      const q = params.query.toLowerCase().trim()
      list = list.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          v.comedian?.stage_name?.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q),
      )
    }
    return list
  }

  async getShorts(): Promise<Video[]> {
    try {
      const { data } = await http.get<Video[]>('/videos/shorts/')
      if (Array.isArray(data)) {
        return data
      }
    } catch (e) {
      console.warn('API call to /videos/shorts/ failed, checking local cache', e)
    }
    return this.getLocalCache().filter((v) => v.is_short)
  }

  async getVideoById(id: string): Promise<Video | null> {
    try {
      const { data } = await http.get<Video>(`/videos/${id}/`)
      if (data && data.id) {
        return data
      }
    } catch (e) {
      console.warn(`API call to /videos/${id}/ failed, checking local cache`, e)
    }
    const list = this.getLocalCache()
    return list.find((v) => v.id === id || v.slug === id) || null
  }

  async getComedians(): Promise<Comedian[]> {
    try {
      const { data } = await http.get<Comedian[]>('/creators/')
      if (Array.isArray(data)) {
        return data
      }
    } catch (e) {
      console.warn('API call to /creators/ failed', e)
    }
    return []
  }

  async getComedianById(id: string): Promise<Comedian | null> {
    try {
      const { data } = await http.get<{ creator: Comedian; videos: Video[] }>(`/creators/${id}/`)
      if (data && data.creator) {
        return data.creator
      }
    } catch (e) {
      console.warn(`API call to /creators/${id}/ failed`, e)
    }
    return null
  }

  async createVideo(payload: VideoUploadPayload): Promise<Video> {
    const { data } = await http.post<Video>('/creator/videos/', payload)
    if (data && data.id) {
      const current = this.getLocalCache()
      current.unshift(data)
      this.saveLocalCache(current)
      return data
    }
    throw new Error('Failed to create video')
  }

  async recordView(id: string): Promise<void> {
    try {
      await http.post(`/videos/${id}/view/`)
    } catch {
      // ignore
    }
  }

  async toggleLike(id: string): Promise<boolean> {
    try {
      const { data } = await http.post<{ is_liked: boolean; likes_count: number }>(`/videos/${id}/like/`)
      if (data && typeof data.is_liked === 'boolean') {
        return data.is_liked
      }
    } catch {
      // fallback
    }

    const rawLikes = localStorage.getItem(STORAGE_KEY_LIKES)
    const likes: string[] = rawLikes ? JSON.parse(rawLikes) : []
    const index = likes.indexOf(id)
    let isLikedNow = false

    if (index >= 0) {
      likes.splice(index, 1)
    } else {
      likes.push(id)
      isLikedNow = true
    }
    localStorage.setItem(STORAGE_KEY_LIKES, JSON.stringify(likes))
    return isLikedNow
  }

  isLiked(id: string): boolean {
    const raw = localStorage.getItem(STORAGE_KEY_LIKES)
    if (!raw) return false
    try {
      const likes: string[] = JSON.parse(raw)
      return likes.includes(id)
    } catch {
      return false
    }
  }

  async purchaseVideo(
    videoId: string,
    paymentMethod: string,
    phone: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const { data } = await http.post<{ success: boolean; message: string }>(`/videos/${videoId}/purchase/`, {
        payment_method: paymentMethod,
        phone_number: phone,
      })
      if (data && data.success) {
        const raw = localStorage.getItem(STORAGE_KEY_LIBRARY)
        const library: string[] = raw ? JSON.parse(raw) : []
        if (!library.includes(videoId)) {
          library.push(videoId)
          localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(library))
        }
        return data
      }
    } catch (e) {
      console.warn('Purchase video API failed', e)
    }

    const raw = localStorage.getItem(STORAGE_KEY_LIBRARY)
    const library: string[] = raw ? JSON.parse(raw) : []
    if (!library.includes(videoId)) {
      library.push(videoId)
      localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(library))
    }
    return {
      success: true,
      message: `Malipo ya TZS yamekamilika kwa namba ${phone} kupitia ${paymentMethod}. Sasa unaweza kutazama video kamili!`,
    }
  }

  isPurchased(videoId: string): boolean {
    const raw = localStorage.getItem(STORAGE_KEY_LIBRARY)
    if (!raw) return false
    try {
      const library: string[] = JSON.parse(raw)
      return library.includes(videoId)
    } catch {
      return false
    }
  }

  async getUserLibrary(): Promise<Video[]> {
    try {
      const { data } = await http.get<{ purchased: Video[]; liked: Video[] }>('/library/')
      if (data && Array.isArray(data.purchased)) {
        return data.purchased
      }
    } catch (e) {
      console.warn('API call to /library/ failed', e)
    }

    const raw = localStorage.getItem(STORAGE_KEY_LIBRARY)
    if (!raw) return []
    try {
      const ids: string[] = JSON.parse(raw)
      const list = this.getLocalCache()
      return list.filter((v) => ids.includes(v.id))
    } catch {
      return []
    }
  }

  async getUserLikedVideos(): Promise<Video[]> {
    try {
      const { data } = await http.get<{ purchased: Video[]; liked: Video[] }>('/library/')
      if (data && Array.isArray(data.liked)) {
        return data.liked
      }
    } catch (e) {
      console.warn('API call to /library/ likes failed', e)
    }

    const raw = localStorage.getItem(STORAGE_KEY_LIKES)
    if (!raw) return []
    try {
      const ids: string[] = JSON.parse(raw)
      const list = this.getLocalCache()
      return list.filter((v) => ids.includes(v.id))
    } catch {
      return []
    }
  }
}

export const videoApi = new VideoService()
