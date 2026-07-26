import type {
  EventType,
} from "./EventType"


export interface StoryEvent {


  /**
   * Tipo do acontecimento
   */
  type: EventType



  /**
   * Personagem que causou o evento
   */
  actorId?: number
  actorName?: string


  /**
   * Personagem afetado
   */
  targetId?: number



  /**
   * Local onde ocorreu
   */
  location?: string



  /**
   * Emoção associada
   */
  emotion?: string



  /**
   * Descrição original extraída do turno
   */
  description: string



  /**
   * Momento em que ocorreu
   * útil para histórico
   */
  turnId?: number


}