import type { FeedResponse } from "../types/feed"
import type { CreateSheetFieldDTO } from "../types/character"
import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:8000",
})

const API_URL = "http://127.0.0.1:8000"

// 🔐 helper de auth
function getAuthHeaders() {
  const token = localStorage.getItem("token")

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

// 🔑 AUTH
export async function login(email: string, password: string) {
  const formData = new URLSearchParams()

  formData.append("username", email) // ⚠️ MUITO IMPORTANTE
  formData.append("password", password)

  const response = await fetch("http://127.0.0.1:8000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  })

  return response.json()
}

export async function register(
  username: string,
  email: string,
  password: string
) {
  const response = await fetch("http://127.0.0.1:8000/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  })

  return response.json()
}

export async function getMe() {
  const token = localStorage.getItem("token")

  const response = await fetch("http://127.0.0.1:8000/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.json()
}

export async function getUserProfile(userId: number) {
  const response = await fetch(`http://127.0.0.1:8000/users/${userId}`)
  return response.json()
}

export async function updateProfile(data: {
  username?: string
  bio?: string
}) {
  const token = localStorage.getItem("token")

  const response = await fetch("http://127.0.0.1:8000/users/me", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  return response.json()
}
// 📡 FEED
export async function getFeed(): Promise<FeedResponse> {
  const response = await fetch(`${API_URL}/feed/`)

  if (!response.ok) {
    throw new Error("Erro ao buscar feed")
  }

  return response.json()
}

// 🎭 TURNOS
// 
export async function createTurn(
  rpgId: number,
  data: {
    content: string
    reply_to_turn_id?: number | null
  }
) {
  const token = localStorage.getItem("token")

  console.log("Enviando turno:", data)
  console.log("Token:", token)

  const res = await fetch(`http://localhost:8000/rpg-turns/${rpgId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.text()
    console.error("Erro API:", error)
    throw new Error("Erro ao criar turno")
  }

  const json = await res.json()
  console.log("Resposta API:", json)

  return json
}
export async function getTurns(rpgId: number) {
  const token = localStorage.getItem("token")

  const res = await fetch(`http://localhost:8000/rpg-turns/${rpgId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return res.json()
}



// 📚 LORE
export async function getLore(rpgId: number) {
  const response = await fetch(`${API_URL}/rpg-lore/${rpgId}`)
  return response.json()
}

export async function createLore(
  rpgId: number,
  data: { title: string; content: string }
) {
  const response = await fetch(`${API_URL}/rpg-lore/${rpgId}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })

  return response.json()
}

export async function getRPG(id: number) {
  const res = await api.get(`/rpgs/${id}`)
  return res.data
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem("refresh_token")

      if (!refreshToken) {
        window.location.href = "/login"
        return Promise.reject(error)
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/auth/refresh", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        })

        const data = await res.json()

        localStorage.setItem("token", data.access_token)

        originalRequest.headers.Authorization = `Bearer ${data.access_token}`

        return api(originalRequest)
      } catch (err) {
        console.error("Erro ao renovar token:", err)
        localStorage.clear()
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  }
)

export async function deleteTurn(turnId: number) {
  await api.delete(`/rpg-turns/${turnId}`)
}

export async function getSheetFields(rpgId: number) {
  const res = await api.get(`/rpg-sheet-fields/${rpgId}`)
  return res.data
}

export async function createSheetField(rpgId: number, data: CreateSheetFieldDTO) {
  const token = localStorage.getItem("token")

  const res = await fetch(`http://localhost:8000/rpg-sheet-fields/${rpgId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // 🔥 ESSENCIAL
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Erro ao criar campo")
  }

  return await res.json()
}

export async function updateSheetField(
  fieldId: number,
  data: { name: string }
) {
  const token = localStorage.getItem("token")

  const res = await fetch(`http://localhost:8000/rpg-sheet-fields/${fieldId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Erro ao atualizar campo")
  }

  return res.json()
}