import type { NarrativeEventType } from "./NarrativeEventType"
import type { NarrativePriority } from "./NarrativePriority"


export interface NarrativeEvent<T = unknown> {


  // ======================================
  // Identificação
  // ======================================

  id:string



  // ======================================
  // Tipo narrativo
  // ======================================

  type:NarrativeEventType



  // ======================================
  // Dados do evento
  // ======================================

  payload:T



  // ======================================
  // Ordem narrativa
  // ======================================

  priority:NarrativePriority



  // ======================================
  // Peso dramático
  // ======================================

  tension?:number


  emotionalWeight?:number


  narrativeWeight?:number



  // ======================================
  // Contexto
  // ======================================

  characters:string[]


  locations:string[]



  // ======================================
  // Relação causal
  // ======================================

  causes:string[]


  consequences:string[]


  followUps:string[]



  // ======================================
  // Memória
  // ======================================

  memorable:boolean


  importance:number


}