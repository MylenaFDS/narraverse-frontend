import type { Character } from "../../types/character"

import type { Personality } from "./PersonalityTypes"
import type { EmotionState } from "./EmotionTypes"
import type { Goal } from "./GoalTypes"
import type { Relationship } from "./RelationshipTypes"
import type { Knowledge } from "./KnowledgeTypes"
import type { Belief } from "./BeliefTypes"
import type { Desire } from "./DesireTypes"
import type { Fear } from "./FearTypes"
import type { Trust } from "./TrustTypes"
import type { Reputation } from "./ReputationTypes"
import type { InventoryItem } from "./InventoryTypes"

export interface BrainProfile {

  character: Character

  // ==========================
  // Identidade
  // ==========================

  personality: Personality

  emotions: EmotionState

  reputation: Reputation

  // ==========================
  // Motivação
  // ==========================

  goals: Goal[]

  desires: Desire[]

  fears: Fear[]

  beliefs: Belief[]

  // ==========================
  // Relações
  // ==========================

  relationships: Relationship[]

  trust: Trust[]

  // ==========================
  // Conhecimento
  // ==========================

  knowledge: Knowledge[]

  memories: string[]
  
  inventory: InventoryItem[]
  // ==========================
  // Estado atual
  // ==========================

  currentGoal?: Goal | null

  currentEmotion?: string

}