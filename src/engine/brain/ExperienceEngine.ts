import type { BrainProfile } from "./BrainProfile"

import { EvolutionEngine } from "./EvolutionEngine"

export class ExperienceEngine {

  static apply(

    profile: BrainProfile,

    success: boolean,

  ) {

    profile.experience ??= 0

    profile.level ??= 1

    profile.skillPoints ??= 0

    profile.evolutionStage ??= 0

    // ==========================
    // Ganha experiência
    // ==========================

    profile.experience += success ? 10 : 2

    // ==========================
    // Level up
    // ==========================

    while (

      profile.experience >=

      profile.level * 100

    ) {

      profile.experience -=

        profile.level * 100

      profile.level++

      profile.skillPoints += 2

    }

    // ==========================
    // Evolução permanente
    // ==========================

    EvolutionEngine.evolve(

      profile,

    )

  }

}