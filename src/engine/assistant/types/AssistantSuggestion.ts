export interface AssistantSuggestion {

  title: string

  description: string

  type:
    | "action"
    | "warning"
    | "event"
    | "character"
    | "strategy"

}