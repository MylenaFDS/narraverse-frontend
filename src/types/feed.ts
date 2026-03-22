export interface FeedRPG {
  id: number
  name: string
  description: string
  participants_count: number
  recent_activity: boolean
}

export interface FeedResponse {
  recent: FeedRPG[]
  popular: FeedRPG[]
  active: FeedRPG[]
}