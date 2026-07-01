import type {
  Personality,
} from "./PersonalityTypes"

import {
  PersonalityPresets,
} from "./PersonalityPresets"

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
  ) {

    return structuredClone(
      PersonalityPresets[preset],
    )

  }

}