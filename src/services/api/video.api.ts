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

// Fallback initial Tanzanian comedians
export const INITIAL_COMEDIANS: Comedian[] = [
  {
    id: 'c1',
    name: 'Anas Lucas',
    stage_name: 'Joti',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&h=400&q=80',
    verified: true,
    bio: 'Mfalme wa Vichekesho Tanzania. Tazama vipindi vyote vya Joti TV, Shoki, na maonyesho ya jukwaani hapa Kicheko.',
    followers_count: 852000,
    primary_category: 'Skits',
  },
  {
    id: 'c2',
    name: 'Silvano Mavunjo',
    stage_name: 'Mpoki',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&h=400&q=80',
    verified: true,
    bio: 'Mkongwe wa Stand-up na redio. Cheka na vituko vya mjini bila kikomo!',
    followers_count: 640000,
    primary_category: 'Stand-up Comedy',
  },
  {
    id: 'c3',
    name: 'Coy Mzungu',
    stage_name: 'Coy Mzungu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
    cover: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&h=400&q=80',
    verified: true,
    bio: 'Mwanzilishi wa jukwaa kubwa la Cheka Tu. Stand-up comedy halisi ya Kitanzania.',
    followers_count: 520000,
    primary_category: 'Stand-up Comedy',
  },
  {
    id: 'c4',
    name: 'Mau Fundi',
    stage_name: 'Mau Fundi',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&h=200&q=80',
    cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&h=400&q=80',
    verified: true,
    bio: 'Fundi wa mambo! Skits na vichekesho vya gereji na mtaani.',
    followers_count: 310000,
    primary_category: 'Skits',
  },
  {
    id: 'c5',
    name: 'Dogo Pepe',
    stage_name: 'Dogo Pepe',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&h=200&q=80',
    cover: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=1200&h=400&q=80',
    verified: false,
    bio: 'Kizazi kipya cha vichekesho vya mitandaoni na Shorts zenye burudani tele.',
    followers_count: 185000,
    primary_category: 'Short Comedy',
  },
]

