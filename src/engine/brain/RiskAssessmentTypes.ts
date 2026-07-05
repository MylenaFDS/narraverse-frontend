export type RiskLevel =

  | "low"

  | "medium"

  | "high"

  | "critical"

export interface RiskAssessment {

  score: number

  level: RiskLevel

  reasons: string[]

}