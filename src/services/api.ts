import type { FeedResponse } from "../types/feed"

const API_URL = "http://127.0.0.1:8000/docs#/";

export async function getFeed(): Promise<FeedResponse> {
  const response = await fetch(`${API_URL}/feed`)

  if (!response.ok) {
    throw new Error("Erro ao buscar feed")
  }

  return response.json()
}