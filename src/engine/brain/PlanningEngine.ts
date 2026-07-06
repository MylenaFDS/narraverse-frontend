import type { Goal } from "./types/Goal"
import type { Strategy } from "./types/Strategy"

import type {

  Plan,
  PlanStep,

} from "./types/Planning"

export class PlanningEngine {

  static create(

    goal: Goal,

    strategy?: Strategy | null,

  ): Plan {

    const steps: PlanStep[] = []

    switch (strategy?.id) {

      case "combat":

        steps.push(

          {

            id: "observe",

            description: "Observar o alvo",

            completed: false,

          },

          {

            id: "approach",

            description: "Aproximar-se",

            completed: false,

          },

          {

            id: "attack",

            description: "Atacar",

            completed: false,

          },

        )

        break

      case "protect":

        steps.push(

          {

            id: "follow",

            description: "Acompanhar aliado",

            completed: false,

          },

          {

            id: "observe",

            description: "Vigiar arredores",

            completed: false,

          },

          {

            id: "intercept",

            description: "Interceptar ameaças",

            completed: false,

          },

        )

        break

      case "exploration":

        steps.push(

          {

            id: "search",

            description: "Explorar região",

            completed: false,

          },

          {

            id: "inspect",

            description: "Investigar pontos",

            completed: false,

          },

          {

            id: "report",

            description: "Registrar descobertas",

            completed: false,

          },

        )

        break

      case "diplomacy":

        steps.push(

          {

            id: "approach",

            description: "Aproximar",

            completed: false,

          },

          {

            id: "dialogue",

            description: "Conversar",

            completed: false,

          },

          {

            id: "convince",

            description: "Convencer",

            completed: false,

          },

        )

        break

      default:

        steps.push(

          {

            id: "think",

            description: goal.title,

            completed: false,

          },

        )

    }

    return {

      goal: goal.title,

      strategy:

        strategy?.title ??

        "Livre",

      estimatedTurns:

        strategy?.estimatedTurns ??

        1,

      steps,

    }

  }

}