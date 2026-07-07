import type { BrainProfile } from "./BrainProfile"

export class EvolutionEngine {

  static evolve(

    profile: BrainProfile,

  ) {

    // A cada nível aumenta coragem
    if (

      profile.level >= 5 &&

      profile.personality.courage < 90

    ) {

      profile.personality.courage += 1

    }

    // Inteligência cresce lentamente

    if (

      profile.level % 3 === 0 &&

      profile.personality.intelligence < 95

    ) {

      profile.personality.intelligence += 1

    }

    // Medo diminui conforme ganha experiência

    if (

      profile.level >= 10 &&

      profile.fears.length > 0

    ) {

      profile.fears = profile.fears.slice(1)

    }

    // Evolução geral

    profile.evolutionStage =

      Math.floor(

        profile.level / 10,

      )

  }

}