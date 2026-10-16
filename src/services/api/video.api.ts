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

class VideoService {
  async getVideos(params?: { category?: string; query?: string; comedian_id?: string }): Promise<Video[]> {
    const { data } = await http.get<Video[]>('/videos/', {
      params: {
        category: params?.category,
        q: params?.query,
        comedian_id: params?.comedian_id,
        is_short: false,
      },
    })
    return Array.isArray(data) ? data : []
  }

  async getShorts(): Promise<Video[]> {
    const { data } = await http.get<Video[]>('/videos/shorts/')
    return Array.isArray(data) ? data : []
  }

  async getVideoById(id: string): Promise<Video | null> {
    const { data } = await http.get<Video>(`/videos/${id}/`)
    return data && data.id ? data : null
  }

  async getComedians(): Promise<Comedian[]> {
    const { data } = await http.get<Comedian[]>('/creators/')
    return Array.isArray(data) ? data : []
  }

  async getComedianById(id: string): Promise<Comedian | null> {
    const { data } = await http.get<{ creator: Comedian; videos: Video[] }>(`/creators/${id}/`)
    return data && data.creator ? data.creator : null
  }

  async createVideo(payload: VideoUploadPayload): Promise<Video> {
    const { data } = await http.post<Video>('/creator/videos/', payload)
    if (data && data.id) return data
    throw new Error('Failed to create video')
  }

  async recordView(id: string): Promise<void> {
    await http.post(`/videos/${id}/view/`)
  }

  async toggleLike(id: string): Promise<boolean> {
    const { data } = await http.post<{ is_liked: boolean; likes_count: number }>(`/videos/${id}/like/`)
    return data?.is_liked ?? false
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isLiked(id: string): boolean {
    void id
    return false
  }

  async purchaseVideo(
    videoId: string,
    paymentMethod: string,
    phone: string,
  ): Promise<{ success: boolean; message: string }> {
    const { data } = await http.post<{ success: boolean; message: string }>(`/videos/${videoId}/purchase/`, {
      payment_method: paymentMethod,
      phone_number: phone,
    })
    return data
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isPurchased(videoId: string): boolean {
    void videoId
    return false
  }

  async getUserLibrary(): Promise<Video[]> {
    const { data } = await http.get<{ purchased: Video[]; liked: Video[] }>('/library/')
    return Array.isArray(data?.purchased) ? data.purchased : []
  }

  async getUserLikedVideos(): Promise<Video[]> {
    const { data } = await http.get<{ purchased: Video[]; liked: Video[] }>('/library/')
    return Array.isArray(data?.liked) ? data.liked : []
  }
}

export const videoApi = new VideoService()
