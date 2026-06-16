import axios from "axios"
import type { AxiosError } from "axios"
import type { FeedResponse } from "../types/feed"
import type { CreateSheetFieldDTO } from "../types/character"

// ===============================
// 🌐 BASE URL
// ===============================
const API_URL = "http://127.0.0.1:8001"

// ===============================
// 🔥 AXIOS INSTANCE
// ===============================
export const api = axios.create({
  baseURL: API_URL,
})

// ===============================
// 🔐 INTERCEPTOR TOKEN
// ===============================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// ===============================
// 🔄 REFRESH TOKEN (FIXED)
// ===============================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // 🔥 evita loop infinito
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem("refresh_token")

      // ❌ NÃO redireciona aqui
      if (!refreshToken) {
        localStorage.clear()
        return Promise.reject(error)
      }

      try {
  const res = await axios.post(
    `${API_URL}/auth/refresh`,
    {
      refresh_token: refreshToken,
    }
  )

  const newToken = res.data.access_token

  // ✅ salva token novo
  localStorage.setItem("token", newToken)

  // 🔥 AVISA O APP QUE O TOKEN FOI ATUALIZADO
  window.dispatchEvent(
    new Event("token-refreshed")
  )

  originalRequest.headers.Authorization =
    `Bearer ${newToken}`

  return api(originalRequest)

} catch (err) {
  console.error(
    "Erro ao renovar token:",
    err
  )

  localStorage.clear()

  return Promise.reject(error)
}
    }

    return Promise.reject(error)
  }
)

// ===============================
// 🔑 AUTH
// ===============================
export async function login(email: string, password: string) {
  const formData = new URLSearchParams()
  formData.append("username", email)
  formData.append("password", password)

  const res = await axios.post(`${API_URL}/auth/login`, formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  })

  return res.data
}

export async function register(username: string, email: string, password: string) {
  const res = await api.post("/auth/register", {
    username,
    email,
    password,
  })

  return res.data
}

export async function getMe() {
  try {
    const res = await api.get("/users/me")
    return res.data
  } catch (err: unknown) {
    const error = err as AxiosError

    // 🔥 ignora abort (super importante)
    if (error.code === "ERR_CANCELED") {
      return null
    }

    if (error.response?.status === 401) {
      return null
    }

    console.error("Erro getMe:", error)
    return null
  }
}
// ===============================
// 👤 USER
// ===============================
export async function getPublicProfile(userId: number) {
  const res = await api.get(`/users/${userId}/profile`)
  return res.data
}

export async function updateProfile(data: {
  username?: string
  bio?: string
}) {
  const res = await api.put("/users/me", data)
  return res.data
}
// ===============================
// 📡 FEED
// ===============================
export async function getFeed(): Promise<FeedResponse> {
  const res = await api.get("/feed/")
  return res.data
}

// ===============================
// 🎭 TURNOS
// ===============================
export type CreateTurnDTO = {
  content: string
  reply_to_turn_id?: number | null
  mentioned_characters?: number[]
  character_id?: number | null
}

export async function createTurn(rpgId: number, data: CreateTurnDTO) {
  const res = await api.post(`/rpg-turns/${rpgId}`, data)
  return res.data
}

export async function getTurns(rpgId: number) {
  const res = await api.get(`/rpg-turns/${rpgId}`)
  return res.data
}

export async function deleteTurn(turnId: number) {
  await api.delete(`/rpg-turns/${turnId}`)
}

// ===============================
// 📚 LORE
// ===============================
export async function getLore(rpgId: number) {
  const res = await api.get(`/rpg-lore/${rpgId}`)
  return res.data
}

export async function createLore(
  rpgId: number,
  data: { title: string; content: string; category?: string; order?: number }
) {
  const res = await api.post(`/rpg-lore/${rpgId}`, data)
  return res.data
}
export async function updateLore(
  loreId: number,
  data: {
    title: string
    content: string
    category?: string
    order?: number
  }
) {
  const res = await api.put(
    `/rpg-lore/${loreId}`,
    data
  )

  return res.data
}

export async function deleteLore(
  loreId: number
) {
  await api.delete(
    `/rpg-lore/${loreId}`
  )
}
export async function getTimelineByLore(
  loreId: number
) {
  const res = await api.get(
    `/timeline/lore/${loreId}`
  )

  return res.data
}
// ===============================
// 🎮 RPG
// ===============================
export async function getRPG(id: number) {
  const res = await api.get(`/rpgs/${id}`)
  return res.data
}

export async function getRPGs() {
  const res = await api.get("/rpgs")
  return res.data
}

export async function createRPG(data: {
  name: string
  description?: string
  allow_join_requests?: boolean
  tags?: string[]
}) {
  const res = await api.post(
    "/rpgs/",
    data
  )

  return res.data
}

