import type {
  EventType,
} from "../../types/EventType"



export interface StoryEvent {


  // ======================================
  // Tipo do evento
  // ======================================

  type: EventType



  // ======================================
  // Personagens envolvidos
  // ======================================

  actorId?: number

  actorName?: string


  targetId?: number

  targetName?: string


  participants?: string[]



  // ======================================
  // Facções e mundo
  // ======================================

  faction?: string

  location?: string

  item?: string



  // ======================================
  // Estado emocional
  // ======================================

  emotion?: string



  // ======================================
  // Importância narrativa
  // ======================================

  importance?: number

  tags?: string[]



  // ======================================
  // Texto narrativo
  // ======================================

  description: string


  consequence?: string


  sourceText?: string



  // ======================================
  // Controle temporal
  // ======================================

  turnId?: number

  timestamp?: number



  // ======================================
  // Sistema de reputação
  // ======================================


  /**
   * Quem sofreu alteração de reputação
   *
   * Ex:
   * "Aragorn"
   * "Casa Stark"
   * "Reino de Gondor"
   */
  reputationTarget?: string



  /**
   * Valor da mudança
   *
   * Positivo:
   * +10 aliado
   *
   * Negativo:
   * -20 inimigo
   */
  reputationValue?: number



}