export interface PlanStep {

  description: string

  completed: boolean

}

export interface Plan {

  goal: string

  steps: PlanStep[]

}