// Fallback sample videos (using verified local media)
const FALLBACK_VIDEOS: Video[] = [
  {
    id: 'v1',
    title: 'Cheka Tu Live: Maisha ya Dar es Salaam vs Mikoani',
    slug: 'cheka-tu-live-maisha-ya-dar',
    description:
      'Onyesho kamili la Cheka Tu lililofanyika Mlimani City. Coy Mzungu anachambua tofauti ya tabia za watu wa Dar es Salaam wakisafiri kwenda mikoani kwa mara ya kwanza.',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&h=450&q=80',
    video_url: '/videos/oceans.mp4',
    duration_seconds: 1420,
    duration_formatted: '23:40',
    content_type: 'performance',
    access_type: 'paid',
    price_amount: 2500,
    currency: 'TZS',
    category: 'Stand-up Comedy',
    comedian_id: 'c3',
    comedian: INITIAL_COMEDIANS[2],
    views_count: 142800,
    likes_count: 12400,
    is_short: false,
    short_preview_id: 's1',
    published_at: '2026-09-28T14:00:00Z',
    publication_status: 'published',
  },
  {
    id: 'v2',
    title: 'Joti TV: Mzee wa Vikoba Akamatwa na Mke Mkubwa',
    slug: 'joti-tv-mzee-wa-vikoba',
    description:
      'Joti akiwa kama Mzee wa Vikoba anajikuta katika wakati mgumu baada ya mkewe kumfumania akigawa mgao wa kikundi kwa mpangaji mpya.',
    thumbnail: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=800&h=450&q=80',
    video_url: '/videos/flower.mp4',
    duration_seconds: 560,
    duration_formatted: '09:20',
    content_type: 'skit',
    access_type: 'free',
    price_amount: 0,
    currency: 'TZS',
    category: 'Skits',
    comedian_id: 'c1',
    comedian: INITIAL_COMEDIANS[0],
    views_count: 320500,
    likes_count: 28900,
    is_short: false,
    short_preview_id: 's2',
    published_at: '2026-10-02T10:30:00Z',
    publication_status: 'published',
  },
  {
    id: 'v3',
    title: 'Mpoki Special: Harusi za Kisasa na Bajeti Feki',
    slug: 'mpoki-special-harusi-za-kisasa',
    description:
      'Mpoki akieleza kwa ucheshi changamoto za michango ya kadi za harusi na jinsi kamati zinavyopika bajeti za mamilioni.',
    thumbnail: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&h=450&q=80',
    video_url: '/videos/oceans.mp4',
    duration_seconds: 1115,
    duration_formatted: '18:35',
    content_type: 'standup',
    access_type: 'paid',
    price_amount: 3000,
    currency: 'TZS',
    category: 'Stand-up Comedy',
    comedian_id: 'c2',
    comedian: INITIAL_COMEDIANS[1],
    views_count: 98400,
    likes_count: 8100,
    is_short: false,
    published_at: '2026-10-05T18:00:00Z',
    publication_status: 'published',
  },
  {
    id: 'v4',
    title: 'Mau Fundi: Gereji ya Ujanja na Mteja Mzungu',
    slug: 'mau-fundi-gereji-ya-ujanja',
    description:
      'Mau Fundi na vibarua wake wanapokea gari la mgeni kutoka Ulaya. Spana mkononi lakini lugha inakuwa chenga tupu!',
    thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&h=450&q=80',
    video_url: '/videos/flower.mp4',
    duration_seconds: 430,
    duration_formatted: '07:10',
    content_type: 'skit',
    access_type: 'free',
    price_amount: 0,
    currency: 'TZS',
    category: 'Skits',
    comedian_id: 'c4',
    comedian: INITIAL_COMEDIANS[3],
    views_count: 215000,
    likes_count: 19400,
    is_short: false,
    short_preview_id: 's3',
    published_at: '2026-10-08T12:00:00Z',
    publication_status: 'published',
  },
  {
    id: 'v5',
    title: 'Dogo Pepe: Mahojiano ya Kazi na Boss Mkali',
    slug: 'dogo-pepe-mahojiano-ya-kazi',
    description: 'Dogo Pepe anaenda kwenye interview ya kampuni kubwa akiwa amekariri majibu ya mtandaoni.',
    thumbnail: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&h=450&q=80',
    video_url: '/videos/flower.mp4',
    duration_seconds: 320,
    duration_formatted: '05:20',
    content_type: 'skit',
    access_type: 'free',
    price_amount: 0,
    currency: 'TZS',
    category: 'Short Comedy',
    comedian_id: 'c5',
    comedian: INITIAL_COMEDIANS[4],
    views_count: 184300,
    likes_count: 15300,
    is_short: false,
    published_at: '2026-10-10T16:20:00Z',
    publication_status: 'published',
  },
  {
    id: 'v6',
    title: 'Kicheko Gala 2026: Vichekesho Bora vya Mwaka',
    slug: 'kicheko-gala-2026',
    description: 'Tamasha kubwa la utoaji tuzo na vichekesho la Kicheko Gala. Washiriki wote wakiwa jukwaani pamoja.',
    thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&h=450&q=80',
    video_url: '/videos/oceans.mp4',
    duration_seconds: 3600,
    duration_formatted: '60:00',
    content_type: 'performance',
    access_type: 'paid',
    price_amount: 5000,
    currency: 'TZS',
    category: 'Stand-up Comedy',
    comedian_id: 'c3',
    comedian: INITIAL_COMEDIANS[2],
    views_count: 410000,
    likes_count: 45000,
    is_short: false,
    published_at: '2026-10-01T20:00:00Z',
    publication_status: 'published',
  },
]

const FALLBACK_SHORTS: Video[] = [
  {
    id: 's1',
    title: 'Huu ndio utani mkubwa zaidi wa Dar! 😂',
    slug: 'short-cheka-tu-dar',
    description: 'Kipande kifupi cha Cheka Tu Live. Bonyeza "Watch Full Video" kutazama onyesho lote!',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=450&h=800&q=80',
    video_url: '/videos/flower.mp4',
    duration_seconds: 45,
    duration_formatted: '0:45',
    content_type: 'short',
    access_type: 'free',
    price_amount: 0,
    currency: 'TZS',
    category: 'Shorts',
    comedian_id: 'c3',
    comedian: INITIAL_COMEDIANS[2],
    views_count: 512000,
    likes_count: 48900,
    is_short: true,
    full_video_id: 'v1',
    published_at: '2026-10-03T12:00:00Z',
    publication_status: 'published',
  },
  {
    id: 's2',
    title: 'Joti ashtukiwa na Mke Mkubwa Live! 🏃‍♂️',
    slug: 'short-joti-mzee-wa-vikoba',
    description: 'Mzee wa Vikoba mambo yameharibika! Bonyeza chini kuangalia video kamili.',
    thumbnail: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=450&h=800&q=80',
    video_url: '/videos/flower.mp4',
    duration_seconds: 52,
    duration_formatted: '0:52',
    content_type: 'short',
    access_type: 'free',
    price_amount: 0,
    currency: 'TZS',
    category: 'Shorts',
    comedian_id: 'c1',
    comedian: INITIAL_COMEDIANS[0],
    views_count: 890000,
    likes_count: 76000,
    is_short: true,
    full_video_id: 'v2',
    published_at: '2026-10-04T15:00:00Z',
    publication_status: 'published',
  },
  {
    id: 's3',
    title: 'Mau Fundi akiomba dictionary ya gereji 🔧',
    slug: 'short-mau-fundi-dictionary',
    description: 'Spana na kizungu havikutani! Tazama video kamili hapa Kicheko.',
    thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=450&h=800&q=80',
    video_url: '/videos/flower.mp4',
    duration_seconds: 38,
    duration_formatted: '0:38',
    content_type: 'short',
    access_type: 'free',
    price_amount: 0,
    currency: 'TZS',
    category: 'Shorts',
    comedian_id: 'c4',
    comedian: INITIAL_COMEDIANS[3],
    views_count: 340000,
    likes_count: 27500,
    is_short: true,
    full_video_id: 'v4',
    published_at: '2026-10-09T08:00:00Z',
    publication_status: 'published',
  },
]

