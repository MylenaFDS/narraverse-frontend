export const NarrativePriority = {

  Observation: 10,

  Description: 15,

  Thought: 18,

  Emotion: 20,

  Action: 30,

  Dialogue: 40,

  Ending: 50,

} as const


export type NarrativePriority =
  typeof NarrativePriority[
    keyof typeof NarrativePriority
  ]