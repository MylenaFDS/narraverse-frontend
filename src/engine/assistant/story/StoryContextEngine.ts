import type { Character } from "../../../types/character"
import type { RPGTurn } from "../../../types/turn"

import type { CampaignState } from "../state/CampaignState"

import type { StoryContext } from "../../writer/story/types/StoryContext"

import { StoryContextBuilder } from "./StoryContextBuilder"

export class StoryContextEngine {

  static create(

    campaign: CampaignState,

    turns: RPGTurn[],

    characters: Character[],

  ): StoryContext {

    return StoryContextBuilder.build(

      campaign,

      turns,

      characters,

    )

  }

}