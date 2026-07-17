import type { NarrativeEventType } from "./NarrativeEventType"

import { NarrativePriority } from "./NarrativePriority"

export interface NarrativeEvent<T = unknown> {

  type: NarrativeEventType

  priority: NarrativePriority

  payload: T

}