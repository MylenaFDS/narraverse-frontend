import type { EventType } from "./EventType"

export interface StoryEvent {

  type: EventType

  actor?: number

  target?: number

  location?: string

  emotion?: string

  description: string

}