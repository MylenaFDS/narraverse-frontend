import type { MemoryEvent } from "../../MemoryEngine"

export interface MemoryReasoningResult {

  importantMemories: MemoryEvent[]

  summary: string

  emotionalWeight: number

}