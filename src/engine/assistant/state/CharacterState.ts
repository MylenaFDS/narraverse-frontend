export interface CharacterState {

  id: number

  name: string

  alive: boolean

  location: string | null

  condition:
    | "healthy"
    | "injured"
    | "critical"
    | "dead"

  companions: number[]

  enemies: number[]

}