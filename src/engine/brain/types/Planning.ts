export interface PlanStep {

  id: string

  description: string

  completed: boolean

}

export interface Plan {

  goal: string

  strategy: string

  estimatedTurns: number

  steps: PlanStep[]

}