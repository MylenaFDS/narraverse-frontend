import type {
  SummaryEvent,
} from "./SummaryEvent"



export interface SummaryData {


  // ==================================
  // Contexto da cena
  // ==================================

  location:string | null

  atmosphere:string | null



  // ==================================
  // Eventos importantes
  // ==================================

  majorEvents:SummaryEvent[]



  // ==================================
  // Desenvolvimento narrativo
  // ==================================

  relationships:string[]

  revelations:string[]

  conflicts:string[]

  objectives:string[]



  // ==================================
  // Personagens envolvidos
  // ==================================

  characters:string[]



  // ==================================
  // Consequências narrativas
  // ==================================

  consequences:string[]


}
