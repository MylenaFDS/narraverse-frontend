import type { BrainProfile } from "./BrainProfile"
import type { Character } from "../../types/character"
import type { SocialContext } from "./types/SocialReasoning"

export class SocialReasoningEngine {

  static analyze(
    profile: BrainProfile,
    target: Character,
  ): SocialContext {

    const relationship =
      profile.relationships.find(
        relation =>
          relation.targetId === target.id,
      )

    return {

      trust:
        relationship?.trust ?? 50,

      fear:
        relationship?.fear ?? 0,

      respect:
        relationship?.respect ?? 50,

      affection:
        relationship?.affection ?? 0,

      hostility:
        relationship?.rivalry ?? 0,

      authority:
        relationship?.authority ?? 0,

    }

  }

}