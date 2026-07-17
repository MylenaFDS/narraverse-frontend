import type { NarrativeEvent } from "./NarrativeEvent"
import type { NarrativeEventType } from "./NarrativeEventType"
import { NarrativePriority } from "./NarrativePriority"

export class EventFactory {

  static create<T>(

    type: NarrativeEventType,

    payload: T,

    priority: NarrativePriority,

  ): NarrativeEvent<T> {

    return {

      type,

      priority,

      payload,

    }

  }

}