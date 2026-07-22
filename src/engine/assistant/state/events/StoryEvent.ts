import type { EventType } from "./EventType"

export interface StoryEvent {

  type: EventType

  // Personagem principal do evento
  character?: string

  // Personagem alvo (quando existir)
  target?: string

  // IDs opcionais
  actorId?: number

  targetId?: number

  // Local onde ocorreu
  location?: string

  // Emoção predominante
  emotion?: string

  // Momento do evento
  turn?: number

  // Texto original
  description: string

}