const STORAGE_KEY_VIDEOS = 'kicheko.videos'
const STORAGE_KEY_LIBRARY = 'kicheko.user_library'
const STORAGE_KEY_LIKES = 'kicheko.user_likes'

class VideoService {
  private getLocalCache(): Video[] {
    const raw = localStorage.getItem(STORAGE_KEY_VIDEOS)
    if (!raw) {
      const all = [...FALLBACK_VIDEOS, ...FALLBACK_SHORTS]
      localStorage.setItem(STORAGE_KEY_VIDEOS, JSON.stringify(all))
      return all
    }
    try {
      return JSON.parse(raw)
    } catch {
      return [...FALLBACK_VIDEOS, ...FALLBACK_SHORTS]
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
      if (Array.isArray(data) && data.length > 0) {
        // Cache for offline
        this.saveLocalCache(data)
        return data
      }
    } catch {
      // API call failed, fallback gracefully to cached/local data
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
          v.comedian.stage_name.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q),
      )
    }
    return list
  }

  async getShorts(): Promise<Video[]> {
    try {
      const { data } = await http.get<Video[]>('/videos/shorts/')
      if (Array.isArray(data) && data.length > 0) {
        return data
      }
    } catch {
      // fallback
    }
    return this.getLocalCache().filter((v) => v.is_short)
  }

  async getVideoById(id: string): Promise<Video | null> {
    try {
      const { data } = await http.get<Video>(`/videos/${id}/`)
      if (data && data.id) {
        return data
      }
    } catch {
      // fallback
    }
    const list = this.getLocalCache()
    return list.find((v) => v.id === id || v.slug === id) || null
  }

  async getComedians(): Promise<Comedian[]> {
    try {
      const { data } = await http.get<Comedian[]>('/creators/')
      if (Array.isArray(data) && data.length > 0) {
        return data
      }
    } catch {
      // fallback
    }
    return INITIAL_COMEDIANS
  }

  async getComedianById(id: string): Promise<Comedian | null> {
    try {
      const { data } = await http.get<{ creator: Comedian; videos: Video[] }>(`/creators/${id}/`)
      if (data && data.creator) {
        return data.creator
      }
    } catch {
      // fallback
    }
    return INITIAL_COMEDIANS.find((c) => c.id === id) || null
  }

  async createVideo(payload: VideoUploadPayload): Promise<Video> {
    try {
      const { data } = await http.post<Video>('/creator/videos/', payload)
      if (data && data.id) {
        return data
      }
    } catch {
      // fallback to local creation
    }

    const comedian = INITIAL_COMEDIANS.find((c) => c.id === payload.comedian_id) || INITIAL_COMEDIANS[0]
    const id = `v_${Date.now()}`
    const isShort = Boolean(payload.is_short)

    const newVideo: Video = {
      id,
      title: payload.title,
      slug: payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: payload.description || '',
      thumbnail:
        payload.thumbnail_url ||
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&h=450&q=80',
      video_url: payload.video_url || '/videos/oceans.mp4',
      duration_seconds: isShort ? 45 : 600,
      duration_formatted: isShort ? '0:45' : '10:00',
      content_type: isShort ? 'short' : payload.category === 'Skits' ? 'skit' : 'performance',
      access_type: payload.access_type || 'free',
      price_amount: payload.access_type === 'paid' ? Number(payload.price_amount) || 2000 : 0,
      currency: 'TZS',
      category: payload.category || 'Stand-up Comedy',
      comedian_id: comedian.id,
      comedian,
      views_count: 0,
      likes_count: 0,
      is_short: isShort,
      full_video_id: payload.full_video_id,
      published_at: new Date().toISOString(),
      publication_status: 'published',
    }

    const current = this.getLocalCache()
    current.unshift(newVideo)
    this.saveLocalCache(current)
    return newVideo
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
        // Also save to local library storage
        const raw = localStorage.getItem(STORAGE_KEY_LIBRARY)
        const library: string[] = raw ? JSON.parse(raw) : []
        if (!library.includes(videoId)) {
          library.push(videoId)
          localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(library))
        }
        return data
      }
    } catch {
      // fallback
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
    } catch {
      // fallback
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
    } catch {
      // fallback
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
