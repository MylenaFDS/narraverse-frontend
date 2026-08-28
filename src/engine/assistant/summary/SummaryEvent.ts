export type SummaryEventType =


  // ======================================
  // Conflitos e ações
  // ======================================

  | "combat"
  | "death"
  | "betrayal"
  | "movement"


  // ======================================
  // Relações e sociedade
  // ======================================

  | "relationship"
  | "alliance"
  | "political"


  // ======================================
  // Informação e narrativa
  // ======================================

  | "dialogue"
  | "discovery"
  | "prophecy"
  | "emotion"


  // ======================================
  // Progressão
  // ======================================

  | "quest"
  | "achievement"




export type SummaryEventSubtype =


  // ======================================
  // Alianças
  // ======================================

  | "marriage"
  | "treaty"
  | "oath"
  | "military"
  | "political"


  // ======================================
  // Relações
  // ======================================

  | "romantic"
  | "friendship"
  | "family"
  | "rivalry"
  | "trust"
  | "betrayal"


  // ======================================
  // Outros
  // ======================================

  | "unknown"




export type SummaryEventImportance =

  | "low"
  | "medium"
  | "high"
  | "critical"




export interface SummaryEvent {


  // ======================================
  // Classificação narrativa
  // ======================================

  type:SummaryEventType

  subtype?:SummaryEventSubtype

  importance:SummaryEventImportance

  narrativeWeight:number


  // ======================================
  // Conteúdo narrativo
  // ======================================

  description:string


  // ======================================
  // Participantes
  // ======================================

  actor?:string

  target?:string

  participants?:string[]


  // ======================================
  // Mundo
  // ======================================

  location?:string

  faction?:string

  item?:string


  // ======================================
  // Impacto
  // ======================================

  consequence?:string


  // ======================================
  // Marcadores narrativos
  // ======================================

  tags?: string[]

}