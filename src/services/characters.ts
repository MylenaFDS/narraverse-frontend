import type {
  Character,
  CharacterCreatePayload,
  CharacterSheetValue,
} from "../types/character"

import { api } from "./api"

const API = "http://127.0.0.1:8001"

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
export async function getPublicRPGCharacters(
  rpgId: number
) {
  const res = await api.get(
    `/characters/rpg/${rpgId}/public`
  )

  return res.data
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
export async function getPublicCharacter(
  characterId: number
) {
  const res = await api.get(
    `/characters/${characterId}/public`
  )

  return res.data
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

export async function uploadCharacterImage(
  characterId: number,
  file: File
): Promise<Character> {
  const formData = new FormData()

  formData.append("file", file)

  const res = await fetch(
    `${API}/characters/${characterId}/image`,
    {
      method: "POST",
      headers: {
        Authorization:
          `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    }
  )

  if (!res.ok) {
    throw new Error(
      "Erro ao enviar imagem do personagem"
    )
  }

  return res.json()
}

export async function updateCharacter(
  characterId: number,
  data: {
    name: string
    history: string
    world_lore_id: number | ""
    image?: File | null
  }
) {
  const formData = new FormData()

  formData.append("name", data.name)
  formData.append("history", data.history)

  if (data.world_lore_id !== "") {
    formData.append("world_lore_id", String(data.world_lore_id))
  }

  if (data.image) {
    formData.append("image", data.image)
  }

  const response = await api.put(
    `/characters/${characterId}`,
    formData
  )

  return response.data
}

export async function deleteCharacter(
  characterId: number
) {
  await api.delete(`/characters/${characterId}`)
}