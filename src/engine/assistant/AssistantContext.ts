import type {
  RPGTurn,
} from "../../types/turn"

import type {
  Character,
} from "../../types/character"

import type {
  StoryContext,
} from "../writer/story/types/StoryContext"

import type {
  CampaignState,
} from "./state/CampaignState"



export interface AssistantContext {


  // ==================================
  // Turno atual
  // ==================================

  turn?: RPGTurn



  // ==================================
  // Estado da campanha
  // ==================================

  campaignState: CampaignState



  // ==================================
  // História
  // ==================================

  story: StoryContext



  // ==================================
  // Personagens
  // ==================================

  characters: Character[]


}