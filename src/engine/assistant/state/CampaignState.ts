import type { CharacterState } from "./CharacterState"
import type { QuestState } from "./QuestState"
import type { WorldState } from "./WorldState"

export interface CampaignState {

  turn: number

  characters: CharacterState[]

  quests: QuestState[]

  world: WorldState

  activeEvents: string[]

}