import type {
  EventType,
} from "./EventType"


export interface StoryEvent {


  // ======================================
  // Tipo do evento
  // ======================================

  type: EventType



  // ======================================
  // Personagem que realizou a ação
  // ======================================

  actorId?: number

  actorName?: string



  // ======================================
  // Personagens afetados
  // ======================================

  /**
   * Primeiro alvo principal
   * Mantido para compatibilidade
   * com engines antigas
   */
  targetId?: number

  targetName?: string



  /**
   * Novos eventos podem envolver
   * vários personagens:
   *
   * Aragorn + Arwen
   * Frodo + Sam + Legolas
   */
  targetIds?: number[]



  targetNames?: string[]



  // ======================================
  // Mundo
  // ======================================

  location?: string



  // ======================================
  // Relações
  // ======================================


  /**
   * Exemplo:
   *
   * romance
   * amizade
   * aliança
   * rivalidade
   * traição
   */
  relationType?: string



  // ======================================
  // Estado emocional
  // ======================================

  emotion?: string



  // ======================================
  // Informação narrativa
  // ======================================

  description: string



  /**
   * Texto original do turno
   *
   * Usado para:
   * - memória
   * - resumo
   * - reconstrução narrativa
   */
  sourceText?: string



  // ======================================
  // Impacto narrativo
  // ======================================


  importance?: 
    | "low"
    | "medium"
    | "high"
    | "critical"



  /**
   * Indica se o evento
   * muda o estado do mundo
   */
  worldImpact?: boolean



  // ======================================
  // Tempo
  // ======================================

  turnId?: number


}