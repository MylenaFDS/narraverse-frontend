import type { Decision, Habit } from "./types"


export class HabitEngine {

  static update(

    habits: Habit[],

    decision: Decision,

  ) {

    let habit = habits.find(

      h => h.id === decision.action,

    )

    if (!habit) {

      habit = {

        id: decision.action,

        name: decision.action,

        strength: 0,

        occurrences: 0,

      }

      habits.push(habit)

    }

    habit.occurrences++

    habit.strength = Math.min(

      100,

      habit.strength + 1,

    )

  }

}