export interface RPG {
  id: number
  name: string
  description?: string
}

export interface UserProfile {
  id: number
  username: string
  email: string
  bio?: string

  owned_rpgs: RPG[]
  participating_rpgs: RPG[]
}