export interface GameEvent {
  id: string

  type:
    | "combat"
    | "death"
    | "discovery"
    | "politics"
    | "travel"
    | "dialogue"
    | "item"
    | "world"

  title: string

  description: string

  importance: number

  timestamp: number

  metadata?: Record<string, unknown>
}

export class EventEngine {
  private static events: GameEvent[] = []

  static register(
    event: Omit<GameEvent, "id" | "timestamp">
  ) {
    const created: GameEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    }

    this.events.push(created)

    return created
  }

  static getAll() {
    return [...this.events]
  }

  static getImportantEvents(
    minimumImportance = 70
  ) {
    return this.events.filter(
      (event) =>
        event.importance >= minimumImportance
    )
  }

  static getByType(
    type: GameEvent["type"]
  ) {
    return this.events.filter(
      (event) =>
        event.type === type
    )
  }

  static clear() {
    this.events = []
  }
}