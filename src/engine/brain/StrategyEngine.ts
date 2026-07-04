import type { BrainProfile } from "./BrainProfile"

import type { Strategy } from "./StrategyTypes"

export class StrategyEngine {

  static create(

    profile: BrainProfile,

  ): Strategy | null {

    const goal =

      profile.goals

        .filter(

          goal =>

            !goal.completed,

        )

        .sort(

          (a, b) =>

            b.priority -

            a.priority,

        )[0]

    if (!goal) {

      return null

    }

    const title =
      goal.title.toLowerCase()

    if (

      title.includes("matar") ||

      title.includes("derrotar")

    ) {

      return {

        id: "combat",

        title: "Eliminar alvo",

        description:

          "Localizar, perseguir e derrotar o alvo.",

        priority: goal.priority,

        estimatedTurns: 6,

      }

    }

    if (

      title.includes("proteger")

    ) {

      return {

        id: "protect",

        title: "Proteção",

        description:

          "Permanecer próximo ao alvo e impedir ameaças.",

        priority: goal.priority,

        estimatedTurns: 999,

      }

    }

    if (

      title.includes("explorar")

    ) {

      return {

        id: "exploration",

        title: "Exploração",

        description:

          "Descobrir novas regiões e obter informações.",

        priority: goal.priority,

        estimatedTurns: 8,

      }

    }

    if (

      title.includes("convencer")

    ) {

      return {

        id: "diplomacy",

        title: "Diplomacia",

        description:

          "Influenciar outro personagem.",

        priority: goal.priority,

        estimatedTurns: 5,

      }

    }

    return {

      id: "generic",

      title: goal.title,

      description:

        goal.title,

      priority: goal.priority,

      estimatedTurns: 4,

    }

  }

}