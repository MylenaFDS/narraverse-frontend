// ======================================
// Prioridades narrativas
// ======================================

export const NarrativePriority = {


  // Ambiente
  Observation: 10,


  Description: 15,


  // Contexto mental
  Thought: 18,


  Emotion: 20,


  // Continuidade
  Memory: 22,


  // Mistério e conflito
  Mystery: 24,

  Conflict: 26,


  // Ação
  Action: 30,


  Movement: 35,


  // Comunicação
  Dialogue: 40,


  // Consequências
  Consequence: 45,


  // Fechamento / gancho
  Ending: 50,

  Hook: 55,


} as const



export type NarrativePriority =
  typeof NarrativePriority[
    keyof typeof NarrativePriority
  ]