import type { Character } from "../../types/character"

import type { Personality } from "./PersonalityTypes"
import type { EmotionState } from "./EmotionTypes"
import type { Goal } from "./GoalTypes"
import type { Relationship } from "./RelationshipTypes"
import type { Knowledge } from "./KnowledgeTypes"

export interface BrainProfile {

  character: Character

  personality: Personality

  emotions: EmotionState

  goals: Goal[]

  relationships: Relationship[]

  knowledge: Knowledge[]

  memories: string[]

}