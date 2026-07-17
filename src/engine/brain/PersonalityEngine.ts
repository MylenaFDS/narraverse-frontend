import type { Personality } from "./types/Personality"

import {
  PersonalityPresets,
} from "./PersonalityPresets"

import type { BrainProfile } from "./BrainProfile"

export class PersonalityEngine {

  static createRandom(): Personality {

    return {

      courage: Math.random() * 100,
      honor: Math.random() * 100,
      empathy: Math.random() * 100,
      greed: Math.random() * 100,
      curiosity: Math.random() * 100,
      patience: Math.random() * 100,
      cruelty: Math.random() * 100,
      ambition: Math.random() * 100,
      loyalty: Math.random() * 100,
      intelligence: Math.random() * 100,

    }

  }

  static fromPreset(
    preset: keyof typeof PersonalityPresets,
  ): Personality {

    return structuredClone(
      PersonalityPresets[preset],
    )

  }

  static build(
    profile: BrainProfile,
  ): Personality {

    return profile.personality

  }

  // =====================================
  // Interpretação da personalidade
  // =====================================

  static isCautious(
    personality: Personality,
  ): boolean {

    return (
      personality.patience >= 70
    )

  }

  static isIntrospective(
    personality: Personality,
  ): boolean {

    return (
      personality.intelligence >= 70
      &&
      personality.empathy >= 50
    )

  }

  static isSociable(
    personality: Personality,
  ): boolean {

    return (
      personality.empathy >= 40
    )

  }

  static isImpulsive(
    personality: Personality,
  ): boolean {

    return (
      personality.courage >= 80
      &&
      personality.patience <= 30
    )

  }

  static isAggressive(
    personality: Personality,
  ): boolean {

    return (
      personality.cruelty >= 70
    )

  }

  static isCurious(
    personality: Personality,
  ): boolean {

    return (
      personality.curiosity >= 70
    )

  }

  static isHonorable(
    personality: Personality,
  ): boolean {

    return (
      personality.honor >= 70
    )

  }

  static isEmpathetic(
    personality: Personality,
  ): boolean {

    return (
      personality.empathy >= 70
    )

  }

}