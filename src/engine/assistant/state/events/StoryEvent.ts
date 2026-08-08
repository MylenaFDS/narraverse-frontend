import type {
  EventType,
} from "../../types/EventType"



// ======================================
// Subtipos narrativos
// ======================================

export type StoryEventSubtype =


// ======================================
// Relações
// ======================================

  | "marriage"
  | "romantic"
  | "friendship"
  | "family"
  | "rivalry"
  | "trust"



// ======================================
// Alianças
// ======================================

  | "treaty"
  | "oath"
  | "military"
  | "political"



// ======================================
// Conflitos
// ======================================

  | "betrayal"



// ======================================
// Outros
// ======================================

  | "unknown"



export interface StoryEvent {


  // ======================================
  // Identificação
  // ======================================

  id?:string

  type:EventType

  subtype?:StoryEventSubtype



  // ======================================
  // Personagem principal
  // ======================================

  actorId?:number

  actorName?:string



  // ======================================
  // Alvo
  // ======================================

  targetId?:number

  targetName?:string



  // ======================================
  // Outros participantes
  // ======================================

  participants?:string[]



  // ======================================
  // Mundo
  // ======================================

  faction?:string

  location?:string

  item?:string



  // ======================================
  // Emoções
  // ======================================

  emotion?:string



  // ======================================
  // Narrativa
  // ======================================

  description:string

  consequence?:string

  sourceText?:string

  summary?:string



  // ======================================
  // Dramaturgia
  // ======================================

  importance?:number

  dramaticWeight?:number

  tensionDelta?:number

  plotImpact?:
    | "low"
    | "medium"
    | "high"



  // ======================================
  // Continuidade
  // ======================================

  createsThread?:boolean

  resolvesThread?:boolean

  opensMystery?:boolean

  closesMystery?:boolean



  // ======================================
  // Consequências
  // ======================================

  consequences?:string[]



  // ======================================
// Classificação
// ======================================

tags?: string[]

relationshipType?:
  | "marriage"
  | "romance"
  | "engagement"
  | "alliance"
  | "betrayal"
  | "friendship"
  | "other"



  // ======================================
  // Tempo
  // ======================================

  turnId?:number

  timestamp?:number



  // ======================================
  // Reputação
  // ======================================

  reputationTarget?:string

  reputationValue?:number

}