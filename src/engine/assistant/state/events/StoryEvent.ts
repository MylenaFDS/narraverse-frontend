import type {
  EventType,
} from "./EventType"


export interface StoryEvent {


  // ======================================
  // Tipo
  // ======================================

  type: EventType



  // ======================================
  // Personagens envolvidos
  // ======================================

  actorId?: number

  actorName?: string


  targetId?: number

  targetName?: string



  // ======================================
  // Mundo
  // ======================================

  location?: string



  // ======================================
  // Estado emocional
  // ======================================

  emotion?: string



  // ======================================
  // Informação narrativa
  // ======================================

  description: string


  // Texto original
  // importante para resumo e memória
  sourceText?: string



  // ======================================
  // Tempo
  // ======================================

  turnId?: number


}