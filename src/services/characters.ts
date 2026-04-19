import type {
  Character,
  CharacterCreatePayload,
  CharacterSheetValue,
} from "../types/character"

import { api } from "./api"

const API = "http://localhost:8000"

// ===============================
// PERSONAGENS
// ===============================
export async function getCharacters(rpgId: number): Promise<Character[]> {
  const res = await fetch(`${API}/characters/${rpgId}`,{
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
  if (!res.ok) throw new Error("Erro ao buscar personagens")
  return res.json()
}

export async function createCharacter(
  rpgId: number,
  data: CharacterCreatePayload
): Promise<Character> {
  const res = await fetch(`${API}/characters/${rpgId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error("Erro ao criar personagem")
  return res.json()
}

// ===============================
// 🔥 FICHA
// ===============================

// 👉 buscar ficha
export async function getCharacterSheet(
  characterId: number
): Promise<CharacterSheetValue[]> {
  const res = await fetch(`${API}/character-sheets/${characterId}`)

  if (!res.ok) throw new Error("Erro ao buscar ficha")

  return res.json()
}

// 👉 salvar ficha
export async function saveCharacterSheet(
  characterId: number,
  data: { field_id: number; value: string }[]
) {
  const token = localStorage.getItem("token")

  // envia UM POR UM (compatível com seu backend atual)
  await Promise.all(
    data.map((item) =>
      fetch(`${API}/character-sheets/${characterId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(item),
      })
    )
  )
}

export async function getMyCharacters() {
  const res = await api.get("/characters/me")
  return res.data
}