export async function getRPGPlayers(
  rpgId: number
) {
  const res = await api.get(
    `/rpgs/${rpgId}/players`
  )

  return res.data
}

export async function getRPGStats(
  rpgId: number
) {
  const res = await api.get(
    `/rpgs/${rpgId}/stats`
  )

  return res.data
}

export async function deleteRPG(
  rpgId: number
) {
  await api.delete(`/rpgs/${rpgId}`)
}

export async function getRPGNotes(
  rpgId: number
) {
  const res = await api.get(
    `/notes/rpg/${rpgId}`
  )

  return res.data
}

export async function createRPGNote(
  rpgId: number,
  data: {
    title?: string
    content?: string
  }
) {
  const res = await api.post(
    `/notes/rpg/${rpgId}`,
    data
  )

  return res.data
}

export async function updateRPGNote(
  noteId: number,
  data: {
    title?: string
    content?: string
  }
) {
  const res = await api.put(
    `/notes/${noteId}`,
    data
  )

  return res.data
}

export async function deleteRPGNote(
  noteId: number
) {
  const res = await api.delete(
    `/notes/${noteId}`
  )

  return res.data
}

export type RPGFaction = {
  id: number
  name: string
  description?: string | null
  rpg_id: number
  member_count?: number
}

export async function getFactions(
  rpgId: number
) {
  const res = await api.get(
    `/factions/rpg/${rpgId}`
  )

  return res.data
}
// ===============================
// 👥 PARTICIPANTES / CONVITES
// ===============================

export async function getPendingRequests(
  rpgId: number
) {
  const res = await api.get(
    `/rpgs/${rpgId}/requests`
  )

  return res.data
}

export async function updateParticipantStatus(
  rpgId: number,
  userId: number,
  status: "accepted" | "rejected"
) {
  const res = await api.put(
    `/rpgs/${rpgId}/participants/${userId}?status=${status}`
  )

  return res.data
}

export async function requestToJoinRPG(
  rpgId: number
) {
  const res = await api.post(
    `/rpgs/${rpgId}/request`
  )

  return res.data
}

// 🔥 ADICIONAR AQUI
export async function inviteUserToRPG(
  rpgId: number,
  userId: number
) {
  const res = await api.post(
    `/rpgs/${rpgId}/invite`,
    {
      user_id: userId,
    }
  )

  return res.data
}
export async function getMyInvites() {
  const res = await api.get(
    "/rpgs/invites"
  )

  return res.data
}

// 🔥 ADICIONAR AQUI
export async function acceptInvite(
  rpgId: number
) {
  const res = await api.put(
    `/rpgs/invites/${rpgId}/accept`
  )

  return res.data
}

export async function rejectInvite(
  rpgId: number
) {
  const res = await api.put(
    `/rpgs/invites/${rpgId}/reject`
  )

  return res.data
}

export async function getInviteCount() {
  const res = await api.get(
    "/rpgs/invites"
  )

  return res.data.length
}

export async function getSentInvites(
  rpgId: number
) {
  const res = await api.get(
    `/rpgs/${rpgId}/invites/sent`
  )

  return res.data
}

export async function cancelSentInvite(
  rpgId: number,
  userId: number
) {
  const res = await api.delete(
    `/rpgs/${rpgId}/invites/${userId}`
  )

  return res.data
}
// ===============================
// 📄 FICHA
// ===============================
export async function getSheetFields(rpgId: number) {
  const res = await api.get(`/rpg-sheet-fields/${rpgId}`)
  return res.data
}

export async function createSheetField(
  rpgId: number,
  data: CreateSheetFieldDTO
) {
  const res = await api.post(`/rpg-sheet-fields/${rpgId}`, data)
  return res.data
}

export async function updateSheetField(
  fieldId: number,
  data: { name: string }
) {
  const res = await api.put(`/rpg-sheet-fields/${fieldId}`, data)
  return res.data
}

export async function deleteSheetField(fieldId: number) {
  await api.delete(`/sheet-fields/${fieldId}`)
}

// ===============================
// 🗺️ MAPA
// ===============================

export async function createMapRegion(
  rpgId: number,
  data: {
    name: string
    lore_id?: number
    pos_x: number
    pos_y: number
    color?: string
  }
) {
  const res = await api.post(
    `/rpgs/${rpgId}/map-regions`,
    data
  )

  return res.data
}

export async function getMapRegions(
  rpgId: number
) {
  const res = await api.get(
    `/rpgs/${rpgId}/map-regions`
  )

  return res.data
}

export async function updateMapRegionPosition(
  regionId: number,
  data: {
    pos_x: number
    pos_y: number
  }
) {
  const res = await api.put(
  `/rpgs/map-regions/${regionId}/position`,
  data
)
  return res.data
}

