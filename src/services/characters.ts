import type { Character, CharacterCreate, CharacterSheetValue } from "../types/character"

const API = "http://localhost:8000"

export async function getCharacters(rpgId: number): Promise<Character[]> {
  const res = await fetch(`${API}/characters/${rpgId}`)
  if (!res.ok) throw new Error("Erro ao buscar personagens")
  return res.json()
}

export async function createCharacter(
  rpgId: number,
  data: CharacterCreate
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

// 🔥 campos dinâmicos da ficha
export async function getSheetFields(rpgId: number) {
  const res = await fetch(`${API}/character-sheets/${rpgId}`)
  return res.json()
}

// 🔥 valores da ficha do personagem
export async function getCharacterSheet(characterId: number) {
  const res = await fetch(`${API}/character-sheets/character/${characterId}`)
  return res.json()
}

export async function saveCharacterSheet(
  characterId: number,
  data: CharacterSheetValue[]
) {
  await fetch(`${API}/character-sheets/${characterId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  })
}