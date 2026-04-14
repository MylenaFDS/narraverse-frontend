import type { Character, CharacterCreatePayload } from "../types/character"

const API = "http://localhost:8000"

export async function getCharacters(rpgId: number): Promise<Character[]> {
  const res = await fetch(`${API}/characters/${rpgId}`)
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