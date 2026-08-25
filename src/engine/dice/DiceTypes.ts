export interface DiceResult {
  expression: string
  rolls: number[]
  modifier: number
  total: number
}

export type DiceOutcome =
  | "critical_failure"
  | "failure"
  | "partial_success"
  | "success"
  | "critical_success"

export interface DiceCheckResult
  extends DiceResult {

  difficulty: number

  success: boolean

  outcome: DiceOutcome

  margin: number
}