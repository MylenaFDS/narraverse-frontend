import type { Goal } from "./GoalTypes"

export class GoalEngine {

  static sort(

    goals: Goal[],

  ): Goal[] {

    return [...goals]

      .filter(

        (goal) => !goal.completed,

      )

      .sort(

        (a, b) =>

          b.priority - a.priority,

      )

  }

  static current(

    goals: Goal[],

  ): Goal | null {

    return this.sort(goals)[0] ?? null

  }

}