export async function uploadMapImage(
  rpgId: number,
  file: File
) {
  const formData = new FormData()

  formData.append("file", file)

  const res = await api.post(
    `/rpgs/${rpgId}/map-image`,
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  )

  return res.data
}

// ===============================
// 📂 LORE CATEGORIES
// ===============================

export async function getLoreCategories(
  rpgId: number
) {
  const res = await api.get(
    `/rpg-lore/${rpgId}/categories`
  )

  return res.data
}

export async function createLoreCategory(
  rpgId: number,
  name: string
) {
  const res = await api.post(
    `/rpg-lore/${rpgId}/categories`,
    { name }
  )

  return res.data
}

// ===============================
// 💡 LORE SUGGESTIONS
// ===============================

export async function getLoreSuggestions(
  rpgId: number
) {
  const res = await api.get(
    `/rpg-lore/${rpgId}/suggestions`
  )

  return res.data
}

export async function approveLoreSuggestion(
  loreId: number
) {
  const res = await api.put(
    `/rpg-lore/${loreId}/approve`
  )

  return res.data
}

export async function uploadRPGBanner(
  rpgId: number,
  file: File
) {
  const formData = new FormData()

  formData.append("file", file)

  const response = await api.post(
    `/rpgs/${rpgId}/banner`,
    formData
  )

  return response.data
}

// =====================
// 📜 RPG TIMELINE
// =====================

export async function getTimeline(
  rpgId: number
) {
  const res = await api.get(
    `/timeline/rpg/${rpgId}`
  )

  return res.data
}


export async function createTimelineEvent(
  rpgId: number,
  data: {
    title: string
    content?: string
    date_label?: string
    lore_id?: number | null
    turn_id?: number | null
    category_id?: number | null
    character_ids?: number[]
    faction_ids?: number[]
  }
) {
  const res = await api.post(
    `/timeline/rpg/${rpgId}`,
    data
  )

  return res.data
}


export async function updateTimelineEvent(
  eventId: number,
  data: {
    title: string
    content?: string
    date_label?: string
    lore_id?: number | null
    turn_id?: number | null
    category_id?: number | null
    character_ids?: number[]
    faction_ids?: number[]
  }
) {
  const res = await api.put(
    `/timeline/${eventId}`,
    data
  )

  return res.data
}


export async function deleteTimelineEvent(
  eventId: number
) {
  const res = await api.delete(
    `/timeline/${eventId}`
  )

  return res.data
}

export async function getTimelineByCharacter(
  characterId: number
) {
  const res = await api.get(
    `/timeline/character/${characterId}`
  )

  return res.data
}
// =====================
// 📜 TIMELINE CATEGORIES
// =====================

export type TimelineCategory = {
  id: number
  name: string
  rpg_id: number
}

export async function getTimelineCategories(
  rpgId: number
) {
  const res = await api.get(
    `/timeline-categories/rpg/${rpgId}`
  )

  return res.data
}

export async function createTimelineCategory(
  rpgId: number,
  name: string
) {
  const res = await api.post(
    `/timeline-categories/rpg/${rpgId}`,
    {
      name,
    }
  )

  return res.data
}

export async function deleteTimelineCategory(
  categoryId: number
) {
  const res = await api.delete(
    `/timeline-categories/${categoryId}`
  )

  return res.data
}
// =====================
// 🔗 LORE RELATIONS
// =====================

export async function getLoreRelations(
  loreId: number
) {
  const res = await api.get(
    `/lore-relations/${loreId}`
  )

  return res.data
}

export async function createLoreRelation(
  sourceLoreId: number,
  targetLoreId: number
) {
  const res = await api.post(
    `/lore-relations/${sourceLoreId}`,
    {
      target_lore_id: targetLoreId,
    }
  )

  return res.data
}

export async function deleteLoreRelation(
  relationId: number
) {
  await api.delete(
    `/lore-relations/${relationId}`
  )
}

export async function getCharactersByLore(
  loreId: number
) {
  const res = await api.get(
    `/characters/lore/${loreId}`
  )

  return res.data
}

export type FactionMember = {
  id: number
  name: string
  history?: string | null
  image_url?: string | null
  world_lore_id?: number | null
  world_lore?: {
    id: number
    title: string
  } | null
}

export type FactionTimelineEvent = {
  id: number
  title: string
  content?: string | null
  date_label?: string | null

  lore?: {
    id: number
    title: string
  } | null

  category?: {
    id: number
    name: string
  } | null

  characters?: {
    id: number
    name: string
  }[]
}

export type RPGFactionDetail = RPGFaction & {
  members: FactionMember[]
  timeline_events: FactionTimelineEvent[]
}

export async function getFactionDetail(
  factionId: number
) {
  const res = await api.get(
    `/factions/${factionId}`
  )

  return res.data
}