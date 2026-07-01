import type { Character } from "../../types/character"

import type { Personality } from "./PersonalityTypes"

export interface BrainProfile {

  character: Character

  personality: Personality

  memories: string[]

  goals: string[]

  emotions: Record<
    string,
    number
  >

}