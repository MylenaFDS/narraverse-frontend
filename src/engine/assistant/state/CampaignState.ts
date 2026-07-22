import type { StoryEvent } from "./events/StoryEvent"

export interface CampaignState {

  // Turno atual
  turn: number

  // Histórico completo de acontecimentos
  history: StoryEvent[]

  // Eventos que ainda influenciam a história
  activeEvents: string[]

  // Personagens vivos
  aliveCharacters: string[]

  // Personagens mortos
  deadCharacters: string[]

  // Missões em andamento
  activeQuests: string[]

  // Locais conhecidos
  discoveredLocations: string[]

}