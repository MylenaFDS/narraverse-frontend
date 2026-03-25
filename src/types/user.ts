export type RPGSummary = {
  id: number
  name: string
  description?: string
}

export type UserProfile = {
  id: number
  username: string
  email: string
  bio?: string

  owned_rpgs: RPGSummary[]
  participating_rpgs: RPGSummary[]
}