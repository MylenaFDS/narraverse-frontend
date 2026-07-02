import type { EmotionState } from "./EmotionTypes"

import type { BrainProfile } from "./BrainProfile"

export class EmotionEngine {

  static create(): EmotionState {

    return {

      happiness: 50,
      sadness: 0,
      anger: 0,
      fear: 0,
      trust: 50,
      curiosity: 50,
      surprise: 0,
      disgust: 0,

    }

  }

  static increase(

    emotions: EmotionState,

    emotion: keyof EmotionState,

    amount: number,

  ) {

    emotions[emotion] = Math.min(
      100,
      emotions[emotion] + amount,
    )

  }

  static decrease(

    emotions: EmotionState,

    emotion: keyof EmotionState,

    amount: number,

  ) {

    emotions[emotion] = Math.max(
      0,
      emotions[emotion] - amount,
    )

  }

  // =============================
  // NOVO
  // =============================

  static current(
  profile: BrainProfile,
): string {

  return (

    profile.currentEmotion ??

    "Neutro"

  )

}

}