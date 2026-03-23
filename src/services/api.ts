import type { FeedResponse } from "../types/feed"

const API_URL = "http://127.0.0.1:8000";

export async function getFeed(): Promise<FeedResponse> {
  const response = await fetch(`${API_URL}/feed`)

  if (!response.ok) {
    throw new Error("Erro ao buscar feed")
  }

  return response.json()
}

// 🔥 NOVO
export async function getTurns(rpgId: number) {
  const response = await fetch(`${API_URL}/rpg-turns/${rpgId}`)
  return response.json()
}

export async function createTurn(rpgId: number, content: string) {
  const token = localStorage.getItem("token")

  const response = await fetch(`${API_URL}/rpg-turns/${rpgId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  })

  return response.json()
}

export async function getLore(rpgId: number) {
  const response = await fetch(`http://127.0.0.1:8000/rpg-lore/${rpgId}`)
  return response.json()
}

export async function createLore(
  rpgId: number,
  data: { title: string; content: string }
) {
  const token = localStorage.getItem("token")

  const response = await fetch(`http://127.0.0.1:8000/rpg-lore/${rpgId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  return response.json()
}