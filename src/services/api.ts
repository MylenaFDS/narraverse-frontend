import type { FeedResponse } from "../types/feed"
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
export async function getTurns(rpgId: number) {
  const response = await fetch(`${API_URL}/rpg-turns/${rpgId}`)
  return response.json()
}

export async function createTurn(rpgId: number, content: string) {
  const response = await fetch(`${API_URL}/rpg-turns/${rpgId}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ content }),
  })

  return response.json()
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