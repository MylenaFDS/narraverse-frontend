import type { Goal } from "./GoalTypes"

export class GoalEngine {

  static sort(
    goals: Goal[],
  ): Goal[] {

    return [...goals]

      .filter(
        goal => !goal.completed,
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

  // ===========================================
  // Novo
  // ===========================================

  static next(
    goals: Goal[],
  ): Goal | null {

    return this.current(goals)

  }

  static complete(
    goals: Goal[],
    goalId: string,
  ) {

    const goal = goals.find(
      g => g.id === goalId,
    )

    if (goal) {

      goal.completed = true

    }

  }

  static add(
    goals: Goal[],
    goal: Goal,
  ) {

    goals.push(goal)

  }

  static remove(
    goals: Goal[],
    goalId: string,
  ) {

    return goals.filter(
      goal =>
        goal.id !== goalId,
    )

  }

  static hasActiveGoal(
    goals: Goal[],
  ) {

    return this.current(goals) !== null

  }

}