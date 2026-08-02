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





export type SummaryEventImportance =


  | "low"

  | "medium"

  | "high"

  | "critical"





export interface SummaryEvent {



  // ======================================
  // Classificação narrativa
  // ======================================


  type: SummaryEventType



  importance: SummaryEventImportance




  /**
   * Peso usado pelo compositor
   *
   * Quanto maior:
   * - aparece primeiro no resumo
   * - possui maior impacto narrativo
   *
   * Exemplos:
   *
   * morte: 100
   * traição: 90
   * revelação: 80
   * diálogo: 20
   */
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



  /**
   * Marcadores narrativos
   *
   * Exemplos:
   *
   * [
   *  "turning_point",
   *  "major_loss",
   *  "hidden_truth"
   * ]
   */
  tags?:string[]



}