import type { ActionType } from "../../ActionEngine"
export interface Decision {

  action: ActionType

  targetId?: number

  locationId?: number

  probability: number

  reason: string

}