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
        const res = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        })

        const newToken = res.data.access_token
        localStorage.setItem("token", newToken)

        originalRequest.headers.Authorization = `Bearer ${newToken}`

        return api(originalRequest)
      } catch (err) {
        console.error("Erro ao renovar token:", err)

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
    const res = await api.get("/auth/me")
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
  data: { title: string; content: string }
) {
  const res = await api.post(`/rpg-lore/${rpgId}`, data)
  return res.data
}
export async function updateLore(
  loreId: number,
  data: { title: string; content: string }
) {
  const res = await api.put(`/rpg-lore/item/${loreId}`, data)
  return res.data
}

export async function deleteLore(loreId: number) {
  await api.delete(`/rpg-lore/item/${loreId}`)
}
// ===============================
// 🎮 RPG
// ===============================
export async function getRPG(id: number) {
  const res = await api.get(`/rpgs/${id}`)
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