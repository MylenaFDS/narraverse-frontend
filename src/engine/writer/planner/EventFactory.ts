import type { NarrativeEvent } from "./NarrativeEvent"
import type { NarrativeEventType } from "./NarrativeEventType"

import { NarrativePriority } from "./NarrativePriority"


export class EventFactory {


  static create<T>(

    type: NarrativeEventType,

    payload: T,

    priority: NarrativePriority,

    options?: {

      // ======================================
      // Peso narrativo
      // ======================================

      tension?: number

      emotionalWeight?: number

      narrativeWeight?: number



      // ======================================
      // Contexto
      // ======================================

      characters?: string[]

      locations?: string[]



      // ======================================
      // Causa e efeito
      // ======================================

      causes?: string[]

      consequences?: string[]

      followUps?: string[]



      // ======================================
      // Memória
      // ======================================

      memorable?: boolean

      importance?: number


    },

  ): NarrativeEvent<T> {


    return {


      // ======================================
      // Identificação
      // ======================================

      id:
        crypto.randomUUID(),



      // ======================================
      // Tipo
      // ======================================

      type,



      // ======================================
      // Conteúdo
      // ======================================

      payload,



      // ======================================
      // Ordem narrativa
      // ======================================

      priority,



      // ======================================
      // Dados dramáticos
      // ======================================

      tension:
        options?.tension
        ??
        0,


      emotionalWeight:
        options?.emotionalWeight
        ??
        0,


      narrativeWeight:
        options?.narrativeWeight
        ??
        0,



      // ======================================
      // Contexto
      // ======================================

      characters:
        options?.characters
        ??
        [],


      locations:
        options?.locations
        ??
        [],



      // ======================================
      // Relações causais
      // ======================================

      causes:
        options?.causes
        ??
        [],


      consequences:
        options?.consequences
        ??
        [],


      followUps:
        options?.followUps
        ??
        [],



      // ======================================
      // Memória narrativa
      // ======================================

      memorable:
        options?.memorable
        ??
        false,


      importance:
        options?.importance
        ??
        0,


    }

  }


}