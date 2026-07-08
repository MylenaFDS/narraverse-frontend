import type { BrainProfile } from "./BrainProfile"

import type {
  NarrativePrompt,
} from "./types/NarrativePrompt"

import type { Goal } from "./types/Goal"
import type { Strategy } from "./types/Strategy"
import type { TacticalDecision } from "./types/TacticalDecision"
import type { Decision } from "./types/Decision"
import type { Plan, PlanStep } from "./types/Planning"

export class NarrativeContextEngine {

  static create({

    profile,

    goal,

    strategy,

    tactical,

    decision,

    plan,

  }: {

    profile: BrainProfile

    goal: Goal | null

    strategy: Strategy | null

    tactical: TacticalDecision

    decision: Decision

    plan: Plan | null

  }): NarrativePrompt {

    return {

      characterName:
        profile.character.name,

      personality:
        JSON.stringify(
          profile.personality,
        ),

      emotion:
        JSON.stringify(
          profile.emotions,
        ),

      objective:
        goal?.title ??
        "Nenhum",

      strategy:
        strategy?.title ??
        "Livre",

      tacticalDecision:
        tactical.action,

      decision:
        decision.action,

      plan:
        plan?.steps.map(
          (step: PlanStep) =>
            step.description,
        ) ?? [],

      recentMemories:
        profile.memories,

      visibleCharacters: [],

      visibleNPCs: [],

      visibleLore: [],

      visibleFactions: [],

    }

  }

}