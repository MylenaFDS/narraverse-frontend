import type { Decision } from "./types/Decision"

import type { Prediction } from "./types/Prediction"

import type { Consequence } from "./types/Consequence"

import type { Reflection } from "./types/Reflection"

import type { ActionSequence } from "./types/ActionSequence"

export class ReflectionEngine {

  static analyze(

    _decision: Decision,

    _actions: ActionSequence,

    prediction: Prediction,

    consequence: Consequence,

): Reflection {

    const learned: string[] = []

    const mistakes: string[] = []

    if (prediction.successChance >= 70) {

      learned.push(

        "A decisão parecia sólida.",

      )

    }

    if (

      consequence.shortTerm

        .toLowerCase()

        .includes("perseguição")

    ) {

      mistakes.push(

        "A fuga pode gerar perseguição.",

      )

    }

    return {

      summary:

        consequence.longTerm,

      learned,

      mistakes,

      confidence:

        prediction.successChance,

    }

  }

}