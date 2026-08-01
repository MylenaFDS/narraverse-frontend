export type SummaryEventType =

  | "combat"
  | "death"
  | "relationship"
  | "dialogue"
  | "quest"
  | "discovery"
  | "prophecy"
  | "emotion"



export type SummaryEventImportance =

  | "low"
  | "medium"
  | "high"



export interface SummaryEvent {


  type: SummaryEventType


  description:string


  importance:SummaryEventImportance


}