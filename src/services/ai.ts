import { api } from "./api"

// ===============================
// 🧠 IA - TURNOS
// ===============================

export async function generateTurnWithAI(data: {
  character_id: number
  rpg_id: number
}) {
  const res = await api.post(
    "/ai/generate-turn",
    data,
  )

  return res.data
}

// ===============================
// 📍 IA - Hotspots
// ===============================

export async function generateHotspots(
  sceneTitle: string,
  sceneDescription: string,
) {
  const res = await api.post(
    "/ai/generate-hotspots",
    {
      scene_title: sceneTitle,
      scene_description: sceneDescription,
    },
  )

  return res.data.response
}

// ===============================
// 👤 IA - NPC
// ===============================

export async function generateNPCWithAI(
  rpgId: number,
) {
  const res = await api.post(
    `/characters/${rpgId}/generate-npc`,
  )

  return res.data
}