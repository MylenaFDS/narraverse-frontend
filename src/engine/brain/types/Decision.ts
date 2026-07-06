export interface Decision {

  action: string

  targetId?: number

  locationId?: number

  probability: number

  reason: string

}