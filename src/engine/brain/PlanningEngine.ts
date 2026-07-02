import type { Goal } from "./GoalTypes"
import type { Plan } from "./PlanningTypes"

export class PlanningEngine {

  static create(
    goal: Goal,
  ): Plan {

    return {

      goal: goal.title,

      steps: [

        {

          description:
            "Analisar situação",

          completed: false,

        },

        {

          description:
            "Executar ação",

          completed: false,

        },

        {

          description:
            "Avaliar resultado",

          completed: false,

        },

      ],

    }

  }

}